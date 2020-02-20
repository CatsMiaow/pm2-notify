const { NODE_ENV = 'local', USER, HOSTNAME } = process.env;

export const config = {
  // https://nodemailer.com/message
  mail: {
    subject: `Error - ${USER}@${HOSTNAME}:${NODE_ENV}`,
    from: 'me <from@test.com>',
    to: 'to@test.com',
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
