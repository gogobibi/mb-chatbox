interface IPhoneChatOptionProps {
  text: string;
  onClick: () => void;
}

export function IPhoneChatOption({ text, onClick }: IPhoneChatOptionProps) {
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-3 text-left bg-white border border-imessage-blue text-imessage-blue rounded-[18px] hover:bg-blue-50 transition-colors text-[15px] leading-[20px]"
    >
      {text}
    </button>
  );
}
