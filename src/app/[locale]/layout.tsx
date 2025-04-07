import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/header";
import { getTranslations, locales, type Locale } from '@/i18n';

// Font configurations
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

// Define viewport separately as recommended by Next.js
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  // Handle params as a promise
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const messages = await getTranslations(locale);
  
  return {
    title: `ROAPORT - ${messages.Layout.title}`,
    description: locale === 'en' 
      ? "ROAPORT is an innovative road hazard reporting system that enables citizens to report infrastructure issues quickly and efficiently."
      : "ROAPORT, vatandaşların yol tehlikelerini ve altyapı sorunlarını hızlı ve verimli bir şekilde bildirmelerini sağlayan yenilikçi bir platformdur.",
    keywords: locale === 'en' 
      ? "road hazards, infrastructure, reporting system, potholes, safety, ROAPORT"
      : "yol tehlikeleri, altyapı, bildirim sistemi, çukurlar, güvenlik, ROAPORT",
    authors: [{ name: "ROAPORT Team" }],
    robots: "index, follow",
    openGraph: {
      type: "website",
      title: `ROAPORT - ${messages.Layout.title}`,
      description: locale === 'en'
        ? "Report road hazards and infrastructure issues quickly and efficiently with ROAPORT."
        : "ROAPORT ile yol tehlikelerini ve altyapı sorunlarını hızlı ve verimli bir şekilde bildirin.",
      siteName: "ROAPORT",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Handle params as a promise
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <div>
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
} 