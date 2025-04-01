export const dynamic = 'force-dynamic';

export default async function MapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const titles: Record<string, string> = {
    en: "Hazard Map",
    tr: "Tehlike Haritası"
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">{titles[locale]}</h1>
      <div className="h-[600px] w-full">
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <p>Map Component</p>
        </div>
      </div>
    </div>
  )
} 