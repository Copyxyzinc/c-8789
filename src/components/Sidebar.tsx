
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SearchBar } from './sidebar/SearchBar';
import { ApiKeyInput } from './sidebar/ApiKeyInput';
import { TimeframeSection } from './sidebar/TimeframeSection';
import { WelcomeMessage } from './sidebar/WelcomeMessage';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onApiKeyChange: (apiKey: string) => void;
}

const Sidebar = ({ isOpen, onToggle, onApiKeyChange }: SidebarProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [sections, setSections] = useState({
    today: { isExpanded: true, chats: ['Recent Chat 1', 'Recent Chat 2'] },
    yesterday: { isExpanded: false, chats: ['Yesterday Chat 1'] },
    previous: { isExpanded: false, chats: ['Last Week Chat 1', 'Old Chat 1'] },
  });

  const handleNewChat = () => {
    setCurrentChat('New Chat');
    navigate('/chat/new');
  };

  const handleChatClick = (chat: string) => {
    setCurrentChat(chat);
    navigate(`/chat/${encodeURIComponent(chat)}`);
  };

  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
    onApiKeyChange(newApiKey);
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
          isCurrentChat={(item) => item === currentChat}
        />
        
        <div className="flex-1 overflow-y-auto">
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <ApiKeyInput 
            apiKey={apiKey}
            onApiKeyChange={handleApiKeyChange}
          />

          <WelcomeMessage />

          <div className="px-2 space-y-2">
            {Object.entries(sections).map(([timeframe, { isExpanded, chats }]) => (
              <TimeframeSection
                key={timeframe}
                title={timeframe}
                items={chats}
                isExpanded={isExpanded}
                onToggle={() => setSections(prev => ({
                  ...prev,
                  [timeframe]: { ...prev[timeframe as keyof typeof sections], isExpanded: !isExpanded }
                }))}
                onItemClick={handleChatClick}
                isCurrentChat={(item) => item === currentChat}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;