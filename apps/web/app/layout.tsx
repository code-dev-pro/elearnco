import "@/styles/globals.css";

import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }: Readonly<React.PropsWithChildren>) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
