import { prisma } from "database";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ERoutes } from "schemas";

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

    const folder = await prisma.folder.delete({
      where: { id: id },
    });

    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: { ...folder },
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
    const folder = await prisma.folder.update({
      where: { id: id },
      data: json,
    });

    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: { ...folder },
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
