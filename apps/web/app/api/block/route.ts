import { prisma } from "database";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { CompleteBlock, CompletePage, ERoutes, GenericObject } from "schemas";

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`/${ERoutes.SIGN}`);
  }

  try {
    const json = await request.json();
    const { modifiedBlocks, deletedBlockIds } = json as {
      modifiedBlocks: [CompleteBlock & { action: string }];
      deletedBlockIds: string[];
    };

    const addedBlocks = modifiedBlocks.filter(
      (block: CompleteBlock & { action: string }) => block.action === "create"
    );
    const updatedBlocks = modifiedBlocks.filter(
      (block: CompleteBlock & { action: string }) => block.action === "update"
    );

    const transactionPromises: Promise<GenericObject>[] = [];
    const updatedTransactionPromises: Promise<GenericObject>[] = [];

    for (const block of updatedBlocks) {
      const existingBlock = await prisma.block.findUnique({
        where: { uuid: block.uuid },
      });
      if (existingBlock) {
        const { action, content, ...newBlock } = block ;
        updatedTransactionPromises.push(
          prisma.block.update({
            where: { uuid: block.uuid },
            data: newBlock as Partial<CompletePage> ,
          })
        );
      }
    }

    for (const block of addedBlocks) {
      const existingBlock = await prisma.block.findUnique({
        where: { uuid: block.uuid },
      });
      if (existingBlock) {
        const { action, content, ...newBlock } = block;
        transactionPromises.push(
          prisma.block.update({
            where: { uuid: block.uuid },
            data: newBlock as Partial<CompletePage>,
          })
        );
      } else {
       
        const { action, content, ...newBlock } = block;
        transactionPromises.push(prisma.block.create({ data: newBlock as any }));
      }
    }

    const updatedResults = await Promise.all(updatedTransactionPromises);
    const addedResults = await Promise.all(transactionPromises);

    await prisma.block.deleteMany({
      where: { uuid: { in: deletedBlockIds } },
    });
    const blocksResponse = [...updatedResults, ...addedResults];

    const json_response = {
      status: "success",
      data: blocksResponse,
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
