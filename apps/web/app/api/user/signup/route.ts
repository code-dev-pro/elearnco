import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { prisma } from "database";
import { generateConfirmationCode } from "lib/utils";
import { NextResponse } from "next/server";

import { sendEmail } from "@/emails";
import WelcomeEmail from "@/emails/welcome-email";
interface IData {
  data: { email: string; name: string; password: string; role: Role };
}

export async function POST(request: Request) {
  const { data } = (await request.json()) as IData;

  const defaultLocale = request.headers.get("x-default-locale") ?? "fr";
  const HASH = await bcrypt.hash(data.password, 10);

  /** CREATE A NEW USER IN DB */
  const new_user = {
    name: data.name,
    email: data.email,
    locale: defaultLocale,
    image: "default",
    password: HASH,
    role: data.role || Role.TEACHER,
  };

  /*   */
  try {
    const user = await prisma.user.create({
      data: new_user,
    });

    await prisma.author.create({
      data: {
        name: data.name,
        image: "default",
        role: data.role || Role.TEACHER,
        userId: user.id,
      },
    });

    /** CREATE A USER EMAIL CHECKED IN DB */
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);
    const token = randomBytes(32).toString("hex");
    const hashed = token;
    const code = generateConfirmationCode();
    await prisma.emailVerificationToken.create({
      data: {
        expiresAt,
        token: hashed,
        userId: user.id,
        code: code,
      },
    });

    const url = `${process.env.VERCEL_URL}/validate?token=${token}&id=${user.id}`;

    await sendEmail({
      email: data.email,
      subject: "Sign up to Elearnco",
      react: WelcomeEmail({
        name: data.name,
        email: data.email,
        code: code,
        url: url,
      }),
      marketing: false,
      test: false,
    });
    const { password: _password, ...safeUser } = user;

    const json_response = {
      status: "success",
      data: { safeUser },
    };

    return new NextResponse(JSON.stringify(json_response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const error_response = {
      status: "fail",
      message: error,
    };
    return new NextResponse(JSON.stringify(error_response), {
      status: 409,
      headers: { "Content-Type": "application/json" },
    });
  }
}
