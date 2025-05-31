import { getTranslations, type Locale } from '@/i18n';
import { LandingPageContent } from '@/components/LandingPageContent';

export const dynamic = 'force-dynamic';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getTranslations(locale as Locale);
  
  // Prepare landing page messages
  const landingMessages = {
    tagline: messages.Landing.tagline,
    description: messages.Landing.description,
    subDescription: messages.Landing.subDescription,
    viewReports: messages.Landing.viewReports,
    exploreMap: messages.Landing.exploreMap,
    downloadApp: messages.Landing.downloadApp,
    scanToDownload: messages.Landing.scanToDownload,
    howItWorks: messages.Landing.howItWorks,
    step1Title: messages.Landing.step1Title,
    step1Description: messages.Landing.step1Description,
    step2Title: messages.Landing.step2Title,
    step2Description: messages.Landing.step2Description,
    step3Title: messages.Landing.step3Title,
    step3Description: messages.Landing.step3Description,
    step4Title: messages.Landing.step4Title,
    step4Description: messages.Landing.step4Description,
    featuresTitle: messages.Landing.featuresTitle,
    feature1Title: messages.Landing.feature1Title,
    feature1Description: messages.Landing.feature1Description,
    feature2Title: messages.Landing.feature2Title,
    feature2Description: messages.Landing.feature2Description,
    feature3Title: messages.Landing.feature3Title,
    feature3Description: messages.Landing.feature3Description,
    feature4Title: messages.Landing.feature4Title,
    feature4Description: messages.Landing.feature4Description
  };
  
  return (
    <main className="min-h-screen bg-background relative overflow-hidden overflow-x-hidden">
      {/* Background decoration with improved responsiveness */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-full md:w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-full md:w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/2 left-1/3 w-1/4 h-1/4 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Content with improved container padding */}
      <div className="relative z-10">
        <LandingPageContent 
          messages={landingMessages} 
          locale={locale}
        />
      </div>
    </main>
  )
} 