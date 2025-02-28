
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatInput from '@/components/ChatInput';
import ActionButtons from '@/components/ActionButtons';

interface IndexProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const Index = ({ apiKey, onApiKeyChange }: IndexProps) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) {
      toast.error("Por favor digite uma mensagem");
      return;
    }

    if (!apiKey) {
      toast.error("Por favor insira sua chave de API do OpenAI na barra lateral");
      setIsSidebarOpen(true);
      return;
    }

    // Cria um novo ID para o chat
    const chatId = `chat-${Date.now()}`;
    
    // Navega para o novo chat com a mensagem inicial
    navigate(`/chat/${chatId}`, { 
      state: { initialMessage: content } 
    });
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
        <ChatHeader isSidebarOpen={isSidebarOpen} onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <div className="flex h-[calc(100vh-60px)] flex-col items-center justify-center px-4 pt-[60px]">
          <div className="w-full max-w-3xl space-y-8">
            <div className="text-center">
              <h1 className="mb-8 text-4xl font-semibold">
                Como posso ajudar você hoje?
              </h1>
              <ChatInput 
                onSend={handleSendMessage} 
                isLoading={isLoading}
                placeholder="Digite uma mensagem..."
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
