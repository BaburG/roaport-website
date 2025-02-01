import { prisma } from '@/lib/prisma';

export async function getScores() {
  const scores = await prisma.uploadScoreboard.findMany({
    orderBy: {
      total: 'desc',
    },
    take: 100,
  });

  return scores;
}

