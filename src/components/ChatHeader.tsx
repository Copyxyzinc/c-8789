import { Menu } from "lucide-react";

interface ChatHeaderProps {
  isSidebarOpen: boolean;
  onMenuClick?: () => void;
}

const ChatHeader = ({ isSidebarOpen, onMenuClick }: ChatHeaderProps) => {
  return (
    <header className="fixed top-0 z-10 w-full border-b border-white/10 bg-[#343541] py-3">
      <div className="flex items-center justify-between px-4">
        <button 
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-white/10 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center space-x-4">
          {/* Add header actions here if needed */}
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
