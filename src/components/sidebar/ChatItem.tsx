
import { MessageSquare, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { DraggableProvided } from "@hello-pangea/dnd";

interface ChatItemProps {
  item: string;
  isActive: boolean;
  onClick: () => void;
  draggableProvided?: DraggableProvided;
  showDragHandle?: boolean;
}

export const ChatItem = ({ item, isActive, onClick, draggableProvided, showDragHandle }: ChatItemProps) => {
  return (
    <div
      ref={draggableProvided?.innerRef}
      {...draggableProvided?.draggableProps}
      {...draggableProvided?.dragHandleProps}
      className={cn(
        "group flex w-full h-9 items-center gap-2.5 rounded-lg px-4 text-sm ml-2",
        "transition-all duration-300 hover:scale-105",
        "hover:bg-white/10 cursor-pointer",
        isActive && "bg-white/20 hover:bg-white/25"
      )}
      onClick={onClick}
    >
      {showDragHandle && <GripVertical className="h-3 w-3 text-gray-400" />}
      <MessageSquare className={cn(
        "h-3 w-3 text-gray-400 transition-transform duration-300",
        "group-hover:rotate-12"
      )} />
      <span className="truncate">{item}</span>
    </div>
  );
};
