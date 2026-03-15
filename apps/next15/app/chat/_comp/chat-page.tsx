'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronLeft } from 'lucide-react';
import { IPhoneChatBubbleYou } from '@/components/chat/iphone-chat-bubble-you';
import { IPhoneChatBubbleMe } from '@/components/chat/iphone-chat-bubble-me';
import { IPhoneChatOption } from '@/components/chat/iphone-chat-option';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { LoveMeter } from '@/components/chat/love-meter';
import { GameConfig } from '@/lib/games';

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

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

type ContentData = {
  [key: string]: Question;
};

const MAX_LOVE_SCORE = 150;

interface ChatPageProps {
  contentData: ContentData;
  gameConfig: GameConfig;
}

export function ChatPage({ contentData, gameConfig }: ChatPageProps) {
  const router = useRouter();
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
  const [showTypingAvatar, setShowTypingAvatar] = useState(true);
  const [isWaitingForNextOptions, setIsWaitingForNextOptions] = useState(false);
  const [loveScore, setLoveScore] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
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

    // 사용자 메시지 추가 ([미노출] 태그가 없을 때만 말풍선 표시)
    const isHidden = option.text.includes('[미노출]');
    if (!isHidden) {
      const userMessage: Message = {
        id: messageIdCounter,
        text: option.text,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
    }
    setMessageIdCounter((prev) => prev + 1);

    // 선택지 숨기고 타이핑 시작
    setIsWaitingForNextOptions(true);
    setIsTyping(true);

    if (option.nextQuestionId !== null) {
      // 다음 질문으로 진행
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

        // endMessage가 있으면 표시, 없으면 바로 종료
        if (option.endMessage) {
          const messages = Array.isArray(option.endMessage)
            ? option.endMessage
            : [option.endMessage];

          const currentMessageId = messageIdCounter + 1;

          if (messages.length === 1) {
            // 메시지가 1개일 때
            setTimeout(() => {
              setIsTyping(true);
            }, 0);

            setTimeout(() => {
              setIsTyping(false);
              const endMessage: Message = {
                id: currentMessageId,
                text: messages[0],
                sender: 'bot',
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, endMessage]);
              setMessageIdCounter((prev) => prev + 1);
            }, 500);
          } else if (messages.length === 2) {
            // 메시지가 2개일 때 - 망설임 효과
            // 첫 번째 타이핑
            setTimeout(() => {
              setIsTyping(true);
            }, 0);

            // 첫 번째 메시지
            setTimeout(() => {
              setIsTyping(false);
              const firstMessage: Message = {
                id: currentMessageId,
                text: messages[0],
                sender: 'bot',
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, firstMessage]);
              setMessageIdCounter((prev) => prev + 1);
            }, 500);

            // 두 번째 타이핑 시작
            setTimeout(() => {
              setIsTyping(true);
            }, 1300);

            // 두 번째 타이핑 멈춤 (망설임)
            setTimeout(() => {
              setIsTyping(false);
            }, 1800);

            // 세 번째 타이핑 다시 시작
            setTimeout(() => {
              setIsTyping(true);
            }, 2500);

            // 두 번째 메시지
            setTimeout(() => {
              setIsTyping(false);
              const secondMessage: Message = {
                id: currentMessageId + 1,
                text: messages[1],
                sender: 'bot',
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, secondMessage]);
              setMessageIdCounter((prev) => prev + 1);
            }, 3000);
          } else {
            // 메시지가 3개 이상일 때 - 순차 전송
            messages.forEach((msgText, index) => {
              // 타이핑 시작
              setTimeout(() => {
                setIsTyping(true);
                // 첫 번째 메시지만 아바타 표시
                setShowTypingAvatar(index === 0);
              }, index * 1300);

              // 메시지 전송 (타이핑 후 0.5초)
              setTimeout(() => {
                setIsTyping(false);
                const msg: Message = {
                  id: currentMessageId + index,
                  text: msgText,
                  sender: 'bot',
                  timestamp: new Date(),
                };
                setMessages((prev) => [...prev, msg]);
                setMessageIdCounter((prev) => prev + 1);
              }, index * 1300 + 500);
            });
          }
        }

        setCurrentQuestion(null);
        setIsWaitingForNextOptions(false);

        // 로컬스토리지에 점수 저장 (gameId 네임스페이스)
        const bestScoreKey = `bestFinalScore_${gameConfig.id}`;
        const bestScore = localStorage.getItem(bestScoreKey);
        if (!bestScore || newLoveScore > parseInt(bestScore, 10)) {
          localStorage.setItem(bestScoreKey, newLoveScore.toString());
        }

        // 타이밍 계산
        const messageCount = option.endMessage
          ? (Array.isArray(option.endMessage) ? option.endMessage.length : 1)
          : 0;

        let allMessagesDelay = 0;
        if (messageCount === 1) {
          allMessagesDelay = 500; // 타이핑 + 메시지
        } else if (messageCount === 2) {
          allMessagesDelay = 3000; // 망설임 효과 포함
        } else if (messageCount >= 3) {
          allMessagesDelay = (messageCount - 1) * 1300 + 500; // 각 메시지 1.3초 간격
        }

        // 카운트다운 시작 (메시지 전송 완료 후)
        if (messageCount > 0) {
          setTimeout(() => {
            setCountdown(3);
            setTimeout(() => setCountdown(2), 1000);
            setTimeout(() => setCountdown(1), 2000);
          }, allMessagesDelay);
        }

        // 엔딩 페이지로 이동
        const redirectDelay = messageCount > 0 ? allMessagesDelay + 3000 : 0;
        setTimeout(() => {
          router.push(`/end/${gameConfig.id}?score=${newLoveScore}`);
        }, redirectDelay);
      }, 500);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="flex h-screen w-full max-w-[500px] flex-col bg-imessage-bg shadow-xl relative">
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
                <AvatarImage src={gameConfig.botAvatar} alt={gameConfig.botName} />
                <AvatarFallback>{gameConfig.botName}</AvatarFallback>
              </Avatar>
              <span className="text-[17px] font-semibold text-imessage-text-dark">{gameConfig.botName}</span>
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
                  avatarSrc={gameConfig.botAvatar}
                  avatarAlt={gameConfig.botName}
                />
              ) : (
                <IPhoneChatBubbleMe
                  key={message.id}
                  message={message.text}
                  timestamp={message.timestamp}
                  avatarSrc={gameConfig.userAvatar}
                  avatarAlt={gameConfig.userCharName}
                />
              )
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <TypingIndicator avatarSrc={gameConfig.botAvatar} avatarAlt={gameConfig.botName} showAvatar={showTypingAvatar} />
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
                  text={option.text.replace('[미노출]', '').trim()}
                  onClick={() => handleAnswerClick(option)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Countdown */}
        {countdown !== null && (
          <button
            onClick={() => {
              router.push(`/end/${gameConfig.id}?score=${loveScore}`);
            }}
            className="absolute bottom-3 right-3 bg-gray-800/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs text-white font-medium hover:bg-gray-800/80 transition-colors cursor-pointer"
          >
            <span>skip</span>
            <span>{countdown}</span>
          </button>
        )}
      </div>
    </div>
  );
}
