import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface TypingIndicatorProps {
  avatarSrc: string;
  avatarAlt?: string;
  showAvatar?: boolean;
}

export function TypingIndicator({ avatarSrc, avatarAlt = '상대방', showAvatar = true }: TypingIndicatorProps) {
  return (
    <div className="flex items-end gap-2 mb-1">
      {showAvatar ? (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={avatarSrc} alt={avatarAlt} />
          <AvatarFallback>{avatarAlt[0]}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-8 h-8 shrink-0" />
      )}

      <div className="bg-imessage-gray px-4 py-3 rounded-[18px]">
        <div className="flex gap-1 items-center">
          <span
            className="inline-block w-2 h-2 bg-imessage-secondary rounded-full"
            style={{
              animation: 'bounce 1.4s infinite',
              animationDelay: '0s',
            }}
          />
          <span
            className="inline-block w-2 h-2 bg-imessage-secondary rounded-full"
            style={{
              animation: 'bounce 1.4s infinite',
              animationDelay: '0.2s',
            }}
          />
          <span
            className="inline-block w-2 h-2 bg-imessage-secondary rounded-full"
            style={{
              animation: 'bounce 1.4s infinite',
              animationDelay: '0.4s',
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </div>
  );
}
