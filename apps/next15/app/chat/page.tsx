import { ChatPage } from './_comp/chat-page';
import contentData from './content.json';

interface Question {
  questionId: number;
  question: string;
  answerOptions: Array<{
    text: string;
    nextQuestionId: number | null;
    loveAmount: number;
  }>;
}

type ContentData = {
  [key: string]: Question;
};

export default function Page() {
  return <ChatPage contentData={contentData as ContentData} />;
}
