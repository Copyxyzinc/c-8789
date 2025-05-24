
import { useState } from 'react';
import { Settings, X, Moon, Sun, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onExportChats: () => void;
  onImportChats: (data: any) => void;
}

const SettingsPanel = ({ isOpen, onClose, onExportChats, onImportChats }: SettingsPanelProps) => {
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          onImportChats(data);
          toast.success('Conversas importadas com sucesso');
        } catch (error) {
          toast.error('Erro ao importar conversas');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-[#343541] border border-white/10 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Configurações</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Temperatura: {temperature}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-400 mt-1">
              Controla a criatividade das respostas
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Max Tokens: {maxTokens}
            </label>
            <input
              type="range"
              min="100"
              max="4000"
              step="100"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-400 mt-1">
              Tamanho máximo das respostas
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Modo Escuro</span>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex items-center gap-2 p-2 hover:bg-white/10 rounded"
            >
              {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </div>

          <div className="border-t border-white/10 pt-4">
            <h3 className="text-sm font-medium mb-3">Gerenciar Dados</h3>
            <div className="space-y-2">
              <button
                onClick={onExportChats}
                className="flex items-center gap-2 w-full p-2 hover:bg-white/10 rounded text-sm"
              >
                <Download className="h-4 w-4" />
                Exportar Conversas
              </button>
              
              <label className="flex items-center gap-2 w-full p-2 hover:bg-white/10 rounded text-sm cursor-pointer">
                <Upload className="h-4 w-4" />
                Importar Conversas
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
