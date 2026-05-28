import nodemailer from 'nodemailer';

type SendOptions = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: Array<{ filename: string; content: string | Buffer }>;
};

export async function sendEmail(opts: SendOptions) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    // In dev, just log the message
    // eslint-disable-next-line no-console
    console.log('sendEmail (dev):', { to: opts.to, subject: opts.subject });
    return { ok: true, dev: true };
  }

  const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });

  const info = await transporter.sendMail({ from: process.env.SMTP_FROM || user, to: opts.to, subject: opts.subject, html: opts.html, text: opts.text, attachments: opts.attachments?.map(a => ({ filename: a.filename, content: a.content })) });
  return { ok: true, info };
}
