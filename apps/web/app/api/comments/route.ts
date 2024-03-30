import { prisma } from "database";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { CompleteComment, ERoutes } from "schemas";

import { getServerSession } from "@/lib/auth.options";


export async function POST(
  request: NextRequest
): Promise<NextResponse<CompleteComment>> {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`/${ERoutes.SIGN}`);
  }

  try {
    const json = await request.json();
    const comment = await prisma.comment.create({
      data: json,
      include: {
        user: true
      }
     
    });
   
    const json_response = {
      status: "success",
      data: comment,
    };

    return new NextResponse(JSON.stringify(json_response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error.code === "P2002") {
      const error_response = {
        status: "fail",
        message: "Existed!",
      };
      return new NextResponse(JSON.stringify(error_response), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const error_response = {
      status: "error",
      message: error.message,
    };
    return new NextResponse(JSON.stringify(error_response), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
