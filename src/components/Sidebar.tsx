
import { Menu, Globe, ChevronDown, Key, Home, Settings, Inbox, Search, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onApiKeyChange: (apiKey: string) => void;
}

const Sidebar = ({ isOpen, onToggle, onApiKeyChange }: SidebarProps) => {
  const [apiKey, setApiKey] = useState("");
  const navigate = useNavigate();

  const navigationItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Inbox, label: "Messages", path: "/messages" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const timeframes = [
    { title: "Yesterday", items: ["Using Tailwind CSS Guide"] },
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
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className={cn(
      "fixed top-0 left-0 z-40 h-screen bg-chatgpt-sidebar transition-all duration-300",
      isOpen ? "w-64" : "w-0"
    )}>
      <nav className="flex h-full w-full flex-col px-3" aria-label="Chat history">
        {/* Header */}
        <div className="flex justify-between flex h-[60px] items-center border-b border-white/20">
          <button onClick={onToggle} className="h-10 rounded-lg px-2 text-token-text-secondary hover:bg-token-sidebar-surface-secondary">
            <Menu className="h-5 w-5" />
          </button>
          <button className="flex items-center gap-2 rounded-lg px-3 py-1 text-sm hover:bg-token-sidebar-surface-secondary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="icon-xl-heavy">
              <path d="M15.6729 3.91287C16.8918 2.69392 18.8682 2.69392 20.0871 3.91287C21.3061 5.13182 21.3061 7.10813 20.0871 8.32708L14.1499 14.2643C13.3849 15.0293 12.3925 15.5255 11.3215 15.6785L9.14142 15.9899C8.82983 16.0344 8.51546 15.9297 8.29289 15.7071C8.07033 15.4845 7.96554 15.1701 8.01005 14.8586L8.32149 12.6785C8.47449 11.6075 8.97072 10.615 9.7357 9.85006L15.6729 3.91287ZM18.6729 5.32708C18.235 4.88918 17.525 4.88918 17.0871 5.32708L11.1499 11.2643C10.6909 11.7233 10.3932 12.3187 10.3014 12.9613L10.1785 13.8215L11.0386 13.6986C11.6812 13.6068 12.2767 13.3091 12.7357 12.8501L18.6729 6.91287C19.1108 6.47497 19.1108 5.76499 18.6729 5.32708Z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-col flex-1 transition-opacity duration-500 relative -mr-2 pr-2 overflow-y-auto">
          {isOpen && (
            <>
              {/* API Key Input */}
              <div className="p-2 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="h-4 w-4" />
                  <span className="text-sm">API Key</span>
                </div>
                <Input
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  className="bg-[#2F2F2F] border-none"
                />
              </div>

              {/* Navigation Items */}
              <div className="space-y-1 px-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item.path)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-chatgpt-hover"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Chat History */}
              <div className="mt-6">
                {timeframes.map((timeframe) => (
                  <div key={timeframe.title} className="mb-4">
                    <div className="px-3 py-2 text-xs text-gray-500">{timeframe.title}</div>
                    {timeframe.items.map((item) => (
                      <div 
                        key={item} 
                        className="group flex h-10 items-center gap-2.5 rounded-lg px-3 hover:bg-chatgpt-hover cursor-pointer text-sm"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {isOpen && (
          <div className="flex flex-col py-2 border-t border-white/20">
            <button className="group flex gap-2 p-2.5 text-sm items-start hover:bg-chatgpt-hover rounded-lg px-2 text-left w-full">
              <span className="flex w-full flex-row flex-wrap-reverse justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-token-border-light">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-sm">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12.5001 3.44338C12.1907 3.26474 11.8095 3.26474 11.5001 3.44338L4.83984 7.28868C4.53044 7.46731 4.33984 7.79744 4.33984 8.1547V15.8453C4.33984 16.2026 4.53044 16.5327 4.83984 16.7113L11.5001 20.5566C11.8095 20.7353 12.1907 20.7353 12.5001 20.5566L19.1604 16.7113C19.4698 16.5327 19.6604 16.2026 19.6604 15.8453V8.1547C19.6604 7.79744 19.4698 7.46731 19.1604 7.28868L12.5001 3.44338Z" fill="currentColor"/>
                    </svg>
                  </span>
                  <div className="flex flex-col">
                    <span>Upgrade plan</span>
                    <span className="line-clamp-1 text-xs text-token-text-tertiary">Get GPT-4, DALL·E, and more</span>
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
