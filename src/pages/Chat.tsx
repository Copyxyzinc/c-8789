import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Settings } from 'lucide-react';
import ChatHeader from '@/components/ChatHeader';
import EnhancedChatInput from '@/components/EnhancedChatInput';
import MessageList from '@/components/MessageList';
import ActionButtons from '@/components/ActionButtons';
import Sidebar from '@/components/Sidebar';
import SettingsPanel from '@/components/SettingsPanel';
import { sendMessageToOpenAI } from '@/services/openai';
import { saveChat, getChatHistory } from '@/services/chatHistory';
import { exportChats, importChats, exportChatAsMarkdown } from '@/services/chatExport';
import { retrieveContext, enhancePromptWithContext, formatContextSources } from '@/services/ragService';
import { useChatSettings } from '@/hooks/useChatSettings';

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
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { settings } = useChatSettings();

  // Carrega um chat existente do histórico
  useEffect(() => {
    if (id && id !== 'new') {
      const history = getChatHistory();
      const chat = history.find(c => c.id === id);
      if (chat) {
        setMessages(chat.messages);
      } else {
        // Chat não encontrado, redireciona para nova conversa
        navigate('/chat/new');
      }
    } else {
      // Limpa mensagens para nova conversa
      setMessages([]);
    }
  }, [id, navigate]);

  // Processa mensagem inicial (se fornecida via state)
  useEffect(() => {
    const initialMessage = location.state?.initialMessage;
    if (initialMessage && messages.length === 0 && id === 'new') {
      handleSendMessage(initialMessage);
    }
  }, [location.state, messages.length, id]);

  // Salva mensagens no histórico quando elas mudam
  useEffect(() => {
    if (messages.length > 0 && id) {
      const chatId = id === 'new' ? `chat-${Date.now()}` : id;
      
      // Só atualiza a URL se estivermos em uma nova conversa e temos mensagens
      if (id === 'new' && messages.length > 0) {
        navigate(`/chat/${chatId}`, { replace: true });
      }
      
      // Salva o chat no histórico
      saveChat(chatId, messages);
    }
  }, [messages, id, navigate]);

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

    setIsLoading(true);

    try {
      let enhancedContent = content;
      let contextSources: string[] = [];

      // Use RAG if enabled and API key is available
      if (settings.ragEnabled && apiKey) {
        try {
          const ragContext = await retrieveContext(content, apiKey, {
            topK: settings.ragTopK,
            minSimilarity: settings.ragMinSimilarity,
            maxContextLength: settings.ragMaxContext
          });

          if (ragContext.contextText) {
            enhancedContent = enhancePromptWithContext(content, ragContext);
            contextSources = ragContext.sources;
            console.log('RAG context retrieved:', ragContext.sources);
          }
        } catch (ragError) {
          console.error('RAG error:', ragError);
          // Continue without RAG context if it fails
        }
      }

      const newMessages = [
        ...messages,
        { role: 'user', content } as const
      ];
      
      setMessages(newMessages);

      const assistantResponse = await sendMessageToOpenAI([
        ...messages,
        { role: 'user', content: enhancedContent }
      ], apiKey);

      // Add source information if context was used
      const finalResponse = contextSources.length > 0 
        ? assistantResponse + formatContextSources(contextSources)
        : assistantResponse;

      const assistantMessage: Message = {
        role: 'assistant',
        content: finalResponse
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateResponse = async (messageIndex: number) => {
    if (!apiKey) {
      toast.error("Por favor insira sua chave de API do OpenAI na barra lateral");
      setIsSidebarOpen(true);
      return;
    }

    // Garante que o índice é um assistente e tem uma mensagem do usuário antes
    if (messageIndex < 1 || messages[messageIndex].role !== 'assistant') {
      return;
    }

    const userMessage = messages[messageIndex - 1];
    if (userMessage.role !== 'user') {
      return;
    }

    setIsLoading(true);

    try {
      // Pega todas as mensagens até o userMessage 
      const messageContext = messages.slice(0, messageIndex);
      
      const assistantResponse = await sendMessageToOpenAI(messageContext, apiKey);

      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = {
        role: 'assistant',
        content: assistantResponse
      };

      setMessages(updatedMessages);
      toast.success("Resposta regenerada com sucesso");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (template: string) => {
    // For action buttons in chat, we can directly send the template or show it in input
    handleSendMessage(template);
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
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col justify-center items-center">
                <div className="flex items-center gap-4 mb-8">
                  <h1 className="text-3xl font-semibold">
                    {id === 'new' ? 'Como posso ajudar você hoje?' : 'Carregando conversa...'}
                  </h1>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
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
                  <EnhancedChatInput onSend={handleSendMessage} isLoading={isLoading} />
                  <ActionButtons onActionClick={handleActionClick} />
                </div>
              </div>
            ) : (
              <>
                <MessageList 
                  messages={messages} 
                  onRegenerateResponse={handleRegenerateResponse}
                />
                <div className="w-full max-w-3xl mx-auto px-4 py-2">
                  <EnhancedChatInput onSend={handleSendMessage} isLoading={isLoading} />
                </div>
              </>
            )}
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
