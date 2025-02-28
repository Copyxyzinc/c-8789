
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import ChatHeader from '@/components/ChatHeader';
import ChatInput from '@/components/ChatInput';
import MessageList from '@/components/MessageList';
import ActionButtons from '@/components/ActionButtons';
import Sidebar from '@/components/Sidebar';
import { sendMessageToOpenAI } from '@/services/openai';
import { saveChat, getChatHistory } from '@/services/chatHistory';

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
                  {id === 'new' ? 'Como posso ajudar você hoje?' : 'Carregando conversa...'}
                </h1>
                <div className="w-full max-w-3xl px-4">
                  <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
                  <ActionButtons />
                </div>
              </div>
            ) : (
              <>
                <MessageList 
                  messages={messages} 
                  onRegenerateResponse={handleRegenerateResponse}
                />
                <div className="w-full max-w-3xl mx-auto px-4 py-2">
                  <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
                </div>
              </>
            )}
            <div className="text-xs text-center text-gray-500 py-2">
              O ChatGPT pode cometer erros. Verifique informações importantes.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
