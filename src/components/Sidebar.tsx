
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SearchBar } from './sidebar/SearchBar';
import { ApiKeyInput } from './sidebar/ApiKeyInput';
import { TimeframeSection } from './sidebar/TimeframeSection';
import { WelcomeMessage } from './sidebar/WelcomeMessage';
import { cn } from '@/lib/utils';
import { getChatsByTimeframe, deleteChat } from '@/services/chatHistory';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onApiKeyChange: (apiKey: string) => void;
  apiKey: string;
}

const Sidebar = ({ isOpen, onToggle, onApiKeyChange, apiKey }: SidebarProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [chatGroups, setChatGroups] = useState({
    today: { isExpanded: true, chats: [] as {id: string, title: string}[] },
    yesterday: { isExpanded: false, chats: [] as {id: string, title: string}[] },
    previous: { isExpanded: false, chats: [] as {id: string, title: string}[] },
  });

  // Carrega o histórico de chat
  const loadChatHistory = () => {
    const chatsByTimeframe = getChatsByTimeframe();
    
    setChatGroups({
      today: { 
        isExpanded: chatGroups.today.isExpanded, 
        chats: chatsByTimeframe.today.map(chat => ({ id: chat.id, title: chat.title }))
      },
      yesterday: { 
        isExpanded: chatGroups.yesterday.isExpanded, 
        chats: chatsByTimeframe.yesterday.map(chat => ({ id: chat.id, title: chat.title }))
      },
      previous: { 
        isExpanded: chatGroups.previous.isExpanded, 
        chats: chatsByTimeframe.previous.map(chat => ({ id: chat.id, title: chat.title }))
      },
    });
  };

  // Carrega o histórico quando o componente monta
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Filtra os chats baseado na busca
  const getFilteredChats = (chats: {id: string, title: string}[]) => {
    if (!searchQuery) return chats;
    return chats.filter(chat => 
      chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleNewChat = () => {
    navigate('/chat/new');
  };

  const handleChatClick = (chatInfo: {id: string, title: string}) => {
    navigate(`/chat/${encodeURIComponent(chatInfo.id)}`);
  };

  const handleChatDelete = (chatId: string) => {
    const success = deleteChat(chatId);
    if (success) {
      loadChatHistory();
      if (id === chatId) {
        navigate('/chat/new');
      }
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-full w-64 bg-chatgpt-sidebar border-r border-white/10 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-full flex-col">
        <SidebarHeader 
          onToggle={onToggle}
          onNewChat={handleNewChat}
          isCurrentChat={false}
        />
        
        <div className="flex-1 overflow-y-auto">
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <ApiKeyInput 
            apiKey={apiKey}
            onApiKeyChange={onApiKeyChange}
          />

          {Object.values(chatGroups).every(group => group.chats.length === 0) && (
            <WelcomeMessage />
          )}

          <div className="px-2 space-y-2">
            {Object.entries(chatGroups).map(([timeframe, { isExpanded, chats }]) => {
              const filteredChats = getFilteredChats(chats);
              
              if (filteredChats.length === 0) return null;
              
              return (
                <TimeframeSection
                  key={timeframe}
                  title={timeframe}
                  items={filteredChats}
                  isExpanded={isExpanded}
                  onToggle={() => setChatGroups(prev => ({
                    ...prev,
                    [timeframe]: { ...prev[timeframe as keyof typeof chatGroups], isExpanded: !isExpanded }
                  }))}
                  onItemClick={handleChatClick}
                  onItemDelete={handleChatDelete}
                  isCurrentChat={(item) => item.id === id}
                />
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
