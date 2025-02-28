
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { toast } from "sonner";
import ChatHeader from '@/components/ChatHeader';
import ChatInput from '@/components/ChatInput';
import MessageList from '@/components/MessageList';
import ActionButtons from '@/components/ActionButtons';
import Sidebar from '@/components/Sidebar';
import { sendMessageToOpenAI } from '@/services/openai';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

interface ChatProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const Chat = ({ apiKey, onApiKeyChange }: ChatProps) => {
  const { id } = useParams();
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const initialMessage = location.state?.initialMessage;
    if (initialMessage && messages.length === 0) {
      handleSendMessage(initialMessage);
    }
  }, [location.state]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (!apiKey) {
      toast.error("Please enter your OpenAI API key in the sidebar");
      setIsSidebarOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      const newMessages = [
        ...messages,
        { role: 'user', content } as const
      ];
      
      setMessages(newMessages);

      const assistantResponse = await sendMessageToOpenAI(newMessages, apiKey);

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
    <div className="flex h-screen bg-[#343541]">
      <Sidebar 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onApiKeyChange={onApiKeyChange}
        apiKey={apiKey}
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <ChatHeader 
          isSidebarOpen={isSidebarOpen} 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <div className="flex-1 relative pt-[60px] h-screen">
          <div className="absolute inset-0 flex flex-col pt-[60px]">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col justify-center items-center">
                <h1 className="text-3xl font-semibold mb-8">
                  {id === 'new' ? 'How can I help you today?' : decodeURIComponent(id || '')}
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
      </main>
    </div>
  );
};

export default Chat;
