
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from "sonner";
import ChatHeader from '@/components/ChatHeader';
import ChatInput from '@/components/ChatInput';
import MessageList from '@/components/MessageList';
import ActionButtons from '@/components/ActionButtons';
import { sendMessageToOpenAI } from '@/services/openai';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const Chat = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsLoading(true);

    try {
      const newMessages = [
        ...messages,
        { role: 'user', content } as const
      ];
      
      setMessages(newMessages);

      const assistantResponse = await sendMessageToOpenAI(newMessages);

      const assistantMessage: Message = {
        role: 'assistant',
        content: assistantResponse
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <ChatHeader 
        isSidebarOpen={isSidebarOpen} 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center">
              <h1 className="text-3xl font-semibold mb-8">
                {id === 'new' ? 'How can I help you today?' : decodeURIComponent(id)}
              </h1>
              <div className="w-full max-w-3xl px-4">
                <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
                <ActionButtons />
              </div>
            </div>
          ) : (
            <>
              <MessageList messages={messages} />
              <div className="w-full max-w-3xl mx-auto px-4 py-2">
                <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
              </div>
            </>
          )}
          <div className="text-xs text-center text-gray-500 py-2">
            ChatGPT can make mistakes. Check important info.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
