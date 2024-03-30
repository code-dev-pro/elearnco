import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { ERoutes } from "schemas";

export default async function IndexPage() {
  const session = await getServerSession();
  if (session) {
    redirect(`/${ERoutes.HOME}`);
  }

  redirect(`/${ERoutes.WELCOME}`);
}
