import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface IPhoneChatBubbleYouProps {
  message: string;
  timestamp: Date;
  avatarSrc: string;
  avatarAlt: string;
}

export function IPhoneChatBubbleYou({
  message,
  timestamp,
  avatarSrc,
  avatarAlt,
}: IPhoneChatBubbleYouProps) {
  return (
    <div className="flex items-end gap-2 mb-1">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={avatarSrc} alt={avatarAlt} />
        <AvatarFallback>{avatarAlt[0]}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-start max-w-[70%]">
        <div className="relative">
          <div
            className="bg-imessage-gray text-imessage-text-dark px-4 py-2 rounded-[18px]"
            style={{
              borderBottomLeftRadius: '4px',
            }}
          >
            <p className="text-[15px] leading-[20px]">{message}</p>
          </div>
          {/* Tail */}
          <div
            className="absolute -left-[6px] bottom-[0px] w-[20px] h-[20px] bg-imessage-gray"
            style={{
              clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)',
            }}
          />
        </div>
        <span className="text-[11px] text-imessage-secondary mt-[2px] ml-2">
          {timestamp.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
