import { prisma, User } from "database";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ERoutes } from "schemas";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect(`/${ERoutes.SIGN}`);
  }

  try {
    const id = params.id;
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        author: true,
      },
    });

    const { password, ...rest } = user as User;
    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: { rest },
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
  if (!session || !session.user) {
    redirect(`/${ERoutes.SIGN}`);
  }

  try {
    const id = params.id;

    const courses = await prisma.course.deleteMany({
      where: {
        userId: id,
      },
    });

    const author = await prisma.author.delete({
      where: {
        userId: id,
      },
    });

   

    const folder = await prisma.folder.deleteMany({
      where: {
        userId: id,
      },
    });


    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: {},
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
