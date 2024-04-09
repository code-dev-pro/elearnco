import { Prisma, prisma } from "database";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { ERoutes, ErrorResponse, FetchResponse } from "schemas";
import { CourseDate, CourseStatus, CourseTitle } from "schemas/menus/dropdown";

import { MAX_CARDS } from "@/const";
import { getServerSession } from "@/lib/auth.options";

async function addTagsToUser(
  userId: string,
  tags: Prisma.TagUserCreateManyInput[]
) {
  await prisma.tagUser.deleteMany({
    where: { userId: userId },
  });

  const tagObjects: Prisma.TagUserCreateManyInput[] = tags.map(
    (tag: Prisma.TagUserCreateManyInput) => ({
      label: tag.label,
      color: tag.color,
      uuid: tag.uuid,
      userId: userId,
    })
  );

  await prisma.tagUser.createMany({
    data: tagObjects,
  });
}
async function addTagsToCourse(
  courseId: string,
  tags: Prisma.TagUserCreateManyInput[]
) {
  await prisma.course.findUnique({
    where: { id: courseId },
    include: { tags: true },
  });

  await prisma.tagCourse.deleteMany({
    where: { courseId },
  });

  const tagObjects: Prisma.TagCourseCreateManyInput[] = tags.map(
    (tag: Prisma.TagUserCreateManyInput) => ({
      label: tag.label,
      color: tag.color,
      uuid: tag.uuid,
      courseId: courseId,
    })
  );

  await prisma.tagCourse.createMany({
    data: tagObjects,
  });
}


/**
 * Get user courses
 * @param request
 * @returns CourseResponse
 */

export async function GET(
  request: NextRequest
): Promise<NextResponse<FetchResponse>> {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`/${ERoutes.SIGN}`);
  }

  try {
    const req = request?.nextUrl?.searchParams;

    const page = Number(req.get("page")) || (1 as number);
    const status =
      (req.get("status") as CourseStatus) ||
      (CourseStatus.DRAFT as CourseStatus);
    const folder = (req.get("folder") as string) || "all";
    const order =
      (req.get("order") as CourseTitle) || (CourseTitle.AZ as CourseTitle);
    const date = (req.get("date") as CourseDate) || CourseDate.RECENT;

    let courses;
    if (folder === "All") {
      courses = await prisma.$transaction([
        prisma.course.findMany({
          orderBy: [
            {
              createdAt: date === CourseDate.CREATED ? "desc" : "asc",
            },
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
            tags: true,
            user: {
              select: {
                Tag: true,
              },
            },
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
              createdAt: date === CourseDate.CREATED ? "desc" : "asc",
            },
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
            tags: true,
            user: {
              select: {
                Tag: true,
              },
            },
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
 * @returns CourseResponse | ErrorResponse
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<FetchResponse | ErrorResponse>> {
  
  
  
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`/${ERoutes.SIGN}`);
  }

  try {
    const json = await request.json();
    const { tags, tagsUser, ...course } = json;

    const courseCreated = await prisma.course.create({
      data: course,
      include: {
        author: true,
        folder: true,
      },
    });

    await addTagsToCourse(courseCreated.id, tags);
    await addTagsToUser(session.user.id, tagsUser);

    const page = await prisma.page.create({
      data: {
        course: { connect: { id: courseCreated.id } },
        index: 1,
        title: "",
        description: "",
      },
    });

    const json_response = {
      status: "success",
      data: { course: courseCreated, page: page },
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
