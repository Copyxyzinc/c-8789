
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
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
  const { toast: useToaster } = useToast();

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) {
      useToaster({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    // Navigate to a new chat when sending the first message
    if (messages.length === 0) {
      const chatId = `chat-${Date.now()}`;
      navigate(`/chat/${chatId}`);
      return;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onApiKeyChange={() => {}} 
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <ChatHeader isSidebarOpen={isSidebarOpen} />
        
        <div className={`flex h-full flex-col ${messages.length === 0 ? 'items-center justify-center' : 'justify-between'}`}>
          <div className="w-full max-w-3xl px-4 space-y-4">
            <div>
              <h1 className="mb-8 text-4xl font-semibold text-center">What can I help with?</h1>
              <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
            </div>
            <ActionButtons />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;