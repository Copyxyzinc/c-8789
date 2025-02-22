
import { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const ChatInput = ({ onSend, isLoading, placeholder = "Type a message..." }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        disabled={isLoading}
        className="w-full rounded-lg bg-[#40414f] px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
      />
      <button
        type="submit"
        disabled={!message.trim() || isLoading}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  );
};

export default ChatInput;