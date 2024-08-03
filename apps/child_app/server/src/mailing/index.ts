import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Mail from 'nodemailer/lib/mailer';
import config from '../config';

const { SMTP_USER, SMTP_HOST, SMTP_PASS, SMTP_PORT } = config.emailing;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  },
  debug: true,
  logger: true
});

export const sendMail = (
  mailOptions: Mail.Options,
  callback: (err: Error | null, info: SMTPTransport.SentMessageInfo) => void
) => transporter.sendMail(mailOptions, callback);
