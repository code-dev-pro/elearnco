import { prisma } from "database";
import { getServerSession } from "@/lib/auth.options";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { ERoutes } from "schemas";

async function saveDrawing(
  content: any,
  blockNodeId: string,
  userId: string,
  drawingId?: string
) {
  if (drawingId !== "undefined") {
    const existingDrawing = await prisma.drawing.findUnique({
      where: {
        id: drawingId,
      },
    });

    if (existingDrawing && drawingId) {
      return updateDrawing(drawingId, content);
    } else {
      throw new Error(`Le dessin avec l'ID ${drawingId} n'existe pas.`);
    }
  } else {
    return createDrawing(content, blockNodeId, userId);
  }
}

async function createDrawing(
  content: any,
  blockNodeId: string,
  userId: string
) {
  const drawing = await prisma.drawing.create({
    data: {
      content: content,
      blockNode: { connect: { uuid: blockNodeId } },
      user: { connect: { id: userId } },
    },
  });
  return drawing;
}

async function updateDrawing(drawingId: string, content: any) {
  const updatedDrawing = await prisma.drawing.update({
    where: {
      id: drawingId,
    },
    data: {
      content: content,
    },
  });
  return updatedDrawing;
}
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`/${ERoutes.SIGN}`);
  }
  try {
    const drawingId = params.id;

    const requestBody = await request.json();

    const drawing = await saveDrawing(
      requestBody.content,
      requestBody.blockNodeId,
      session.user.id,
      drawingId
    );

    const json_response = {
      status: "success",
      data: drawing,
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
    await prisma.drawing.delete({
      where: { id: id },
    });

    const json_response = {
      status: "success",
      data: {},
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
