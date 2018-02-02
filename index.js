const fs = require('fs');
const nodemailer = require('nodemailer');
const { markdown } = require('nodemailer-markdown');
const pm2 = require('pm2');

const template = require('./template');
const config = require('./config.json');

const subject = template(config.subject, process.env);
const body = fs.readFileSync(config.template || './template/body.md', 'utf8');
const sublist = fs.readFileSync(config.template || './template/sublist.md', 'utf8');
const events = Object.keys(config.target);
const queue = {};
let timeout = null;

const transporter = nodemailer.createTransport(config.smtp, {
  from: config.mail.from,
  to: config.mail.to,
});
transporter.use('compile', markdown());


function sendMail() {
  const qvents = Object.keys(queue);
  const templates = [];

  if (qvents.length < 1) {
    return;
  }

  qvents.forEach((event) => {
    const content = []; // 프로젝트별 오류 묶음
    queue[event].forEach((data) => {
      content[data.name] = content[data.name] || '';
      content[data.name] += data.message;
    });

    const messages = []; // 프로젝트별 메시지
    Object.keys(content).forEach((name) => {
      messages.push(template(sublist, { name, message: content[name] }));
    });

    templates.push(template(body, { event, message: messages.join('\n') }));

    delete queue[event];
  });

  transporter.sendMail({
    subject,
    markdown: templates.join('\n'),
  }).then((info) => {
    console.log(info);
  }).catch((err) => {
    console.error(err);
  }).then(() => { // finally
    timeout = null;
  });
}

pm2.connect(() => {
  pm2.launchBus((err, bus) => {
    console.log('[PM2] Log streaming started');

    events.forEach((event) => {
      bus.on(event, (packet) => {
        if (!config.target[event].includes(packet.process.name)) {
          return;
        }

        queue[event] = queue[event] || [];
        queue[event].push({
          event,
          name: packet.process.name,
          message: packet.data,
        });

        if (!timeout) {
          timeout = setTimeout(sendMail, config.timeout);
        }
      });
    });
  });
});
