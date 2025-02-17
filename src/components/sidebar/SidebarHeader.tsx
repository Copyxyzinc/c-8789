
import { Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  onToggle: () => void;
  onNewChat: () => void;
  isCurrentChat: (item: string) => boolean;
}

export const SidebarHeader = ({ onToggle, onNewChat, isCurrentChat }: SidebarHeaderProps) => {
  return (
    <div className="flex justify-between flex h-[60px] items-center border-b border-white/10">
      <button 
        onClick={onToggle} 
        className="h-10 rounded-lg px-2 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <button 
        onClick={onNewChat}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-1 text-sm transition-all duration-300",
          "hover:bg-white/10 hover:scale-105",
          isCurrentChat('New Chat') && "bg-white/20 hover:bg-white/25"
        )}
      >
        <Plus className="h-5 w-5" />
        <span>New Chat</span>
      </button>
    </div>
  );
};
