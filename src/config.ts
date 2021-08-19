import dotenv from 'dotenv';
import { hostname, userInfo } from 'os';

dotenv.config();
const {
  NODE_ENV = 'local', USER = userInfo().username, HOSTNAME = hostname(),
  SMTP_HOST = 'smtp.gmail.com', SMTP_PORT = 587, SMTP_USER, SMTP_PASS,
  MAIL_FROM = 'me <from@test.com>', MAIL_TO = 'to@test.com',
  PM2_APPS = '',
} = process.env;

export const config = {
  // https://nodemailer.com/message
  mail: {
    subject: `Error - ${USER}@${HOSTNAME}:${NODE_ENV}`,
    from: MAIL_FROM,
    to: MAIL_TO,
  },
  // https://nodemailer.com/smtp
  smtp: {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
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
  template: `${__dirname}/../views/template.html`,
  // Send mail every timeout(ms)
  timeout: 10000,
};
