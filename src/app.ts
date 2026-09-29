import type { EventEmitter } from 'node:events';
import { promisify } from 'node:util';
import pm2 from 'pm2';

import { config } from './config.ts';
import { sendLogs } from './mail.ts';
import type { QData } from './render.ts';

interface Packet {
  data: string;
  process: { name: string };
}

const queue: QData[] = [];
let scheduled = false;
// Sends run one at a time, so a slow SMTP server never gets overlapping connections
let sending = Promise.resolve();

async function sendMail(): Promise<void> {
  // Drain and unschedule together, so logs arriving while sending get their own mail
  const items = queue.splice(0);
  scheduled = false;

  try {
    const info = await sendLogs(items);
    console.log('SendMail', info);
  } catch (error) {
    console.error(error);
  }
}

function enqueue(data: QData): void {
  queue.push(data);
  if (!scheduled) {
    scheduled = true;
    setTimeout(() => {
      sending = sending.then(sendMail);
    }, config.sendInterval * 1000);
  }
}

if (Object.values(config.target).flat().length === 0) {
  throw new Error('Set PM2_APPS or PM2_OUT_APPS in .env');
}

// https://github.com/nodejs/node/issues/13338#issuecomment-546494270
await promisify(pm2.connect).bind(pm2)();
console.log('[PM2] Log streaming connected');

const bus = await promisify<EventEmitter>(pm2.launchBus).bind(pm2)();
console.log('[PM2] Log streaming launched');

for (const [event, apps] of Object.entries(config.target)) {
  if (apps.length === 0) {
    continue;
  }

  console.log(`[PM2] ${event} streaming started`);
  bus.on(event, (packet: Packet) => {
    if (apps.includes(packet.process.name)) {
      enqueue({ event, name: packet.process.name, message: packet.data });
    }
  });
}
