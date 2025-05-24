
import { DocumentChunk, generateBatchEmbeddings } from './embeddings';

export interface ProcessedDocument {
  id: string;
  title: string;
  source: string;
  chunks: DocumentChunk[];
  totalTokens: number;
  createdAt: Date;
}

export const chunkText = (text: string, maxChunkSize: number = 800, overlap: number = 100): string[] => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) continue;
    
    // Estimate token count (rough approximation: 1 token ≈ 4 characters)
    const estimatedTokens = (currentChunk + trimmedSentence).length / 4;
    
    if (estimatedTokens > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      
      // Add overlap from the end of current chunk
      const words = currentChunk.trim().split(' ');
      const overlapWords = words.slice(-Math.floor(overlap / 4));
      currentChunk = overlapWords.join(' ') + ' ' + trimmedSentence;
    } else {
      currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.filter(chunk => chunk.length > 20); // Filter out very short chunks
};

export const processDocument = async (
  content: string,
  title: string,
  source: string,
  apiKey: string
): Promise<ProcessedDocument> => {
  const chunks = chunkText(content);
  const documentId = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    const embeddings = await generateBatchEmbeddings(chunks, apiKey);
    
    const documentChunks: DocumentChunk[] = chunks.map((chunk, index) => ({
      id: `${documentId}-chunk-${index}`,
      content: chunk,
      embedding: embeddings[index].embedding,
      metadata: {
        source,
        timestamp: Date.now(),
        chunkIndex: index,
        totalChunks: chunks.length
      }
    }));

    const totalTokens = embeddings.reduce((sum, result) => sum + result.usage.total_tokens, 0);

    return {
      id: documentId,
      title,
      source,
      chunks: documentChunks,
      totalTokens,
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
};

export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const content = event.target?.result as string;
      resolve(content);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    if (file.type === 'text/plain' || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      reject(new Error('Unsupported file type. Please upload text files (.txt, .md)'));
    }
  });
};
