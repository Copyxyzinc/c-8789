
import { useState, useRef, useEffect } from "react";
import { Send, Lightbulb } from "lucide-react";
import { useAutoSave } from '@/hooks/useAutoSave';
import { useParams } from 'react-router-dom';

interface EnhancedChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
  initialValue?: string;
}

const promptSuggestions = [
  "Explique como...",
  "Crie uma lista de...",
  "Compare e contraste...",
  "Resuma o seguinte...",
  "Qual é a melhor forma de...",
];

const EnhancedChatInput = ({ 
  onSend, 
  isLoading, 
  placeholder = "Digite uma mensagem...",
  initialValue = ""
}: EnhancedChatInputProps) => {
  const { id } = useParams();
  const [message, setMessage] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save draft
  const { clearDraft, getDraft } = useAutoSave({
    data: message,
    key: id || 'new',
    delay: 500
  });

  // Load draft on mount and update message when initialValue changes
  useEffect(() => {
    if (initialValue) {
      setMessage(initialValue);
    } else if (!message) {
      const draft = getDraft();
      if (draft) {
        setMessage(draft);
      }
    }
  }, [initialValue, getDraft]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message);
      clearDraft(); // Clear saved draft after sending
      setMessage("");
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={`${placeholder} (Ctrl+Enter para enviar)`}
          disabled={isLoading}
          rows={1}
          className="w-full rounded-lg bg-[#40414f] px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none min-h-[48px] max-h-32"
        />
        
        <div className="absolute right-2 top-2 flex gap-1">
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="p-2 text-gray-400 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
          >
            <Lightbulb className="h-5 w-5" />
          </button>
          
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="p-2 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400 rounded-lg transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>

      {showSuggestions && (
        <div className="absolute bottom-full mb-2 w-full bg-[#40414f] border border-white/10 rounded-lg p-2 z-10">
          <div className="text-xs text-gray-400 mb-2">Sugestões:</div>
          <div className="space-y-1">
            {promptSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left p-2 text-sm hover:bg-white/10 rounded transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedChatInput;
