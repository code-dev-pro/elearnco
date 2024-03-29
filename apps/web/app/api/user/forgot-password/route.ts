import { randomBytes } from "crypto";
import { prisma } from "database";
import { add } from "date-fns";
import { NextResponse } from "next/server";

import { sendEmail } from "@/emails";
import ForgetEmail from "@/emails/forget-email";

export async function POST(request: Request) {
  const { data } = await request.json();
  let json_response = { status: "", data: {} };
  const user_email = {
    email: data.email as string,
  };

 

  try {
    const user = await prisma.user.findUnique({
      where: user_email,
    });

    if (!user) {
      json_response = {
        status: "success",
        data: { message: "User not found" },
      };
      return new NextResponse(JSON.stringify(json_response), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    const resetToken = randomBytes(20).toString("hex");
    const resetTokenExpiry = add(new Date(), { hours: 1 }); // 1 hour
    const resetLink = `${process.env.VERCEL_URL}/reset?token=${resetToken}`;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });
    // Send the email with the reset link
    try {
      // Send the email with the reset link

      await sendEmail({
        email: data.email,
        subject: "Reset password Elearnco",
        react: ForgetEmail({
          email: data.email,
          url: resetLink,
        }),
        marketing: false,
        test: false,
      });

      json_response = {
        status: "success",
        data: { message: "Reset e-mail successfully sent" },
      };
      return new NextResponse(JSON.stringify(json_response), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (emailError) {
      console.error("Error when sending the reset email", emailError);

      json_response = {
        status: "fail",
        data: {
          message: "An error occurred when sending the reset email",
        },
      };
      return new NextResponse(JSON.stringify(json_response), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    if (error.code === "P2002") {
      const error_response = {
        status: "fail",
        message: "user_exist",
      };

      return new NextResponse(JSON.stringify(error_response), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      const error_response = {
        status: "fail",
        message: "error server",
      };
      return new NextResponse(JSON.stringify(error_response), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}
