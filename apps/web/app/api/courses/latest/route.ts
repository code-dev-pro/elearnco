import { prisma } from "database";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { CourseResponse, ERoutes } from "schemas";

import { getServerSession } from "@/lib/auth.options";

/**
 * Get user last course
 * @param request
 * @returns CourseResponse
 */

export async function GET(): Promise<NextResponse<CourseResponse>> {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`/${ERoutes.SIGN}`);
  }
  try {
    const course = await prisma.course.findMany({
      where: {
        userId: session?.user?.id,
      },
      include: {
        author: true,
        folder: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    });

    const json_response = {
      status: "success",
      data: course,
    };
    return new NextResponse(JSON.stringify(json_response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
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
