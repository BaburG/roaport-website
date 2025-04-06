import { getTranslations, type Locale } from '@/i18n';
import { LandingPageContent } from '@/components/LandingPageContent';

export const dynamic = 'force-dynamic';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Handle params as a promise
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const messages = await getTranslations(locale);
  
  // Prepare landing page messages
  const landingMessages = {
    tagline: messages.Landing.tagline || "Road Hazard Reporting System",
    description: messages.Landing.description || "ROAPORT is an innovative platform that enables citizens to report road hazards and infrastructure issues quickly and efficiently.",
    subDescription: messages.Landing.subDescription || "Join thousands of users who are making roads safer for everyone by reporting potholes, broken traffic lights, and other hazards.",
    viewReports: messages.Landing.viewReports || "View Reports",
    exploreMap: messages.Landing.exploreMap || "Explore Map",
    downloadApp: messages.Landing.downloadApp || "Download Our Mobile App",
    scanToDownload: messages.Landing.scanToDownload || "Scan QR code with your phone camera to download the app"
  };
  
  return (
    <main className="min-h-screen bg-background flex flex-col relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/2 left-1/3 w-1/4 h-1/4 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-16 md:py-28 flex-grow relative z-10">
        <LandingPageContent 
          messages={landingMessages} 
          locale={locale}
        />
      </div>
    </main>
  )
} 