import { NextApiRequest, NextApiResponse } from 'next';
import { fetchScores } from '@/lib/data';

// example data for now

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch the top 10 users from the upload_scoreboard table ordered by total in descending order
    const topUsers = await fetchScores();
    // Return the top 10 users as a JSON response
    res.status(200).json(topUsers);
  } catch (error) {
    console.error('Error fetching top users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}