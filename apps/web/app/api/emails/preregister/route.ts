import { NextResponse } from "next/server";
import { Resend } from "resend";

import PregisterEmail from "@/emails/preregister-email";

//NOTE - SOME PB WITH RESEND WHEN DEPLOYING ON VERCEL
export async function POST() {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { data, error } = await resend.emails.send({
      from: "",
      to: [""],
      subject: "Hello world",
      react: PregisterEmail({ email: "" }),
    });

    if (error) {
      return NextResponse.json({ error });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
