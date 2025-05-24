
import { getChatHistory, type ChatHistory } from './chatHistory';
import { toast } from 'sonner';

export const exportChats = () => {
  try {
    const history = getChatHistory();
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      chats: history
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    toast.success('Conversas exportadas com sucesso');
  } catch (error) {
    console.error('Export failed:', error);
    toast.error('Erro ao exportar conversas');
  }
};

export const importChats = (data: any): boolean => {
  try {
    if (!data.chats || !Array.isArray(data.chats)) {
      throw new Error('Formato de arquivo inválido');
    }
    
    const currentHistory = getChatHistory();
    const importedChats = data.chats as ChatHistory[];
    
    // Merge with existing chats, avoiding duplicates
    const existingIds = new Set(currentHistory.map(chat => chat.id));
    const newChats = importedChats.filter(chat => !existingIds.has(chat.id));
    
    const mergedHistory = [...currentHistory, ...newChats];
    localStorage.setItem('chat_history', JSON.stringify(mergedHistory));
    
    toast.success(`${newChats.length} conversas importadas com sucesso`);
    return true;
  } catch (error) {
    console.error('Import failed:', error);
    toast.error('Erro ao importar conversas');
    return false;
  }
};

export const exportChatAsMarkdown = (chatId: string) => {
  try {
    const history = getChatHistory();
    const chat = history.find(c => c.id === chatId);
    
    if (!chat) {
      toast.error('Conversa não encontrada');
      return;
    }
    
    let markdown = `# ${chat.title}\n\n`;
    markdown += `**Data:** ${chat.createdAt.toLocaleDateString()}\n\n`;
    
    chat.messages.forEach((message, index) => {
      const role = message.role === 'user' ? 'Usuário' : 'Assistente';
      markdown += `## ${role}\n\n${message.content}\n\n`;
    });
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chat.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    toast.success('Conversa exportada como Markdown');
  } catch (error) {
    console.error('Markdown export failed:', error);
    toast.error('Erro ao exportar como Markdown');
  }
};
