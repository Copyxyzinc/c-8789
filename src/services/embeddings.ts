
export interface EmbeddingResult {
  embedding: number[];
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface DocumentChunk {
  id: string;
  content: string;
  embedding: number[];
  metadata: {
    source: string;
    timestamp: number;
    chunkIndex: number;
    totalChunks: number;
  };
}

export const generateEmbedding = async (text: string, apiKey: string): Promise<EmbeddingResult> => {
  if (!apiKey) {
    throw new Error("OpenAI API key is required");
  }

  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate embedding');
    }

    const data = await response.json();
    return {
      embedding: data.data[0].embedding,
      usage: data.usage
    };
  } catch (error: any) {
    console.error('Error generating embedding:', error);
    throw new Error(error.message || 'Failed to generate embedding');
  }
};

export const generateBatchEmbeddings = async (texts: string[], apiKey: string): Promise<EmbeddingResult[]> => {
  const BATCH_SIZE = 100; // OpenAI limit
  const results: EmbeddingResult[] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: batch,
          encoding_format: 'float'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate batch embeddings');
      }

      const data = await response.json();
      const batchResults = data.data.map((item: any, index: number) => ({
        embedding: item.embedding,
        usage: {
          prompt_tokens: data.usage.prompt_tokens,
          total_tokens: data.usage.total_tokens
        }
      }));
      
      results.push(...batchResults);
    } catch (error: any) {
      console.error('Error generating batch embeddings:', error);
      throw new Error(error.message || 'Failed to generate batch embeddings');
    }
  }

  return results;
};
