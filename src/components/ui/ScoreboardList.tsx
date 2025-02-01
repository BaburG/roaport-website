'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Score {
  id: number;
  username: string;
  total: number;
}

interface ScoreboardListProps {
  initialScores: Score[];
}

export function ScoreboardList({ initialScores }: ScoreboardListProps) {
  const [scores] = useState<Score[]>(initialScores);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {scores.map((score, index) => (
          <motion.div
            key={score.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {score.username}
                </CardTitle>
                <Badge variant="secondary">Rank {index + 1}</Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{score.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{score.total}</p>
                    <p className="text-sm text-muted-foreground">Total Uploads</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

