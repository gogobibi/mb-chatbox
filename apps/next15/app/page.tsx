'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '안녕하세요! 무엇을 도와드릴까요?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // 간단한 봇 응답 시뮬레이션
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: '메시지를 받았습니다. 더 도와드릴 것이 있으신가요?',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <main className="flex h-screen w-full max-w-4xl flex-col bg-white dark:bg-zinc-950 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            MB Chatbox
          </h1>
          <Link
            href="/chat"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
          >
            채팅방으로 이동
          </Link>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSendMessage}
          className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-6 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              전송
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
