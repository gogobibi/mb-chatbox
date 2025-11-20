'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, Home, RotateCcw, Trophy } from 'lucide-react';

const BOT_AVATAR = '/m.jpg';
const MAX_SCORE = 150;

interface EndingType {
  title: string;
  message: string;
  color: string;
  gradient: string;
}

const ENDINGS: Record<string, EndingType> = {
  perfect: {
    title: '완벽한 엔딩',
    message: '우리 정말 잘 통하는 것 같아! 다음에 또 얘기하자!',
    color: 'text-pink-600',
    gradient: 'from-pink-500 to-rose-500',
  },
  good: {
    title: '좋은 엔딩',
    message: '오늘 대화 즐거웠어! 앞으로도 잘 지내보자!',
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-purple-500',
  },
  normal: {
    title: '평범한 엔딩',
    message: '대화해줘서 고마워. 다음에 또 보자!',
    color: 'text-gray-600',
    gradient: 'from-gray-500 to-slate-500',
  },
  bad: {
    title: '아쉬운 엔딩',
    message: '오늘은 좀 힘들었나 봐. 다음엔 더 잘 얘기해보자...',
    color: 'text-slate-600',
    gradient: 'from-slate-500 to-gray-600',
  },
};

function getEndingType(score: number, maxScore: number): EndingType {
  const percentage = (score / maxScore) * 100;

  if (percentage >= 80) return ENDINGS.perfect;
  if (percentage >= 60) return ENDINGS.good;
  if (percentage >= 40) return ENDINGS.normal;
  return ENDINGS.bad;
}

export function EndingPage() {
  const searchParams = useSearchParams();
  const scoreParam = searchParams.get('score');
  const [score, setScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [bestScore, setBestScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const finalScore = scoreParam ? parseInt(scoreParam, 10) : 0;
  const ending = getEndingType(finalScore, MAX_SCORE);
  const percentage = Math.min((finalScore / MAX_SCORE) * 100, 100);

  useEffect(() => {
    // 로컬스토리지에서 최고 점수 읽기
    const storedBestScore = localStorage.getItem('bestFinalScore');
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
  }, [finalScore]);

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="flex h-screen w-full max-w-[500px] flex-col bg-gradient-to-br from-white to-gray-50 shadow-xl overflow-hidden relative">
        {/* 배경 장식 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${ending.gradient} opacity-20 blur-3xl`}
          />
          <div
            className={`absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br ${ending.gradient} opacity-20 blur-3xl`}
          />
        </div>

        {/* 컨텐츠 */}
        <div className="relative flex-1 flex flex-col items-center justify-center p-8 space-y-8">
          {/* 캐릭터 아바타 */}
          <div className="relative">
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${ending.gradient} opacity-30 blur-xl animate-pulse`}
            />
            <Avatar className="h-32 w-32 border-4 border-white shadow-xl relative">
              <AvatarImage src={BOT_AVATAR} alt="마르코" />
              <AvatarFallback>마르코</AvatarFallback>
            </Avatar>
            {!isAnimating && percentage >= 80 && (
              <div className="absolute -top-2 -right-2 animate-bounce">
                <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />
              </div>
            )}
          </div>

          {/* 엔딩 타입 */}
          <div className="text-center space-y-2">
            <h1 className={`text-3xl font-bold ${ending.color}`}>
              {ending.title}
            </h1>
            <p className="text-base text-gray-600 max-w-xs">{ending.message}</p>
          </div>

          {/* 애정도 표시 */}
          <div className="w-full max-w-xs space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart
                    className={`w-5 h-5 ${isAnimating ? 'animate-pulse' : ''}`}
                    style={{
                      color: ending.gradient.includes('pink')
                        ? '#ec4899'
                        : '#6b7280',
                    }}
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    최종 애정도
                  </span>
                </div>
                <span className={`text-2xl font-bold ${ending.color}`}>
                  {score}점
                </span>
              </div>
              <Progress
                value={percentage}
                className="h-3 transition-all duration-500"
              />
            </div>

            {/* 최고 점수 표시 */}
            {bestScore > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">
                      최고 기록
                    </span>
                  </div>
                  <span className="text-lg font-bold text-purple-700">
                    {bestScore}점
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3 pt-4">
            <Link href="/chat">
              <Button variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                다시 하기
              </Button>
            </Link>
            <Link href="/">
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <Home className="w-4 h-4" />
                홈으로
              </Button>
            </Link>
          </div>
        </div>

        {/* 하단 크레딧 */}
        <div className="relative p-4 text-center border-t border-gray-200 bg-white/50 backdrop-blur-sm">
          <p className="text-xs text-gray-500">
            대화를 마쳤어요. 다음에 또 만나요! 👋
          </p>
        </div>
      </div>
    </div>
  );
}
