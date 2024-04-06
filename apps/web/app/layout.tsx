import "@/styles/globals.css";
import { HighlightInit } from '@highlight-run/next/client'
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }: Readonly<React.PropsWithChildren>) {
  return (
    <>
    <HighlightInit
				projectId={'kgrw4wme'}
				serviceName="my-nextjs-frontend"
				tracingOrigins
				networkRecording={{
					enabled: true,
					recordHeadersAndBody: true,
					urlBlocklist: [],
				}}
			/>
      {children}
      <Analytics />
    </>
  );
}
