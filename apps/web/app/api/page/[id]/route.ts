import { prisma } from "database";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ERoutes } from "schemas";

const addPageAtIndex = async (courseId, json, index) => {
  const newPage = await prisma.$transaction(async (tx) => {
    await tx.page.updateMany({
      where: { courseId, index: { gte: index } },
      data: { index: { increment: 1 } },
    });

    return tx.page.create({
      data: json,
    });
  });

  return newPage;
};

const removePageAtIndex = async (courseId, id, index) => {
  await prisma.$transaction(async (tx) => {
    await prisma.page.delete({
      where: { id: id },
    });

    await tx.page.updateMany({
      where: { courseId, index: { gt: index } },
      data: { index: { decrement: 1 } },
    });
  });
};

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`/${ERoutes.SIGN}`);
  }
  const idPage = params.id;
  try {
    const page = await prisma.page.findMany({
      where: {
        id: idPage,
      },
      include: {
        blocks: {
          orderBy: {
            index: "asc",
          },
          include: {
            content: true,
         
          },
        },
      },
    });
    const json_response = {
      status: "success",
      data: { page },
    };

    return new NextResponse(JSON.stringify(json_response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      const error_response = {
        status: "fail",
        message: "",
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
export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`/${ERoutes.SIGN}`);
  }

  try {
    const json = await request.json();

    const page = await addPageAtIndex(json.courseID, json, json.index);
    // We need to update all index page
    // const page = await prisma.page.create({
    //   data: json,
    // });

    const json_response = {
      status: "success",
      data: { page },
    };

    return new NextResponse(JSON.stringify(json_response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const error_response = {
      status: "fail",
      message: "",
    };

    return new NextResponse(JSON.stringify(error_response), {
      status: 409,
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

    const result = await prisma.page.update({
      where: { id },
      data: json,
    });

    const json_response = {
      status: "success",
      data: result,
    };

    return new NextResponse(JSON.stringify(json_response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      const error_response = {
        status: "fail",
        message: "",
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
    const json = await request.json();

    await removePageAtIndex(json.courseID, id, json.index);

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.code === "P2025") {
      const error_response = {
        status: "fail",
        message: "",
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
