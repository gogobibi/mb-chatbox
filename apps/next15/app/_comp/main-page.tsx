import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ChatListItem {
  gameId: string;
  botName: string;
  botAvatar: string;
  previewMessage: string;
}

interface MainPageProps {
  chatList: ChatListItem[];
}

export function MainPage({ chatList }: MainPageProps) {
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
          {chatList.map((item) => (
            <Link key={item.gameId} href={`/chat/${item.gameId}`}>
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-imessage-separator">
                {/* Avatar */}
                <Avatar className="h-[52px] w-[52px] shrink-0">
                  <AvatarImage src={item.botAvatar} alt={item.botName} />
                  <AvatarFallback>{item.botName}</AvatarFallback>
                </Avatar>

                {/* Chat Info */}
                <div className="flex-1 min-w-0 py-1">
                  <div className="flex items-baseline justify-between mb-1">
                    <h2 className="font-semibold text-[17px] text-imessage-text-dark">
                      {item.botName}
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
                    {item.previewMessage}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
