import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface IPhoneChatBubbleMeProps {
  message: string;
  timestamp: Date;
  avatarSrc: string;
  avatarAlt: string;
}

export function IPhoneChatBubbleMe({
  message,
  timestamp,
  avatarSrc,
  avatarAlt,
}: IPhoneChatBubbleMeProps) {
  return (
    <div className="flex items-end gap-2 mb-1 flex-row-reverse">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={avatarSrc} alt={avatarAlt} />
        <AvatarFallback>{avatarAlt[0]}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-end max-w-[70%]">
        <div className="relative">
          <div
            className="bg-imessage-blue text-white px-4 py-2 rounded-[18px]"
            style={{
              borderBottomRightRadius: '4px',
            }}
          >
            <p className="text-[15px] leading-[20px]">{message}</p>
          </div>
          {/* Tail */}
          <div
            className="absolute -right-[6px] bottom-[0px] w-[20px] h-[20px] bg-imessage-blue"
            style={{
              clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
            }}
          />
        </div>
        <span className="text-[11px] text-imessage-secondary mt-[2px] mr-2">
          {timestamp.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
