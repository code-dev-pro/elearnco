import { Lato } from "next/font/google";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";

import { getMessages } from "@/lib/messages";

import { Providers } from "../providers";

type Props = {
  children: ReactNode;
  params: { locale: string; path: string };
};

const lato = Lato({
  weight: ["400", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export async function generateStaticParams() {
  return ["fr", "en", "es"].map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Readonly<Props>) {
  const messages = await getMessages(locale);

  return (
    <html
      lang={locale}
      className={`dark ${lato.className}`}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider
          locale={locale}
          messages={messages as AbstractIntlMessages}
        >
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
