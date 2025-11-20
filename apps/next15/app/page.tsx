import { MainPage } from './_comp/main-page';
import contentData from './chat/content.json';

export default function Home() {
  const firstQuestion = contentData['1']?.question || '메시지를 불러올 수 없습니다.';
  return <MainPage previewMessage={firstQuestion} />;
}
