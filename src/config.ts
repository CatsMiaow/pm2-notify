export const env = process.env.NODE_ENV || 'local';
export const isProd = (env === 'production');

export const config = {
  mail: {
    from: 'me <from@test.com>',
    to: 'to@test.com',
  },
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'GmailAddress',
      pass: 'GoogleAppPassword',
    },
  },
  target: {
    'log:err': ['appName'],
  },
  subject: `Error - ${process.env.USER}@${process.env.HOSTNAME}`,
  template: `${__dirname}/../views/template.html`,
  timeout: 10000,
};
