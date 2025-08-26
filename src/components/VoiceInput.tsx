import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useConversation } from '@11labs/react';

// Type declarations for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
    SpeechRecognition: typeof SpeechRecognition;
  }
}

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isEnabled: boolean;
  elevenLabsApiKey?: string;
}

const VoiceInput = ({ onTranscript, isEnabled, elevenLabsApiKey }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  
  // ElevenLabs conversation for TTS
  const conversation = useConversation({
    onConnect: () => console.log('Voice connection established'),
    onDisconnect: () => console.log('Voice connection ended'),
    onMessage: (message) => console.log('Voice message:', message),
    onError: (error) => {
      console.error('Voice error:', error);
      toast.error('Erro na conexão de voz');
    }
  });

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 
        ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'pt-BR';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0].transcript;
        onTranscript(transcript);
        toast.success(`Reconhecido: "${transcript}"`);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Erro no reconhecimento de voz');
      };
      
      setSpeechRecognition(recognition);
    }
  }, [onTranscript]);

  // Check microphone permission
  useEffect(() => {
    const checkPermission = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop());
          setHasPermission(true);
        }
      } catch (error) {
        setHasPermission(false);
        console.error('Microphone permission denied:', error);
      }
    };

    checkPermission();
  }, []);

  const startListening = async () => {
    if (!speechRecognition) {
      toast.error('Reconhecimento de voz não suportado neste navegador');
      return;
    }

    if (!hasPermission) {
      toast.error('Permissão de microfone necessária');
      return;
    }

    try {
      speechRecognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast.error('Erro ao iniciar reconhecimento de voz');
    }
  };

  const stopListening = () => {
    if (speechRecognition && isListening) {
      speechRecognition.stop();
    }
  };

  const speakText = async (text: string) => {
    if (!elevenLabsApiKey) {
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
      } else {
        toast.error('Text-to-speech não suportado');
      }
      return;
    }

    try {
      // Use ElevenLabs for high-quality TTS
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
          toast.error('Erro ao reproduzir áudio');
        });
        
        audio.onended = () => URL.revokeObjectURL(audioUrl);
      } else {
        throw new Error('Failed to generate speech');
      }
    } catch (error) {
      console.error('TTS error:', error);
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        speechSynthesis.speak(utterance);
      }
    }
  };

  if (!isEnabled) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={isListening ? stopListening : startListening}
        disabled={!hasPermission || !speechRecognition}
        className={`p-2 ${isListening ? 'bg-red-500/20 text-red-400' : 'text-gray-400 hover:text-white'}`}
        title={isListening ? 'Parar gravação' : 'Iniciar gravação'}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          // This would be connected to speak the last assistant message
          toast.info('Função de leitura em desenvolvimento');
        }}
        className="p-2 text-gray-400 hover:text-white"
        title="Ler última resposta"
      >
        <Volume2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default VoiceInput;