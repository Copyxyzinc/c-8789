
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Settings } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import EnhancedChatInput from '@/components/EnhancedChatInput';
import ActionButtons from '@/components/ActionButtons';
import SettingsPanel from '@/components/SettingsPanel';
import { exportChats, importChats } from '@/services/chatExport';

interface IndexProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const Index = ({ apiKey, onApiKeyChange }: IndexProps) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

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

    const chatId = `chat-${Date.now()}`;
    navigate(`/chat/${chatId}`, { 
      state: { initialMessage: content } 
    });
  };

  const handleActionClick = (template: string) => {
    setInputValue(template);
  };

  const handleExportChats = () => {
    exportChats();
  };

  const handleImportChats = (data: any) => {
    if (importChats(data)) {
      // Reload sidebar to show new chats
      window.location.reload();
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
        
        <div className="flex h-[calc(100vh-60px)] flex-col items-center justify-center px-4 pt-[60px]">
          <div className="w-full max-w-3xl space-y-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-8">
                <h1 className="text-4xl font-semibold">
                  Como posso ajudar você hoje?
                </h1>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Configurações"
                >
                  <Settings className="h-6 w-6" />
                </button>
              </div>
              
              <EnhancedChatInput 
                onSend={handleSendMessage} 
                isLoading={isLoading}
                placeholder="Digite uma mensagem..."
                initialValue={inputValue}
              />
            </div>
            <ActionButtons onActionClick={handleActionClick} />
          </div>
        </div>
      </main>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onExportChats={handleExportChats}
        onImportChats={handleImportChats}
      />
    </div>
  );
};

export default Index;
