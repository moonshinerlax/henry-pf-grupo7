import { purchaseEmail } from "@/components/siteEmails/PurchaseEmail";
import Handlebars from "handlebars";
import nodemailer from "nodemailer";

export async function sendMail(subject: string, toEmail: string, otpText: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PW,
    },
  });
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: toEmail,
    subject: subject,
    html: otpText,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email Sent");
    return true;
  } catch (error) {
    console.log(error);
  }
}

