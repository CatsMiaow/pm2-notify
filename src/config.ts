import 'dotenv/config';
import { hostname, userInfo } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { env } = process;
const {
  NODE_ENV = 'localhost',
  USER = userInfo().username,
  HOSTNAME = hostname(),
  PM2_APPS = '',
} = env;

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  // https://nodemailer.com/message
  mail: {
    subject: `Error - ${USER}@${HOSTNAME}:${NODE_ENV}`,
    from: env.MAIL_FROM ?? 'me <from@test.com>',
    to: env.MAIL_TO ?? 'to@test.com',
  },
  // https://nodemailer.com/smtp
  smtp: {
    host: env.SMTP_HOST ?? 'smtp.gmail.com',
    port: Number(env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  },
  /**
   * https://pm2.keymetrics.io/docs/usage/application-declaration/#general
   * appName is the value assigned to `--name` in PM2
   * ['api', 'server', 'admin', ...]
   */
  target: {
    'log:err': PM2_APPS.split(',').map((appName) => appName.trim()),
    // 'log:err': ['appName'], // stderr
    // 'log:out': ['appName'], // stdout, As required
  },
  // MJML template
  template: `${dirname}/../views/template.html`,
  // Send mail every timeout(ms)
  timeout: Number(env.SEND_INTERVAL) || 10000,
};
