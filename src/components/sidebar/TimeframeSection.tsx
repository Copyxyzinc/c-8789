
import { Clock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatItem } from "./ChatItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface TimeframeSectionProps {
  title: string;
  items: {id: string, title: string}[];
  isExpanded: boolean;
  onToggle: () => void;
  onItemClick: (item: {id: string, title: string}) => void;
  onItemDelete?: (id: string) => void;
  isCurrentChat: (item: {id: string, title: string}) => boolean;
  isDraggable?: boolean;
  onDragEnd?: (result: any) => void;
}

export const TimeframeSection = ({
  title,
  items,
  isExpanded,
  onToggle,
  onItemClick,
  onItemDelete,
  isCurrentChat,
  isDraggable,
  onDragEnd
}: TimeframeSectionProps) => {
  return (
    <div className="mb-2 animate-fade-in">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-400 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105"
      >
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3" />
          <span>{title}</span>
        </div>
        <ChevronDown 
          className={cn(
            "h-3 w-3 transition-transform duration-300",
            isExpanded ? "rotate-180" : ""
          )} 
        />
      </button>
      <div className={cn(
        "mt-1 space-y-1 overflow-hidden transition-all duration-300",
        isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        {isDraggable && onDragEnd ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="favorites">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <ChatItem
                          item={item}
                          isActive={isCurrentChat(item)}
                          onClick={() => onItemClick(item)}
                          onDelete={onItemDelete ? () => onItemDelete(item.id) : undefined}
                          draggableProvided={provided}
                          showDragHandle={true}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          items.map((item) => (
            <ChatItem
              key={item.id}
              item={item}
              isActive={isCurrentChat(item)}
              onClick={() => onItemClick(item)}
              onDelete={onItemDelete ? () => onItemDelete(item.id) : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
};
