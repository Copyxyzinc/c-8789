
type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ChatHistory = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
};

// Recupera o histórico de chats do localStorage
export const getChatHistory = (): ChatHistory[] => {
  const history = localStorage.getItem('chat_history');
  if (!history) return [];
  
  try {
    const parsed = JSON.parse(history);
    return parsed.map((chat: any) => ({
      ...chat,
      createdAt: new Date(chat.createdAt),
      updatedAt: new Date(chat.updatedAt)
    }));
  } catch (error) {
    console.error('Failed to parse chat history:', error);
    return [];
  }
};

// Salva um novo chat ou atualiza um existente
export const saveChat = (chatId: string, messages: ChatMessage[], title?: string): ChatHistory => {
  const history = getChatHistory();
  const now = new Date();
  
  // Determina o título se não for fornecido
  const chatTitle = title || (messages.length > 0 ? 
    messages[0].content.substring(0, 30) + (messages[0].content.length > 30 ? '...' : '') : 
    `Chat ${now.toLocaleString()}`);
  
  // Verifica se o chat já existe
  const existingChatIndex = history.findIndex(chat => chat.id === chatId);
  
  if (existingChatIndex >= 0) {
    // Atualiza o chat existente
    const updatedChat: ChatHistory = {
      ...history[existingChatIndex],
      title: chatTitle,
      messages,
      updatedAt: now
    };
    
    history[existingChatIndex] = updatedChat;
    localStorage.setItem('chat_history', JSON.stringify(history));
    return updatedChat;
  } else {
    // Cria um novo chat
    const newChat: ChatHistory = {
      id: chatId,
      title: chatTitle,
      messages,
      createdAt: now,
      updatedAt: now
    };
    
    history.unshift(newChat); // Adiciona ao início para aparecer primeiro
    localStorage.setItem('chat_history', JSON.stringify(history));
    return newChat;
  }
};

// Deleta um chat do histórico
export const deleteChat = (chatId: string): boolean => {
  const history = getChatHistory();
  const filteredHistory = history.filter(chat => chat.id !== chatId);
  
  if (filteredHistory.length < history.length) {
    localStorage.setItem('chat_history', JSON.stringify(filteredHistory));
    return true;
  }
  
  return false;
};

// Organiza chats por categorias de tempo
export const getChatsByTimeframe = () => {
  const history = getChatHistory();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const todayChats = history.filter(chat => chat.updatedAt >= today);
  const yesterdayChats = history.filter(chat => 
    chat.updatedAt >= yesterday && chat.updatedAt < today
  );
  const previousChats = history.filter(chat => chat.updatedAt < yesterday);
  
  return {
    today: todayChats,
    yesterday: yesterdayChats,
    previous: previousChats
  };
};
