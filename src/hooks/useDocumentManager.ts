
import { useState, useEffect } from 'react';
import { ProcessedDocument, processDocument, extractTextFromFile } from '@/services/documentProcessor';
import { vectorDB } from '@/services/vectorDatabase';
import { toast } from 'sonner';

export const useDocumentManager = (apiKey: string) => {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const docs = await vectorDB.getAllDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Erro ao carregar documentos');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadDocument = async (file: File): Promise<void> => {
    if (!apiKey) {
      toast.error('Chave de API do OpenAI é necessária');
      return;
    }

    try {
      setIsProcessing(true);
      toast.info('Processando documento...');

      const content = await extractTextFromFile(file);
      const document = await processDocument(
        content,
        file.name,
        file.name,
        apiKey
      );

      await vectorDB.addDocument(document);
      setDocuments(prev => [...prev, document]);
      
      toast.success(`Documento "${file.name}" processado com sucesso`);
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast.error(error.message || 'Erro ao processar documento');
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteDocument = async (documentId: string): Promise<void> => {
    try {
      await vectorDB.deleteDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast.success('Documento removido com sucesso');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Erro ao remover documento');
    }
  };

  return {
    documents,
    isLoading,
    isProcessing,
    uploadDocument,
    deleteDocument,
    loadDocuments
  };
};
