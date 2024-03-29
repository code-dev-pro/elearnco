import { PropsWithChildren } from "react";

import { ParentModalUI } from "@/components/parentModal";
export default async function Layout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <div className="flex py-6 md:py-0 h-screen h-screen-ios">
      <div className="relative flex bg-foreground-100 grow max-w-full bg-n-1 rounded-[1.25rem] md:rounded-none lg:pr-0">
        <div className="relative flex flex-col grow max-w-full md:pt-18">
          <ParentModalUI />

          {children}
        </div>
      </div>
    </div>
  );
}
