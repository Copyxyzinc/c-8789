import MessageList from '@/components/MessageList';
import EnhancedChatInput from '@/components/EnhancedChatInput';
import ChatWelcomeScreen from '@/components/ChatWelcomeScreen';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

interface ChatContentProps {
  id?: string;
  messages: Message[];
  isLoading: boolean;
  onSend: (message: string) => void;
  onActionClick: (template: string) => void;
  onSettingsClick: () => void;
  onRegenerateResponse: (messageIndex: number) => void;
}

const ChatContent = ({
  id,
  messages,
  isLoading,
  onSend,
  onActionClick,
  onSettingsClick,
  onRegenerateResponse
}: ChatContentProps) => {
  if (messages.length === 0) {
    return (
      <ChatWelcomeScreen
        id={id}
        onSend={onSend}
        onActionClick={onActionClick}
        onSettingsClick={onSettingsClick}
        isLoading={isLoading}
      />
    );
  }

  return (
    <>
      <MessageList 
        messages={messages} 
        onRegenerateResponse={onRegenerateResponse}
      />
      <div className="w-full max-w-3xl mx-auto px-4 py-2">
        <EnhancedChatInput onSend={onSend} isLoading={isLoading} />
      </div>
    </>
  );
};

export default ChatContent;