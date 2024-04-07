import { Prisma, prisma } from "database";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ERoutes } from "schemas";

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

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`/${ERoutes.SIGN}`);
  }

  try {
    const id = params.id;
    const course = await prisma.course.findUnique({
      where: {
        id: id,
      },
      include: {
        tags: {
          orderBy: [
            {
              label: "asc",
            },
          ],
        },
        pages: {
          orderBy: [
            {
              index: "asc",
            },
          ],
          select: {
            id: true,
            title: true,
            description: true,
            cover: true,
            status: true,
            index: true,
            blocks: {
              include: {
                content: {
                  include: {
                    Drawing: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: { ...course },
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    if (error.code === "P2025") {
      const error_response = {
        status: "fail",
        message: error?.meta?.cause,
      };
      return new NextResponse(JSON.stringify(error_response), {
        status: 404,
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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`/${ERoutes.SIGN}`);
  }

  try {
    const id = params.id;
    const json = await request.json();
    const { tags, tagsUser, userId, ...course } = json;

    await addTagsToCourse(id, tags);
    await addTagsToUser(userId, tagsUser);
    const result = await prisma.course.update({
      where: { id: id },
      include: {
        author: true,
        folder: true,
        tags: true,
      },
      data: course,
    });

    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: { ...result },
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    if (error.code === "P2025") {
      const error_response = {
        status: "fail",
        message: error?.meta?.cause,
      };
      return new NextResponse(JSON.stringify(error_response), {
        status: 404,
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`/${ERoutes.SIGN}`);
  }
  try {
    const id = params.id;

    const course = await prisma.course.delete({
      where: { id },
    });

    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: { ...course },
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    if (error.code === "P2025") {
      const error_response = {
        status: "fail",
        message: "No course with the Provided ID Found",
      };
      return new NextResponse(JSON.stringify(error_response), {
        status: 404,
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
