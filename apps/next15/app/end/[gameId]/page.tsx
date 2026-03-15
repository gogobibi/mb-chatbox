import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { GAMES, GameConfig } from '@/lib/games';
import { EndingPage } from '../_comp/ending-page';

export default async function Page({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  const game = GAMES.find((g: GameConfig) => g.id === gameId);

  if (!game) notFound();

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-black">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <EndingPage gameConfig={game} />
    </Suspense>
  );
}
