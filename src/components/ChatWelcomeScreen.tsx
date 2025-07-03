import { Settings } from 'lucide-react';
import EnhancedChatInput from '@/components/EnhancedChatInput';
import ActionButtons from '@/components/ActionButtons';
import { useChatSettings } from '@/hooks/useChatSettings';

interface ChatWelcomeScreenProps {
  id?: string;
  onSend: (message: string) => void;
  onActionClick: (template: string) => void;
  onSettingsClick: () => void;
  isLoading: boolean;
}

const ChatWelcomeScreen = ({ 
  id, 
  onSend, 
  onActionClick, 
  onSettingsClick, 
  isLoading 
}: ChatWelcomeScreenProps) => {
  const { settings } = useChatSettings();

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-semibold">
          {id === 'new' ? 'Como posso ajudar você hoje?' : 'Carregando conversa...'}
        </h1>
        <button
          onClick={onSettingsClick}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Configurações"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
      {settings.ragEnabled && (
        <div className="text-sm text-green-400 mb-4">
          RAG habilitado - Usando conhecimento de documentos
        </div>
      )}
      <div className="w-full max-w-3xl px-4">
        <EnhancedChatInput onSend={onSend} isLoading={isLoading} />
        <ActionButtons onActionClick={onActionClick} />
      </div>
    </div>
  );
};

export default ChatWelcomeScreen;