
import { generateEmbedding } from './embeddings';
import { vectorDB, SimilarityResult } from './vectorDatabase';

export interface RAGContext {
  retrievedChunks: SimilarityResult[];
  contextText: string;
  sources: string[];
}

export interface RAGConfig {
  topK: number;
  minSimilarity: number;
  maxContextLength: number;
  includeMetadata: boolean;
}

const defaultRAGConfig: RAGConfig = {
  topK: 5,
  minSimilarity: 0.5,
  maxContextLength: 3000,
  includeMetadata: true
};

export const retrieveContext = async (
  query: string,
  apiKey: string,
  config: Partial<RAGConfig> = {}
): Promise<RAGContext> => {
  const ragConfig = { ...defaultRAGConfig, ...config };

  try {
    // Generate embedding for the query
    const queryEmbeddingResult = await generateEmbedding(query, apiKey);
    
    // Search for similar chunks
    const similarChunks = await vectorDB.similaritySearch(
      queryEmbeddingResult.embedding,
      ragConfig.topK,
      ragConfig.minSimilarity
    );

    // Build context text from retrieved chunks
    let contextText = '';
    const sources = new Set<string>();
    let currentLength = 0;

    for (const result of similarChunks) {
      const chunkText = ragConfig.includeMetadata 
        ? `[Source: ${result.chunk.metadata.source}]\n${result.chunk.content}\n\n`
        : `${result.chunk.content}\n\n`;

      if (currentLength + chunkText.length > ragConfig.maxContextLength) {
        break;
      }

      contextText += chunkText;
      currentLength += chunkText.length;
      sources.add(result.chunk.metadata.source);
    }

    return {
      retrievedChunks: similarChunks,
      contextText: contextText.trim(),
      sources: Array.from(sources)
    };
  } catch (error) {
    console.error('Error retrieving context:', error);
    throw error;
  }
};

export const enhancePromptWithContext = (
  userMessage: string,
  context: RAGContext
): string => {
  if (!context.contextText) {
    return userMessage;
  }

  return `Context information:
${context.contextText}

Based on the above context, please answer the following question:
${userMessage}

If the context doesn't contain relevant information to answer the question, please say so and answer based on your general knowledge.`;
};

export const formatContextSources = (sources: string[]): string => {
  if (sources.length === 0) return '';
  
  return `\n\n---\n**Sources:** ${sources.join(', ')}`;
};
