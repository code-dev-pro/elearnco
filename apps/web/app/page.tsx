import { redirect } from "next/navigation";
import { ERoutes } from "schemas";

export default async function Page() {
  redirect(`/${ERoutes.WELCOME}`);
}
