'use client';

import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Heart } from 'lucide-react';

interface LoveMeterProps {
  currentScore: number;
  maxScore: number;
}

export function LoveMeter({ currentScore, maxScore }: LoveMeterProps) {
  const [prevScore, setPrevScore] = useState(currentScore);
  const [isIncreasing, setIsIncreasing] = useState(false);

  useEffect(() => {
    if (currentScore > prevScore) {
      setIsIncreasing(true);
      setTimeout(() => setIsIncreasing(false), 500);
    }
    setPrevScore(currentScore);
  }, [currentScore, prevScore]);

  const percentage = Math.min((currentScore / maxScore) * 100, 100);

  return (
    <div
      className={`px-4 py-2 space-y-1 transition-all duration-300 ${
        isIncreasing ? 'bg-pink-50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Heart
            className={`w-4 h-4 text-pink-500 fill-pink-500 transition-transform ${
              isIncreasing ? 'scale-125 animate-pulse' : 'scale-100'
            }`}
          />
          <span className="text-xs font-medium text-imessage-text-dark">
            애정도
          </span>
        </div>
        <span
          className={`text-xs font-semibold text-pink-500 transition-all ${
            isIncreasing ? 'scale-110' : 'scale-100'
          }`}
        >
          {currentScore}점
          {isIncreasing && (
            <span className="ml-1 text-green-500 animate-bounce">↑</span>
          )}
        </span>
      </div>
      <Progress value={percentage} className="h-2 transition-all duration-500" />
    </div>
  );
}
