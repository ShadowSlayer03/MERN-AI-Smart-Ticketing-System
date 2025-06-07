import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_SMTP_HOST,
  port: process.env.MAILTRAP_SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.MAILTRAP_SMTP_USER,
    pass: process.env.MAILTRAP_SMTP_PASS,
  },
});

export const sendMail = async (to, subject, content) => {
  try {
    const result = await transporter.sendMail({
      from: "AI Smart Ticketing<smart-ticketing@gmail.com>",
      to: to,
      subject: subject,
      html: content,
    });

    if (result?.messageId) console.log("Message sent:", result);
    return result;
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    throw error;
  }
};
