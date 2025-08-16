// src/lib/mail.ts
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import { ThankYouTemplate } from "./designs/thank-you";

export const sendMail = async ({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) => {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    const sendResult = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: body,
    });

    return sendResult;
  } catch (error) {
    console.error("[MAIL ERROR]", error);
    throw error; // throw instead of toast
  }
};

export const compileThankYouEmailTemplate = (name: string) => {
  const template = handlebars.compile(ThankYouTemplate);
  return template({ name });
};
