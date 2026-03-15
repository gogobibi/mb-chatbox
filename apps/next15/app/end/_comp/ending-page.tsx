'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, RotateCcw, Trophy } from 'lucide-react';
import { GameConfig } from '@/lib/games';

interface EndingPageProps {
  gameConfig: GameConfig;
}

export function EndingPage({ gameConfig }: EndingPageProps) {
  const searchParams = useSearchParams();
  const scoreParam = searchParams.get('score');
  const [score, setScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [bestScore, setBestScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const finalScore = scoreParam ? parseInt(scoreParam, 10) : 0;
  const percentage = Math.min((finalScore / gameConfig.maxScore) * 100, 100);
  const isPink = finalScore > 0;

  useEffect(() => {
    // 로컬스토리지에서 최고 점수 읽기 (gameId 네임스페이스)
    const bestScoreKey = `bestFinalScore_${gameConfig.id}`;
    const storedBestScore = localStorage.getItem(bestScoreKey);
    const best = storedBestScore ? parseInt(storedBestScore, 10) : 0;
    setBestScore(best);
    setIsNewRecord(finalScore >= best && finalScore > 0);

    // 애정도 카운트업 애니메이션
    const duration = 2000;
    const steps = 60;
    const increment = finalScore / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setScore(finalScore);
        clearInterval(timer);
        setIsAnimating(false);
      } else {
        setScore(Math.floor(increment * currentStep));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [finalScore, gameConfig.id]);

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="flex h-screen w-full max-w-[500px] flex-col bg-gradient-to-br from-white to-gray-50 shadow-xl overflow-hidden relative">
        {/* 배경 장식 */}
        {isPink && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-pink-200 to-rose-200 opacity-40 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-pink-200 to-rose-200 opacity-40 blur-3xl" />
          </div>
        )}

        {/* 컨텐츠 */}
        <div className="relative flex-1 flex flex-col items-center justify-center p-8 space-y-8">
          {/* 캐릭터 아바타 */}
          <div className="relative">
            {isPink && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-200 to-rose-200 opacity-50 blur-xl animate-pulse" />
            )}
            <Avatar className="h-32 w-32 border-4 border-white shadow-xl relative">
              <AvatarImage src={gameConfig.botAvatar} alt={gameConfig.botName} />
              <AvatarFallback>{gameConfig.botName}</AvatarFallback>
            </Avatar>
            {!isAnimating && percentage >= 80 && (
              <div className="absolute -top-2 -right-2 animate-bounce">
                <Heart className="w-12 h-12 text-pink-300 fill-pink-300" />
              </div>
            )}
          </div>

          {/* 애정도 표시 */}
          <div className="w-full max-w-xs space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart
                    className={`w-5 h-5 ${isAnimating ? 'animate-pulse' : ''}`}
                    style={{
                      color: isPink ? '#f9a8d4' : '#6b7280',
                    }}
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    최종 애정도
                  </span>
                </div>
                <span className={`text-2xl font-bold ${isPink ? 'text-pink-400' : 'text-gray-600'}`}>
                  {score}점
                </span>
              </div>
              <Progress
                value={Math.min((score / gameConfig.maxScore) * 100, 100)}
                className="h-3 transition-all duration-500"
              />
            </div>

            {/* 최고 점수 표시 */}
            {bestScore > 0 && (
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-pink-400" />
                    <span className="text-sm font-medium text-pink-600">
                      최고 기록
                    </span>
                  </div>
                  <span className="text-lg font-bold text-pink-500">
                    {bestScore}점
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3 pt-4">
            <Link href="/">
              <Button className="gap-2 bg-gradient-to-r from-pink-300 to-rose-300 hover:from-pink-400 hover:to-rose-400 text-white">
                <RotateCcw className="w-4 h-4" />
                다시 하기
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
