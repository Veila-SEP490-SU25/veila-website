'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface SpanTimerProps {
  totalTime: number;
  isTimerStarted: boolean;
  onTimeUp: () => void;
  className?: string;
}

export const SpanTimer = ({
  totalTime,
  isTimerStarted,
  onTimeUp,
  className = '',
}: SpanTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    if (!isTimerStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerStarted, onTimeUp]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    // If hours is 0, don't show it
    if (hours === 0) {
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return <span className={cn('text-maroon-500 font-bold', className)}>{formatTime(timeLeft)}</span>;
};
