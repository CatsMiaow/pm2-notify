export const env = process.env.NODE_ENV || 'local';
export const isProd = (env === 'production');

export const config = {
  // https://nodemailer.com/message
  mail: {
    from: 'me <from@test.com>',
    to: 'to@test.com',
    subject: `Error - ${process.env.USER}@${process.env.HOSTNAME}`,
  },
  // https://nodemailer.com/smtp
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'GmailAddress',
      pass: 'GoogleAppPassword',
    },
  },
  /**
   * https://pm2.keymetrics.io/docs/usage/application-declaration/#general
   * appName is the value assigned to `--name` in PM2
   * ['api', 'server', 'admin', ...]
   */
  target: {
    'log:err': ['appName'], // stderr
    // 'log:out': ['appName'], // stdout, As required
  },
  // MJML template
  template: `${__dirname}/../views/template.html`,
  // Send mail every timeout(ms)
  timeout: 10000,
};
