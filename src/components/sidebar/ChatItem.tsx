
import { MessageSquare, GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DraggableProvided } from "@hello-pangea/dnd";
import { useState } from "react";

interface ChatItemProps {
  item: {id: string, title: string};
  isActive: boolean;
  onClick: () => void;
  onDelete?: () => void;
  draggableProvided?: DraggableProvided;
  showDragHandle?: boolean;
}

export const ChatItem = ({ 
  item, 
  isActive, 
  onClick, 
  onDelete,
  draggableProvided, 
  showDragHandle 
}: ChatItemProps) => {
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  
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
      onMouseEnter={() => setShowDeleteButton(true)}
      onMouseLeave={() => setShowDeleteButton(false)}
    >
      {showDragHandle && <GripVertical className="h-3 w-3 text-gray-400" />}
      <MessageSquare className={cn(
        "h-3 w-3 text-gray-400 transition-transform duration-300",
        "group-hover:rotate-12"
      )} />
      <span className="truncate flex-1">{item.title}</span>
      
      {onDelete && showDeleteButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};
