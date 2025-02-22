
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatInput from '@/components/ChatInput';
import ActionButtons from '@/components/ActionButtons';
import MessageList from '@/components/MessageList';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const Index = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) {
      toast.error("Please enter a message");
      return;
    }

    // Navigate to a new chat when sending the first message
    const chatId = `chat-${Date.now()}`;
    navigate(`/chat/${chatId}`, { 
      state: { initialMessage: content } 
    });
  };

  return (
    <div className="flex h-screen bg-[#343541]">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onApiKeyChange={(key) => {
          localStorage.setItem('openai_api_key', key);
          toast.success("API key saved successfully");
        }} 
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <ChatHeader isSidebarOpen={isSidebarOpen} onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <div className="flex h-[calc(100vh-60px)] flex-col items-center justify-center px-4">
          <div className="w-full max-w-3xl space-y-8">
            <div className="text-center">
              <h1 className="mb-8 text-4xl font-semibold">
                How can I help you today?
              </h1>
              <ChatInput 
                onSend={handleSendMessage} 
                isLoading={isLoading}
                placeholder="Send a message..."
              />
            </div>
            <ActionButtons />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;