
import { Globe, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { WelcomeMessage } from "./sidebar/WelcomeMessage";
import { ApiKeyInput } from "./sidebar/ApiKeyInput";
import { SearchBar } from "./sidebar/SearchBar";
import { TimeframeSection } from "./sidebar/TimeframeSection";
import { SidebarHeader } from "./sidebar/SidebarHeader";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onApiKeyChange: (apiKey: string) => void;
}

const Sidebar = ({ isOpen, onToggle, onApiKeyChange }: SidebarProps) => {
  const [apiKey, setApiKey] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([
    "AI Development Guide",
    "Project Architecture",
    "Best Practices"
  ]);
  const [expandedTimeframes, setExpandedTimeframes] = useState<Record<string, boolean>>({
    "Favorites": true,
    "Yesterday": true,
    "Previous 7 Days": true,
    "Previous 30 Days": true
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = decodeURIComponent(location.pathname);
  const isIndex = location.pathname === '/';

  const timeframes = [
    { 
      title: "Favorites", 
      items: favorites
    },
    { 
      title: "Yesterday", 
      items: ["Using Tailwind CSS Guide"].filter(item => 
        item.toLowerCase().includes(searchQuery.toLowerCase())
      ) 
    },
    { 
      title: "Previous 7 Days", 
      items: [
        "Likeable and Inception Levels",
        "Viral Figma Board Ideas",
        "RAG Status in Software Dev",
        "Image Input ChatGPT API"
      ].filter(item => 
        item.toLowerCase().includes(searchQuery.toLowerCase())
      ) 
    },
    {
      title: "Previous 30 Days",
      items: [
        "Focus on Lovable Viral",
        "Create Twitter Clone",
        "Reddit Posting Guidelines",
        "Revamping Social Features",
        "US AI Voting Logo"
      ].filter(item => 
        item.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
  ];

  const handleChatItemClick = (item: string) => {
    toast.info(`Loading chat: ${item}`);
    navigate(`/chat/${encodeURIComponent(item)}`);
  };

  const handleNewChat = () => {
    toast.info("Creating new chat");
    navigate('/chat/new');
  };

  const isCurrentChat = (item: string) => {
    return currentPath === `/chat/${item}` || (currentPath === '/chat/new' && item === 'New Chat');
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(favorites);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setFavorites(items);
    toast.success("Favorites reordered successfully");
  };

  const toggleTimeframe = (title: string) => {
    setExpandedTimeframes(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className={cn(
      "fixed top-0 left-0 z-40 h-screen bg-chatgpt-sidebar transition-all duration-500 ease-in-out",
      "md:translate-x-0 md:w-64",
      isOpen ? "w-full md:w-64 translate-x-0" : "w-0 -translate-x-full"
    )}>
      <nav className="flex h-full w-full flex-col px-3" aria-label="Chat history">
        <SidebarHeader 
          onToggle={onToggle}
          onNewChat={handleNewChat}
          isCurrentChat={isCurrentChat}
        />

        <div className="flex-col flex-1 transition-all duration-300 relative -mr-2 pr-2 overflow-y-auto">
          {isOpen && (
            <>
              {isIndex && <WelcomeMessage />}

              <ApiKeyInput 
                apiKey={apiKey}
                onApiKeyChange={(newApiKey) => {
                  setApiKey(newApiKey);
                  onApiKeyChange(newApiKey);
                }}
              />

              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />

              <div className="bg-token-sidebar-surface-primary pt-0 animate-fade-in">
                <div className="flex flex-col gap-2 px-2 py-2 border-b border-white/10 mb-4">
                  <div className="group flex h-10 items-center gap-2.5 rounded-lg px-2 hover:bg-white/10 cursor-pointer transition-all duration-300 hover:scale-105">
                    <div className="h-6 w-6 flex items-center justify-center">
                      <Globe className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <span className="text-sm">ChatGPT</span>
                  </div>
                  <div className="group flex h-10 items-center gap-2.5 rounded-lg px-2 hover:bg-white/10 cursor-pointer transition-all duration-300 hover:scale-105">
                    <div className="h-6 w-6 flex items-center justify-center">
                      <Settings className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                    </div>
                    <span className="text-sm">Settings</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {timeframes.map((timeframe) => (
                    <TimeframeSection
                      key={timeframe.title}
                      title={timeframe.title}
                      items={timeframe.items}
                      isExpanded={expandedTimeframes[timeframe.title]}
                      onToggle={() => toggleTimeframe(timeframe.title)}
                      onItemClick={handleChatItemClick}
                      isCurrentChat={isCurrentChat}
                      isDraggable={timeframe.title === "Favorites"}
                      onDragEnd={timeframe.title === "Favorites" ? handleDragEnd : undefined}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {isOpen && (
          <div className="flex flex-col py-2 border-t border-white/10 animate-fade-in">
            <button className="group flex gap-2 p-2.5 text-sm items-start hover:bg-white/10 rounded-lg px-2 text-left w-full min-w-[200px] transition-all duration-300 hover:scale-105">
              <span className="flex w-full flex-row flex-wrap-reverse justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 group-hover:border-white/40 transition-colors duration-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-sm">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12.5001 3.44338C12.1907 3.26474 11.8095 3.26474 11.5001 3.44338L4.83984 7.28868C4.53044 7.46731 4.33984 7.79744 4.33984 8.1547V15.8453C4.33984 16.2026 4.53044 16.5327 4.83984 16.7113L11.5001 20.5566C11.8095 20.7353 12.1907 20.7353 12.5001 20.5566L19.1604 16.7113C19.4698 16.5327 19.6604 16.2026 19.6604 15.8453V8.1547C19.6604 7.79744 19.4698 7.46731 19.1604 7.28868L12.5001 3.44338Z" fill="currentColor"/>
                    </svg>
                  </span>
                  <div className="flex flex-col">
                    <span>Upgrade plan</span>
                    <span className="line-clamp-1 text-xs text-gray-400">More access to the best models</span>
                  </div>
                </div>
              </span>
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
