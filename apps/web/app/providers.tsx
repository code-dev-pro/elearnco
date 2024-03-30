"use client";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { Next13ProgressBar } from "next13-progressbar";
import { Suspense } from "react";
import { Toaster } from "sonner";

export interface ProvidersProps {
  themeProps?: ThemeProviderProps;
}
export function Providers({
  themeProps,
  children,
}: React.PropsWithChildren<ProvidersProps>) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark" {...themeProps}>
        <SessionProvider>
          <Toaster richColors position="bottom-right" />
          <Suspense>
            <Next13ProgressBar
              height="4px"
              color="#0A2FFF"
              options={{ showSpinner: false }}
              showOnShallow
            />
          </Suspense>
          {children}
        </SessionProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
