'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft } from 'lucide-react';
import contentData from './content.json';

interface AnswerOption {
  text: string;
  nextQuestionId: number | null;
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

const BOT_AVATAR = 'https://images.unsplash.com/photo-1762325658409-5d8aa0e43261?q=80&w=1072&auto=format&fit=crop';
const USER_AVATAR = 'https://images.unsplash.com/photo-1761839257475-4ca368dae6c3?q=80&w=2070&auto=format&fit=crop';

export default function ChatPage() {
  const firstQuestion = (contentData as ContentData)['1'];
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAnswerClick = (option: AnswerOption) => {
    const userMessage: Message = {
      id: messageIdCounter,
      text: option.text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setMessageIdCounter((prev) => prev + 1);

    if (option.nextQuestionId !== null) {
      setTimeout(() => {
        const nextQuestion = (contentData as ContentData)[
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
    } else {
      setTimeout(() => {
        const endMessage: Message = {
          id: messageIdCounter + 1,
          text: '대화를 마칠게! 즐거웠어',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, endMessage]);
        setCurrentQuestion(null);
        setMessageIdCounter((prev) => prev + 1);
      }, 500);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Avatar className="h-10 w-10">
          <AvatarImage src={BOT_AVATAR} alt="민지" />
          <AvatarFallback>민지</AvatarFallback>
        </Avatar>
        <h1 className="text-lg font-semibold text-foreground">민지</h1>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div ref={scrollRef} className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 ${
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage
                  src={message.sender === 'bot' ? BOT_AVATAR : USER_AVATAR}
                  alt={message.sender === 'bot' ? '민지' : '나'}
                />
                <AvatarFallback>
                  {message.sender === 'bot' ? '민지' : '나'}
                </AvatarFallback>
              </Avatar>

              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span className="mt-1 block text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {currentQuestion && (
        <div className="border-t border-border bg-card p-4">
          <div className="flex flex-col gap-2">
            {currentQuestion.answerOptions.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto w-full justify-start whitespace-normal py-3 text-left"
                onClick={() => handleAnswerClick(option)}
              >
                {option.text}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
