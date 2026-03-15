import { notFound } from 'next/navigation';
import { GAMES, GameConfig } from '@/lib/games';
import { ChatPage } from '../_comp/chat-page';
import game1Content from '../game1/content.json';
import game2Content from '../game2/content.json';

interface AnswerOption {
  text: string;
  nextQuestionId: number | null;
  loveAmount: number;
  endMessage?: string | string[];
}

interface Question {
  questionId: number;
  question: string;
  answerOptions: AnswerOption[];
}

type ContentData = {
  [key: string]: Question;
};

const contentMap: Record<string, ContentData> = {
  game1: game1Content as ContentData,
  game2: game2Content as ContentData,
};

export default async function Page({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  const game = GAMES.find((g: GameConfig) => g.id === gameId);
  const content = contentMap[gameId];

  if (!game || !content) notFound();

  return <ChatPage contentData={content} gameConfig={game} />;
}
