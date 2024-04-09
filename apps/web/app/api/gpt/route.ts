import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
//import OpenAI from "openai";
import { ERoutes } from "schemas/routes/enums";

import { getServerSession } from "@/lib/auth.options";
//const apiKey = process.env.OPENAI_API_KEY;
// const openai = new OpenAI({
//   apiKey: apiKey,
// });
export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`/${ERoutes.SIGN}`);
  }
  
  
  const req = await request.json();
  const content = req.content;
 
  // try {
  //   const completion = await openai.completions.create({
  //     model: "text-davinci-003",
  //     temperature: 0.5,
  //     prompt: content,
  //     max_tokens: 150,
  //   });

  //   return new NextResponse(JSON.stringify(""), {
  //     status: 201,
  //     headers: { "Content-Type": "application/json" },
  //   });
  // } catch (error) {
  //   const error_response = {
  //     status: "error",
  //     message: error.message,
  //   };

  //   return new NextResponse(JSON.stringify(error_response), {
  //     status: 500,
  //     headers: { "Content-Type": "application/json" },
  //   });
  // }
}
