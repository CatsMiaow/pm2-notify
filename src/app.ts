/* eslint-disable no-console */
import fs from 'node:fs';
import handlebars from 'handlebars';
import he from 'he';
import mjml2html from 'mjml';
import { createTransport } from 'nodemailer';
import pm2 from 'pm2';
import { EventEmitter } from 'node:stream';
import { promisify } from 'node:util';

import { config } from './config.js';
import { Target, Packet, Log, QData } from './types.js';

const template = handlebars.compile(fs.readFileSync(config.template, 'utf8'));
const transporter = createTransport(config.smtp, { ...config.mail });

const events = <[Target]>Object.keys(config.target);
const queues = <Record<Target, QData[]>>{};
let timeout: NodeJS.Timer | null = null;

events.forEach((event: Target) => {
  queues[event] = [];
});

async function sendMail(): Promise<void> {
  const logs: Log[] = [];

  for (const [event, qdata] of Object.entries(queues)) {
    const content: Record<string, string> = {};

    for (const data of qdata.splice(0, qdata.length)) {
      content[data.name] = content[data.name] || '';
      content[data.name] += data.message;
    }

    for (const [name, message] of Object.entries(content)) {
      logs.push({ name: `${name} ${event}`, message: he.encode(message) });
    }
  }

  try {
    const content = template({ logs });
    const { errors, html } = mjml2html(content);
    if (errors.length > 0) {
      throw new Error(JSON.stringify(errors));
    }

    const info = await transporter.sendMail({ html });
    console.log('SendMail', info);
  } catch (err) {
    console.error(err);
  } finally {
    timeout = null;
  }
}

function eventBus(event: Target, packet: Packet): void {
  if (!config.target[event].includes(packet.process.name)) {
    return;
  }

  queues[event].push({
    event,
    name: packet.process.name,
    message: packet.data,
  });

  if (!timeout) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    timeout = setTimeout(sendMail, config.timeout);
  }
}

(async (): Promise<void> => {
  // https://github.com/nodejs/node/issues/13338#issuecomment-546494270
  await promisify(pm2.connect).bind(pm2)();
  console.log('[PM2] Log streaming connected');

  const bus = <EventEmitter> await promisify(pm2.launchBus).bind(pm2)();
  console.log('[PM2] Log streaming launched');

  for (const event of events) {
    console.log(`[PM2] ${event} streaming started`);
    bus.on(event, (packet: Packet) => eventBus(event, packet));
  }
})().catch(console.error);
