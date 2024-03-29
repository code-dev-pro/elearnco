import { apiGPT } from "lib/requests/api.request";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { ERoutes } from "schemas/routes/enums";

import { getServerSession } from "@/lib/auth.options";


export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`/${ERoutes.SIGN}`);
  }
  const req = await request.json();
  const content = req.content;


  try {
    const completion = await apiGPT(content);

    
    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: completion,
      }),
      { status: 201, headers: { "content-type": "text/event-stream" } }
    );
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
