import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


export const EmailSend = async (emailTo, emailText, emailSubject) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_KEY,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: emailTo,
    subject: emailSubject,
    text: emailText, // plain‑text body
  };

  return await transporter.sendMail(mailOptions);
};
