'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronLeft } from 'lucide-react';
import { IPhoneChatBubbleYou } from '@/components/chat/iphone-chat-bubble-you';
import { IPhoneChatBubbleMe } from '@/components/chat/iphone-chat-bubble-me';
import { IPhoneChatOption } from '@/components/chat/iphone-chat-option';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { LoveMeter } from '@/components/chat/love-meter';

interface AnswerOption {
  text: string;
  nextQuestionId: number | null;
  loveAmount: number;
}

interface Question {
  questionId: number;
  question: string;
  answerOptions: AnswerOption[];
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

type ContentData = {
  [key: string]: Question;
};

const BOT_AVATAR = '/m.jpg';
const USER_AVATAR = '/b.png';
const MAX_LOVE_SCORE = 150;

interface ChatPageProps {
  contentData: ContentData;
}

export function ChatPage({ contentData }: ChatPageProps) {
  const firstQuestion = contentData['1'];
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: firstQuestion.question,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(firstQuestion);
  const [messageIdCounter, setMessageIdCounter] = useState(2);
  const [isTyping, setIsTyping] = useState(false);
  const [isWaitingForNextOptions, setIsWaitingForNextOptions] = useState(false);
  const [loveScore, setLoveScore] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleAnswerClick = (option: AnswerOption) => {
    // 애정도 업데이트
    const newLoveScore = Math.max(0, loveScore + option.loveAmount);
    setLoveScore(newLoveScore);

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: messageIdCounter,
      text: option.text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setMessageIdCounter((prev) => prev + 1);

    // 선택지 숨기고 타이핑 시작
    setIsWaitingForNextOptions(true);
    setIsTyping(true);

    if (option.nextQuestionId !== null) {
      // 0.5초 후: 타이핑 종료 + B 메시지 표시
      setTimeout(() => {
        setIsTyping(false);
        const nextQuestion = contentData[
          option.nextQuestionId!.toString()
        ];
        if (nextQuestion) {
          const botMessage: Message = {
            id: messageIdCounter + 1,
            text: nextQuestion.question,
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
          setCurrentQuestion(nextQuestion);
          setMessageIdCounter((prev) => prev + 1);
        }
      }, 500);

      // 1.0초 후: 선택지 표시
      setTimeout(() => {
        setIsWaitingForNextOptions(false);
      }, 1000);
    } else {
      // 대화 종료 - 로컬스토리지에 점수 저장 및 엔딩 페이지로 이동
      setTimeout(() => {
        setIsTyping(false);
        const endMessage: Message = {
          id: messageIdCounter + 1,
          text: '대화를 마칠게! 즐거웠어',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, endMessage]);
        setCurrentQuestion(null);
        setMessageIdCounter((prev) => prev + 1);
        setIsWaitingForNextOptions(false);

        // 로컬스토리지에 점수 저장
        localStorage.setItem('currentFinalScore', newLoveScore.toString());
        const bestScore = localStorage.getItem('bestFinalScore');
        if (!bestScore || newLoveScore > parseInt(bestScore, 10)) {
          localStorage.setItem('bestFinalScore', newLoveScore.toString());
        }

        // 1초 후 엔딩 페이지로 이동
        setTimeout(() => {
          window.location.href = `/end?score=${newLoveScore}`;
        }, 1000);
      }, 500);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="flex h-screen w-full max-w-[500px] flex-col bg-imessage-bg shadow-xl">
        {/* Header */}
        <div className="border-b border-imessage-separator bg-imessage-bg/95 backdrop-blur-sm">
          <div className="flex items-center justify-center h-[56px] relative">
            <Link href="/" className="absolute left-2">
              <button className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronLeft className="h-6 w-6 text-imessage-blue" />
              </button>
            </Link>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={BOT_AVATAR} alt="마르코" />
                <AvatarFallback>마르코</AvatarFallback>
              </Avatar>
              <span className="text-[17px] font-semibold text-imessage-text-dark">마르코</span>
            </div>
          </div>
          {/* 애정도 프로그레스 바 */}
          <LoveMeter currentScore={loveScore} maxScore={MAX_LOVE_SCORE} />
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3" ref={scrollRef}>
          <div className="space-y-1">
            {messages.map((message) =>
              message.sender === 'bot' ? (
                <IPhoneChatBubbleYou
                  key={message.id}
                  message={message.text}
                  timestamp={message.timestamp}
                  avatarSrc={BOT_AVATAR}
                  avatarAlt="마르코"
                />
              ) : (
                <IPhoneChatBubbleMe
                  key={message.id}
                  message={message.text}
                  timestamp={message.timestamp}
                  avatarSrc={USER_AVATAR}
                  avatarAlt="브렛"
                />
              )
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <TypingIndicator avatarSrc={BOT_AVATAR} avatarAlt="마르코" />
            )}
          </div>
        </div>

        {/* Answer Options */}
        {currentQuestion && !isWaitingForNextOptions && (
          <div className="border-t border-imessage-separator bg-imessage-bg p-4">
            <div className="flex flex-col gap-2">
              {currentQuestion.answerOptions.map((option, index) => (
                <IPhoneChatOption
                  key={index}
                  text={option.text}
                  onClick={() => handleAnswerClick(option)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
