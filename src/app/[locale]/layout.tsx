import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/header";
import { getTranslations, type Locale } from '@/i18n';
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { NextAuthProvider } from "@/components/providers/next-auth-provider";
import { getMessages } from "next-intl/server";

// Font configuration
const inter = Inter({
  subsets: ["latin"],
});

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "tr" }];
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations(locale as Locale);

  return {
    title: {
      template: "%s | Hazard Report",
      default: t("metadata.title"),
    },
    description: t("metadata.description"),
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  let messages
  try {
    messages = await getMessages({ locale })
  } catch (error) {
    console.error("Failed to load messages:", error)
    notFound()
  }

  return (
    <html lang={locale} className={inter.className} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NextAuthProvider>
            <div>
              <Header />
              {children}
            </div>
          </NextAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
} 