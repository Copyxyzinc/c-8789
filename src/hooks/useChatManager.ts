import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { sendMessageToOpenAI } from '@/services/openai';
import { saveChat, getChatHistory } from '@/services/chatHistory';
import { retrieveContext, enhancePromptWithContext, formatContextSources } from '@/services/ragService';
import { useChatSettings } from '@/hooks/useChatSettings';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export const useChatManager = (apiKey: string) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useChatSettings();

  // Load existing chat from history
  useEffect(() => {
    if (id && id !== 'new') {
      const history = getChatHistory();
      const chat = history.find(c => c.id === id);
      if (chat) {
        setMessages(chat.messages);
      } else {
        navigate('/chat/new');
      }
    } else {
      setMessages([]);
    }
  }, [id, navigate]);

  // Process initial message (if provided via state)
  useEffect(() => {
    const initialMessage = location.state?.initialMessage;
    if (initialMessage && messages.length === 0 && id === 'new') {
      handleSendMessage(initialMessage);
    }
  }, [location.state, messages.length, id]);

  // Save messages to history when they change
  useEffect(() => {
    if (messages.length > 0 && id) {
      const chatId = id === 'new' ? `chat-${Date.now()}` : id;
      
      if (id === 'new' && messages.length > 0) {
        navigate(`/chat/${chatId}`, { replace: true });
      }
      
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
      return;
    }

    if (messageIndex < 1 || messages[messageIndex].role !== 'assistant') {
      return;
    }

    const userMessage = messages[messageIndex - 1];
    if (userMessage.role !== 'user') {
      return;
    }

    setIsLoading(true);

    try {
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

  return {
    messages,
    isLoading,
    handleSendMessage,
    handleRegenerateResponse
  };
};