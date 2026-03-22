import { GAMES } from '@/lib/games';
import { MainPage } from './_comp/main-page';
import game1Content from './chat/game1/content.json';
import game2Content from './chat/game2/content.json';

const contentMap: Record<string, { '1'?: { question: string } }> = {
  game1: game1Content,
  game2: game2Content,
};

export default function Home() {
  const chatList = GAMES.map((game) => ({
    gameId: game.id,
    botName: game.botName,
    botAvatar: game.botAvatar,
    previewMessage: contentMap[game.id]?.['1']?.question ?? '...',
  }));

  return <MainPage chatList={chatList} />;
}
