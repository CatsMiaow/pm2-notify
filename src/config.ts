import { existsSync } from 'node:fs';
import { hostname, userInfo } from 'node:os';

const envFile = new URL('../.env', import.meta.url);
if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

const { env } = process;
const {
  NODE_ENV = 'localhost',
  USER = userInfo().username,
  HOSTNAME = hostname(),
  MAIL_FROM = '',
  MAIL_TO = '',
} = env;

if (!MAIL_FROM || !MAIL_TO) {
  throw new Error('Set MAIL_FROM and MAIL_TO in .env');
}

function list(value = ''): string[] {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

export const config = {
  // https://nodemailer.com/message
  mail: {
    subject: `Error - ${USER}@${HOSTNAME}:${NODE_ENV}`,
    from: MAIL_FROM,
    to: MAIL_TO,
  },
  // https://nodemailer.com/smtp
  // Port 465 uses TLS from the start, other ports must upgrade with STARTTLS
  smtp: {
    host: env.SMTP_HOST ?? 'smtp.gmail.com',
    port: Number(env.SMTP_PORT) || 587,
    requireTLS: true,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  },
  /**
   * https://pm2.keymetrics.io/docs/usage/application-declaration/#general
   * App names are the values given to `--name` in PM2
   * `log:err` is stderr and `log:out` is stdout
   */
  target: {
    'log:err': list(env.PM2_APPS),
    'log:out': list(env.PM2_OUT_APPS),
  },
  // How long to collect logs before sending them in one mail (seconds)
  sendInterval: Number(env.SEND_INTERVAL) || 10,
};

if (config.sendInterval < 1 || config.sendInterval > 86400) {
  throw new Error('SEND_INTERVAL must be 1 to 86400 seconds');
}
