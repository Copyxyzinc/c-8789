
import { useState } from 'react';
import { Settings, X, Moon, Sun, Download, Upload, FileText, Trash2, Database } from 'lucide-react';
import { toast } from 'sonner';
import { useChatSettings } from '@/hooks/useChatSettings';
import { useDocumentManager } from '@/hooks/useDocumentManager';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onExportChats: () => void;
  onImportChats: (data: any) => void;
  apiKey: string;
}

const SettingsPanel = ({ isOpen, onClose, onExportChats, onImportChats, apiKey }: SettingsPanelProps) => {
  const { settings, updateSettings } = useChatSettings();
  const { documents, isLoading, isProcessing, uploadDocument, deleteDocument } = useDocumentManager(apiKey);
  const [activeTab, setActiveTab] = useState<'general' | 'rag' | 'documents'>('general');

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

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadDocument(file);
      event.target.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-[#343541] border border-white/10 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Configurações</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3 py-2 rounded text-sm ${
              activeTab === 'general' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            Geral
          </button>
          <button
            onClick={() => setActiveTab('rag')}
            className={`px-3 py-2 rounded text-sm ${
              activeTab === 'rag' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Database className="h-4 w-4 inline mr-1" />
            RAG
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-2 rounded text-sm ${
              activeTab === 'documents' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-1" />
            Documentos
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Temperatura: {settings.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="text-xs text-gray-400 mt-1">
                  Controla a criatividade das respostas
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Max Tokens: {settings.maxTokens}
                </label>
                <input
                  type="range"
                  min="100"
                  max="4000"
                  step="100"
                  value={settings.maxTokens}
                  onChange={(e) => updateSettings({ maxTokens: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-xs text-gray-400 mt-1">
                  Tamanho máximo das respostas
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Modo Escuro</span>
                <button
                  onClick={() => updateSettings({ isDarkMode: !settings.isDarkMode })}
                  className="flex items-center gap-2 p-2 hover:bg-white/10 rounded"
                >
                  {settings.isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
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
          )}

          {activeTab === 'rag' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Habilitar RAG</span>
                <button
                  onClick={() => updateSettings({ ragEnabled: !settings.ragEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.ragEnabled ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.ragEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {settings.ragEnabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Documentos Relevantes: {settings.ragTopK}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={settings.ragTopK}
                      onChange={(e) => updateSettings({ ragTopK: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      Número de trechos de documentos para buscar
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Similaridade Mínima: {settings.ragMinSimilarity}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.ragMinSimilarity}
                      onChange={(e) => updateSettings({ ragMinSimilarity: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      Limiar de similaridade para incluir contexto
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tamanho Máximo do Contexto: {settings.ragMaxContext}
                    </label>
                    <input
                      type="range"
                      min="1000"
                      max="8000"
                      step="500"
                      value={settings.ragMaxContext}
                      onChange={(e) => updateSettings({ ragMaxContext: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      Número máximo de caracteres de contexto
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 w-full p-3 border-2 border-dashed border-white/20 rounded-lg hover:border-white/40 cursor-pointer transition-colors">
                  <Upload className="h-5 w-5" />
                  {isProcessing ? 'Processando...' : 'Carregar Documento (.txt, .md)'}
                  <input
                    type="file"
                    accept=".txt,.md"
                    onChange={handleDocumentUpload}
                    disabled={isProcessing || !apiKey}
                    className="hidden"
                  />
                </label>
                {!apiKey && (
                  <div className="text-xs text-yellow-400 mt-1">
                    Chave de API do OpenAI necessária para processar documentos
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Documentos Carregados ({documents.length})</h3>
                {isLoading ? (
                  <div className="text-sm text-gray-400">Carregando...</div>
                ) : documents.length === 0 ? (
                  <div className="text-sm text-gray-400">Nenhum documento carregado</div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 bg-white/5 rounded">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{doc.title}</div>
                          <div className="text-xs text-gray-400">
                            {doc.chunks.length} trechos • {doc.totalTokens} tokens
                          </div>
                        </div>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors"
                          title="Remover documento"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
