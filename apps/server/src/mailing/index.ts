import nodemailer from 'nodemailer';
import config from '../config';

const { SMTP_SECRET, SMTP_USER, SMTP_HOST, SMTP_PASS, SMTP_PORT } =
  config.emailing;

export const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'connor.kuvalis64@ethereal.email',
    pass: 'Fak9WprCUvZ2BeFbeH'
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendMail = (mailOptions: Object, callback: any) =>
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    callback();
  });
