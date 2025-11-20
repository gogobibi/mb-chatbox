import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function MainPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <main className="flex h-full w-full max-w-[500px] flex-col bg-imessage-bg shadow-xl">
        {/* Header */}
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-[34px] font-bold text-imessage-text-dark tracking-tight">
            메시지
          </h1>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <Link href="/chat">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-imessage-separator">
              {/* Avatar */}
              <Avatar className="h-[52px] w-[52px] shrink-0">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1762325658409-5d8aa0e43261?q=80&w=1072&auto=format&fit=crop"
                  alt="민지"
                />
                <AvatarFallback>민지</AvatarFallback>
              </Avatar>

              {/* Chat Info */}
              <div className="flex-1 min-w-0 py-1">
                <div className="flex items-baseline justify-between mb-1">
                  <h2 className="font-semibold text-[17px] text-imessage-text-dark">
                    민지
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] text-imessage-secondary">
                      오후 2:30
                    </span>
                    <div className="flex items-center justify-center w-5 h-5 bg-imessage-blue rounded-full">
                      <span className="text-white text-[12px] font-medium">1</span>
                    </div>
                  </div>
                </div>
                <p className="text-[15px] text-imessage-secondary truncate">
                  안녕! 오늘 기분이 어때?
                </p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
