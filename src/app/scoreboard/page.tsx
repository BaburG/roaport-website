import { Suspense } from 'react';
import { getScores } from '@/lib/scores';
import { ScoreboardList } from '@/components/ui/ScoreboardList';
import { ScoreboardSkeleton } from '@/components/ui/ScoreboardSkeleton';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Upload Scoreboard',
  description: 'View the top uploaders and their scores',
};

async function ScoreboardData() {
  const scores = await getScores();
  return <ScoreboardList initialScores={scores} />;
}

export default function ScoreboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Upload Scoreboard</h1>
      <Suspense fallback={<ScoreboardSkeleton />}>
        <ScoreboardData />
      </Suspense>
    </div>
  );
}
