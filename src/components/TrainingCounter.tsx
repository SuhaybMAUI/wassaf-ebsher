'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TrainingCounterProps {
  totalTrainings?: number;
  lastTrainedAt?: string | null;
  refreshInterval?: number;
}

export function TrainingCounter({
  totalTrainings: initialTotal,
  lastTrainedAt: initialLastTrained,
  refreshInterval = 30000,
}: TrainingCounterProps) {
  const [totalTrainings, setTotalTrainings] = useState(initialTotal ?? 0);
  const [lastTrainedAt, setLastTrainedAt] = useState<string | null>(initialLastTrained ?? null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setTotalTrainings(data.totalTrainings);
          setLastTrainedAt(data.lastTrainedAt);
        }
      } catch (error) {
        console.error('Failed to fetch training stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'لم يتم التدريب بعد';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;

    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="w-full bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي التدريبات</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{totalTrainings.toLocaleString('ar-SA')}</span>
                {totalTrainings > 0 && (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                )}
              </div>
            </div>
          </div>
          <div className="text-left">
            <Badge variant="outline" className="gap-1">
              <Clock className="w-3 h-3" />
              آخر تدريب
            </Badge>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDate(lastTrainedAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TrainingCounter;
