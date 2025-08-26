import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from "sonner";
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import ChatHeader from '@/components/ChatHeader';
import ChatContent from '@/components/ChatContent';
import Sidebar from '@/components/Sidebar';
import SettingsPanel from '@/components/SettingsPanel';
import { exportChats, importChats, exportChatAsMarkdown } from '@/services/chatExport';
import { useChatManager } from '@/hooks/useChatManager';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { messages, isLoading, handleSendMessage, handleRegenerateResponse } = useChatManager(apiKey);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onToggleSidebar: () => setIsSidebarOpen(!isSidebarOpen),
    onOpenSettings: () => setIsSettingsOpen(true)
  });

  const handleSendMessageWithSidebarCheck = async (content: string) => {
    if (!apiKey) {
      toast.error("Por favor insira sua chave de API do OpenAI na barra lateral");
      setIsSidebarOpen(true);
      return;
    }
    await handleSendMessage(content);
  };

  const handleRegenerateWithSidebarCheck = async (messageIndex: number) => {
    if (!apiKey) {
      toast.error("Por favor insira sua chave de API do OpenAI na barra lateral");
      setIsSidebarOpen(true);
      return;
    }
    await handleRegenerateResponse(messageIndex);
  };

  const handleActionClick = (template: string) => {
    handleSendMessageWithSidebarCheck(template);
  };

  const handleExportChats = () => {
    exportChats();
  };

  const handleImportChats = (data: any) => {
    if (importChats(data)) {
      window.location.reload();
    }
  };

  const handleExportCurrentChat = () => {
    if (id && id !== 'new') {
      exportChatAsMarkdown(id);
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
            <ChatContent
              id={id}
              messages={messages}
              isLoading={isLoading}
              onSend={handleSendMessageWithSidebarCheck}
              onActionClick={handleActionClick}
              onSettingsClick={() => setIsSettingsOpen(true)}
              onRegenerateResponse={handleRegenerateWithSidebarCheck}
            />
            <div className="text-xs text-center text-gray-500 py-2">
              O ChatGPT pode cometer erros. Verifique informações importantes.
            </div>
          </div>
        </div>
      </main>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onExportChats={handleExportChats}
        onImportChats={handleImportChats}
        apiKey={apiKey}
      />
    </div>
  );
};

export default Chat;
