
import { useState } from "react";
import { Volume2, ThumbsUp, ThumbsDown, Copy, RotateCcw, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

interface MessageActionsProps {
  content: string;
  onRegenerate?: () => void;
}

const MessageActions = ({ content, onRegenerate }: MessageActionsProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
      .then(() => toast.success("Mensagem copiada para o clipboard"))
      .catch(() => toast.error("Falha ao copiar mensagem"));
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(content);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    } else {
      toast.error("Seu navegador não suporta sintetização de voz");
    }
  };

  return (
    <div className="flex items-center gap-2 text-gray-400">
      <button 
        className={`p-1 hover:text-white transition-colors ${isSpeaking ? 'text-white' : ''}`}
        onClick={handleSpeak}
        title={isSpeaking ? "Parar de ler" : "Ler em voz alta"}
      >
        <Volume2 className="h-4 w-4" />
      </button>
      <button className="p-1 hover:text-white transition-colors" title="Gostei">
        <ThumbsUp className="h-4 w-4" />
      </button>
      <button className="p-1 hover:text-white transition-colors" title="Não gostei">
        <ThumbsDown className="h-4 w-4" />
      </button>
      <button 
        className="p-1 hover:text-white transition-colors" 
        onClick={handleCopy}
        title="Copiar mensagem"
      >
        <Copy className="h-4 w-4" />
      </button>
      {onRegenerate && (
        <button 
          className="p-1 hover:text-white transition-colors"
          onClick={onRegenerate}
          title="Regenerar resposta"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      )}
      <button className="p-1 hover:text-white transition-colors" title="Mais opções">
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
};

export default MessageActions;
