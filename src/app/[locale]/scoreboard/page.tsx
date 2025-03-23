import { Suspense } from 'react';
import { getScores } from '@/lib/scores';
import { ScoreboardList } from '@/components/ui/ScoreboardList';
import { ScoreboardSkeleton } from '@/components/ui/ScoreboardSkeleton';

export const dynamic = 'force-dynamic';

export default async function ScoreboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const titles: Record<string, string> = {
    en: "Upload Scoreboard",
    tr: "Yükleme Skor Tablosu"
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">{titles[locale]}</h1>
      <Suspense fallback={<ScoreboardSkeleton />}>
        <ScoreboardData />
      </Suspense>
    </div>
  );
}

async function ScoreboardData() {
  const scores = await getScores();
  return <ScoreboardList initialScores={scores} />;
} 