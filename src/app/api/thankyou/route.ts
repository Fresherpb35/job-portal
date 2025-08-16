// src/app/api/thankyou/route.ts
import { NextResponse } from "next/server";
import { sendMail, compileThankYouEmailTemplate } from "@/lib/server/mail";

export async function POST(req: Request) {
  try {
    const { email, fullName } = await req.json();

    const html = compileThankYouEmailTemplate(fullName);

    const response = await sendMail({
      to: email,
      subject: "Thank you for applying",
      body: html,
    });

    if (response?.messageId) {
      return NextResponse.json({ message: "Mail delivered" }, { status: 200 });
    }

    return NextResponse.json({ message: "Mail not sent" }, { status: 400 });
  } catch (error) {
    console.error("[MAIL ERROR]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
