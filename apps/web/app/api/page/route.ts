import { prisma, PrismaClient } from "database";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { CompletePage, ERoutes } from "schemas";

const reorderPages = async (newPageOrder: CompletePage[]) => {
  const updateOperations = newPageOrder.map(
    ({ id, index }: { id: string; index: number }) => {
      return {
        where: { id },
        data: { index },
      };
    }
  );
  const result = await prisma.$transaction(async (tx: PrismaClient) => {
    await tx.page.updateMany({
      data: updateOperations.map(operation => operation.data),
      where: {
        OR: updateOperations.map(operation => operation.where)
      }
    });
  });

  return result;
};
export async function PATCH(request: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`/${ERoutes.SIGN}`);
  }

  try {
    const json = await request.json();
    const result = await reorderPages(json);

    const json_response = {
      status: "success",
      data: result,
    };

    return new NextResponse(JSON.stringify(json_response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
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
