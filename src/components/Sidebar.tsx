
import { Menu, Globe, ChevronDown, Key, Clock, Calendar, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onApiKeyChange: (apiKey: string) => void;
}

interface TimeframeProps {
  title: string;
  items: string[];
  isExpanded?: boolean;
}

const Sidebar = ({ isOpen, onToggle, onApiKeyChange }: SidebarProps) => {
  const [apiKey, setApiKey] = useState("");
  const [expandedTimeframes, setExpandedTimeframes] = useState<Record<string, boolean>>({
    "Favorites": true,
    "Yesterday": true,
    "Previous 7 Days": true,
    "Previous 30 Days": true
  });
  const navigate = useNavigate();

  const timeframes: TimeframeProps[] = [
    {
      title: "Favorites",
      items: [
        "AI Development Guide",
        "Project Architecture",
        "Best Practices"
      ]
    },
    { 
      title: "Yesterday", 
      items: ["Using Tailwind CSS Guide"] 
    },
    { 
      title: "Previous 7 Days", 
      items: [
        "Likeable and Inception Levels",
        "Viral Figma Board Ideas",
        "RAG Status in Software Dev",
        "Image Input ChatGPT API"
      ] 
    },
    {
      title: "Previous 30 Days",
      items: [
        "Focus on Lovable Viral",
        "Create Twitter Clone",
        "Reddit Posting Guidelines",
        "Revamping Social Features",
        "US AI Voting Logo"
      ]
    }
  ];

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    onApiKeyChange(newApiKey);
    toast.success("API Key updated successfully");
  };

  const toggleTimeframe = (title: string) => {
    setExpandedTimeframes(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const handleChatItemClick = (item: string) => {
    toast.info(`Loading chat: ${item}`);
    // Here you would typically navigate to the specific chat or load its content
    navigate(`/chat/${encodeURIComponent(item)}`);
  };

  const handleNewChat = () => {
    toast.info("Creating new chat");
    navigate('/chat/new');
  };

  return (
    <div className={cn(
      "fixed top-0 left-0 z-40 h-screen bg-chatgpt-sidebar transition-all duration-300 ease-in-out",
      isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full"
    )}>
      <nav className="flex h-full w-full flex-col px-3" aria-label="Chat history">
        <div className="flex justify-between flex h-[60px] items-center border-b border-white/10">
          <button 
            onClick={onToggle} 
            className="h-10 rounded-lg px-2 text-white hover:bg-white/10 transition-colors duration-200"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button 
            onClick={handleNewChat}
            className="flex items-center gap-2 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-col flex-1 transition-all duration-300 relative -mr-2 pr-2 overflow-y-auto">
          {isOpen && (
            <>
              <div className="p-2 mb-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="h-4 w-4" />
                  <span className="text-sm">API Key</span>
                </div>
                <Input
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  className="bg-[#2F2F2F] border-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <div className="bg-token-sidebar-surface-primary pt-0 animate-fade-in">
                <div className="flex flex-col gap-2 px-2 py-2 border-b border-white/10 mb-4">
                  <div className="group flex h-10 items-center gap-2.5 rounded-lg px-2 hover:bg-white/10 cursor-pointer transition-colors duration-200">
                    <div className="h-6 w-6 flex items-center justify-center">
                      <Globe className="h-4 w-4" />
                    </div>
                    <span className="text-sm">ChatGPT</span>
                  </div>
                  <div className="group flex h-10 items-center gap-2.5 rounded-lg px-2 hover:bg-white/10 cursor-pointer transition-colors duration-200">
                    <div className="h-6 w-6 flex items-center justify-center">
                      <Settings className="h-4 w-4" />
                    </div>
                    <span className="text-sm">Settings</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {timeframes.map((timeframe) => (
                    <div key={timeframe.title} className="mb-2 animate-fade-in">
                      <button 
                        onClick={() => toggleTimeframe(timeframe.title)}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-400 hover:bg-white/10 rounded-lg transition-colors duration-200"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>{timeframe.title}</span>
                        </div>
                        <ChevronDown 
                          className={cn(
                            "h-3 w-3 transition-transform duration-300",
                            expandedTimeframes[timeframe.title] ? "rotate-180" : ""
                          )} 
                        />
                      </button>
                      <div className={cn(
                        "mt-1 space-y-1 overflow-hidden transition-all duration-300",
                        expandedTimeframes[timeframe.title] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      )}>
                        {timeframe.items.map((item) => (
                          <button 
                            key={item} 
                            onClick={() => handleChatItemClick(item)}
                            className="group flex w-full h-9 items-center gap-2.5 rounded-lg px-4 hover:bg-white/10 cursor-pointer text-sm ml-2 transition-colors duration-200"
                          >
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="truncate">{item}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {isOpen && (
          <div className="flex flex-col py-2 border-t border-white/10 animate-fade-in">
            <button className="group flex gap-2 p-2.5 text-sm items-start hover:bg-white/10 rounded-lg px-2 text-left w-full min-w-[200px] transition-colors duration-200">
              <span className="flex w-full flex-row flex-wrap-reverse justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20">
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
