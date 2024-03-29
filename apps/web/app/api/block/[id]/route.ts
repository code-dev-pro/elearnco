import { prisma } from "database";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ERoutes } from "schemas";

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`/${ERoutes.SIGN}`);
  }

  try {
    const json = await request.json();
    const block = await prisma.block.create({
      data: json,
    });

    const json_response = {
      status: "success",
      data: { block },
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

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`/${ERoutes.SIGN}`);
  }

  try {
    const id = params.id;
    const block = await prisma.block.delete({
      where: { id: id },
    });

    const json_response = {
      status: "success",
      data: { block },
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

    const updated_feedback = await prisma.block.update({
      where: { id },
      data: json,
    });

    const json_response = {
      status: "success",
      data: {
        feedback: updated_feedback,
      },
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
