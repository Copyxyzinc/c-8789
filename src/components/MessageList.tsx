
import Message from './Message';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

interface MessageListProps {
  messages: Message[];
  onRegenerateResponse?: (messageIndex: number) => void;
}

const MessageList = ({ messages, onRegenerateResponse }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto pt-[60px]">
      <div className="w-full max-w-3xl mx-auto px-4">
        {messages.map((message, index) => (
          <Message 
            key={index} 
            {...message} 
            onRegenerate={
              message.role === 'assistant' && onRegenerateResponse 
                ? () => onRegenerateResponse(index)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};

export default MessageList;
