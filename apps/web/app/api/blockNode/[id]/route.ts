import { prisma } from "database";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ERoutes } from "schemas";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`/${ERoutes.SIGN}`);
  }

  try {
    const json = await request.json();
   
  
    if (params.id) {
      const blockIdDuParent = await prisma.block.findUnique({
        where: { uuid: params.id },
        select: { id: true },
      });

     

      if (blockIdDuParent && blockIdDuParent?.id !== null) {
        const updatedBlockNode = await prisma.blockNode.upsert({
          where: { uuid: params.id },
          update: {
            content: json,
            block: { connect: { id: blockIdDuParent.id } },
          },
          create: {
            uuid: params.id,
            title: "",
            description: "",
            content: {},
            type: "",
            block: { connect: { id: blockIdDuParent.id } },
          },
        });

        const json_response = {
          status: "success",
          data: { updatedBlockNode },
        };
        return new NextResponse(JSON.stringify(json_response), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      }

      const json_response = {
        status: "fail",
        message: "blockIdDuParent not found.",
      };
      return new NextResponse(JSON.stringify(json_response), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      console.error("Bloc parent non trouvé avec l'UUID spécifié.");
      const json_response = {
        status: "fail",
        message: "ID not found.",
      };
      return new NextResponse(JSON.stringify(json_response), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }
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

    const blocknode = await prisma.blockNode.findUnique({
      where: {
        uuid: id,
      },
      include: {
        Drawing:true
      }
    });

    
   

    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: { ...blocknode },
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

