import type { Viewport } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/header";
import { getTranslations } from 'next-intl/server';
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { NextAuthProvider } from "@/components/providers/next-auth-provider";
import { getMessages, type Locale } from "./i18n.config";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { locales } from "./i18n.config";

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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  
  return {
    title: {
      template: "%s | Hazard Report",
      default: t("title"),
    },
    description: t("description"),
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound()

  let messages
  try {
    messages = await getMessages({ locale })
  } catch {
    notFound()
  }

  return (
    <html lang={locale} className={inter.className} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <NextAuthProvider>
                <div>
                  <Header />
                  {children}
                </div>
              </NextAuthProvider>
              <Toaster />
            </SidebarProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
} 