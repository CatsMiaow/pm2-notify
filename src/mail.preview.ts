// Sends made-up logs rendered with the current template, so template changes can be checked in a mail client without running the app
import { config } from './config.ts';
import { sendLogs } from './mail.ts';

const jsonLog = {
  level: 50,
  time: Date.now(),
  msg: 'Job failed',
  job: { id: 42, queue: 'emails', attempts: 3 },
  err: {
    type: 'TimeoutError',
    message: 'Request timed out after 30000ms',
    stack: 'TimeoutError: Request timed out after 30000ms\n    at Timeout._onTimeout (/app/src/jobs/send-email.js:27:15)\n    at listOnTimeout (node:internal/timers:588:17)',
  },
};

const info = await sendLogs(
  [
    { event: 'log:err', name: 'api', message: 'Error: connect ECONNREFUSED 127.0.0.1:5432\n    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1611:16)\n' },
    { event: 'log:err', name: 'worker', message: `${JSON.stringify(jsonLog)}\n` },
    { event: 'log:err', name: 'api', message: 'Warning: <tags> & "quotes" in logs are escaped\n' },
    { event: 'log:out', name: 'worker', message: 'Job 43 completed in 120ms\n' },
  ],
  `[Preview] ${config.mail.subject}`,
);
console.log('Preview mail sent', info);
