import { createTransport, type SentMessageInfo } from 'nodemailer';

import { config } from './config.ts';
import { render, type QData } from './render.ts';

const transporter = createTransport(config.smtp, config.mail);

export async function sendLogs(queue: QData[], subject = config.mail.subject): Promise<SentMessageInfo> {
  return transporter.sendMail({ subject, html: await render(queue) });
}
