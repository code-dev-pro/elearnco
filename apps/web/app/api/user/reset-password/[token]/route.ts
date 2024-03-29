import { compare } from "bcrypt";
import bcrypt from "bcrypt";
import { prisma } from "database";
import { isAfter } from "date-fns";
import { NextResponse } from "next/server";
interface IData {
  data: { password: string };
}
export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  const { data } = (await request.json()) as IData;

  const token = params.token;
  
  if (typeof token !== "string") {
    const error_response = {
      status: "fail",
      data: { message: "Token of reset password invalidate" },
    };
    return new NextResponse(JSON.stringify(error_response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Check the validity of the token and recover resettokenexpiry from the database
    const user = await prisma.user.findUnique({
      where: { resetToken: token },
    });
  
    if (!user || isAfter(new Date(), user.resetTokenExpiry as Date)) {
      const error_response = {
        status: "fail",
        data: { message: "Token of reset the invalid or expired password" },
      };
      return new NextResponse(JSON.stringify(error_response), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Check that the new password is not identical to the old

    const passwordMatch = await compare(data.password, user.password);

    if (passwordMatch) {
      const error_response = {
        status: "fail",
        data: { message: "The new password cannot be identical to the old" },
      };
      return new NextResponse(JSON.stringify(error_response), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }
    const HASH = await bcrypt.hash(data.password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: HASH,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    const json_response = {
      status: "success",
      data: { message: "Reset password successfully" },
    };
    return new NextResponse(JSON.stringify(json_response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const error_response = {
      status: "fail",
      data: { message: "error server" },
    };
    return new NextResponse(JSON.stringify(error_response), {
      status: 409,
      headers: { "Content-Type": "application/json" },
    });
  }
}
