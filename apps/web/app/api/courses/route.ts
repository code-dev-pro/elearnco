import { prisma } from "database";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { CourseResponse, ERoutes } from "schemas";
import { CourseStatus, CourseTitle } from "schemas/menus/dropdown";

import { MAX_CARDS } from "@/const";
import { getServerSession } from "@/lib/auth.options";

/**
 * Get user courses
 * @param request
 * @returns CourseResponse
 */

export async function GET(
  request: NextRequest
): Promise<NextResponse<CourseResponse>> {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect(`/${ERoutes.SIGN}`);
  }
  try {
    const req = request.nextUrl.searchParams;
    const page = Number(req.get("page")) || (1 as number);
    const status = (req.get("status") as CourseStatus) || CourseStatus.DRAFT as CourseStatus;
    const folder = (req.get("folder") as string) || "all";
    const order = (req.get("order") as CourseTitle) || CourseTitle.AZ as CourseTitle;
    let courses;
    if (folder === "all") {
      courses = await prisma.$transaction([
        prisma.course.findMany({
          orderBy: [
            {
              title: order === (CourseTitle.ZA as CourseTitle) ? "desc" : "asc",
            },
          ],
          where: {
            userId: session?.user?.id,
            status: status,
          },
          skip: (page - 1) * MAX_CARDS,
          take: MAX_CARDS,

          include: {
            author: true,
            folder: true,
          },
        }),
        prisma.course.count({
          where: {
            status: status,
          },
        }),
      ]);
    } else {
      courses = await prisma.$transaction([
        prisma.course.findMany({
          orderBy: [
            {
              title: order === (CourseTitle.ZA as CourseTitle) ? "desc" : "asc",
            },
          ],
          where: {
            userId: session?.user?.id,
            status: status,
            folder: {
              name: folder,
            },
          },
          skip: (page - 1) * MAX_CARDS,
          take: MAX_CARDS,

          include: {
            author: true,
            folder: true,
          },
        }),
        prisma.course.count({
          where: {
            status: status,
            folder: {
              name: folder,
            },
          },
        }),
      ]);
    }

    const json_response = {
      status: "success",
      data: courses,
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
/**
 * Create a new course
 * @param request
 * @returns CourseResponse
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<CourseResponse>> {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect(`/${ERoutes.SIGN}`);
  }

  try {
    const json = await request.json();

    const course = await prisma.course.create({
      data: json,
      include: {
        author: true,
      },
    });
   
    const json_response = {
      status: "success",
      data:  course ,
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
