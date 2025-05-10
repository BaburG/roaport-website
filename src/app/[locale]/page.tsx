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
    scanToDownload: messages.Landing.scanToDownload || "Scan QR code with your phone camera to download the app",
    // Add missing required properties with default values
    howItWorks: "How Roaport Works",
    step1Title: "Snap & Send",
    step1Description: "Easily report hazards using your phone's camera and GPS.",
    step2Title: "AI Verification",
    step2Description: "Our smart system quickly verifies the legitimacy of reports.",
    step3Title: "Track Progress",
    step3Description: "See real-time updates as authorities address the issue.",
    step4Title: "Safer Communities",
    step4Description: "Contribute to making your city's infrastructure better for everyone.",
    featuresTitle: "Why Choose Roaport?",
    feature1Title: "Effortless Reporting",
    feature1Description: "Submit hazard reports in seconds with our intuitive mobile app.",
    feature2Title: "Transparent Tracking",
    feature2Description: "View all reported hazards on a public map and monitor their status.",
    feature3Title: "AI-Powered Accuracy",
    feature3Description: "Machine learning helps ensure reports are genuine and correctly categorized.",
    feature4Title: "Community Driven",
    feature4Description: "Be part of the solution for safer roads and public spaces."
  };
  
  return (
    <main className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/2 left-1/3 w-1/4 h-1/4 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Content */}
      <LandingPageContent 
        messages={landingMessages} 
        locale={locale}
      />
    </main>
  )
} 