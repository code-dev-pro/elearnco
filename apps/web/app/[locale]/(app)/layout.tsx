import AuthProvider from "lib/providers/auth.provider";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { ERoutes } from "schemas";
import { NavBarTopUI } from "ui";

import { ParentModalUI } from "@/components/parentModal";
import WrapperChild from "@/components/wrapperChild";
import { getServerSession } from "@/lib/auth.options";

const DynamicBarAppTop = dynamic(() => import("ui/menu/components/BarAppTop"), {
  loading: () => <></>,
});

export default async function Layout(props: Readonly<React.PropsWithChildren>) {
  const session = await getServerSession();

  if (!session) {
    redirect(`/${ERoutes.SIGN}`);
  }

  return (
    <AuthProvider session={session}>
      <ParentModalUI />
      <div className="flex h-full bg-default-50">
        <div className="relative flex grow max-w-full rounded-[1.25rem] md:rounded-none">
          <div className="relative flex flex-col grow max-w-full min-h-screen">
            <NavBarTopUI>
              <DynamicBarAppTop />
            </NavBarTopUI>
            <div className="ml-3 mr-3 mb-3 overflow-hidden rounded-e-3xl rounded-s-3xl bg-default-100 z-0 h-full">
              <WrapperChild>{props.children}</WrapperChild>
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
