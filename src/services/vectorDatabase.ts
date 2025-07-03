
import { DocumentChunk, ProcessedDocument } from './documentProcessor';

export interface SimilarityResult {
  chunk: DocumentChunk;
  similarity: number;
}

class VectorDatabase {
  private dbName = 'vector_db';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        
        if (!db.objectStoreNames.contains('documents')) {
          const documentsStore = db.createObjectStore('documents', { keyPath: 'id' });
          documentsStore.createIndex('source', 'source', { unique: false });
          documentsStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('chunks')) {
          const chunksStore = db.createObjectStore('chunks', { keyPath: 'id' });
          chunksStore.createIndex('source', 'metadata.source', { unique: false });
          chunksStore.createIndex('timestamp', 'metadata.timestamp', { unique: false });
        }
      };
    });
  }

  async addDocument(document: ProcessedDocument): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['documents', 'chunks'], 'readwrite');
    const documentsStore = transaction.objectStore('documents');
    const chunksStore = transaction.objectStore('chunks');

    // Store document metadata
    await documentsStore.put(document);

    // Store individual chunks
    for (const chunk of document.chunks) {
      await chunksStore.put(chunk);
    }

    return new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getAllDocuments(): Promise<ProcessedDocument[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['documents'], 'readonly');
      const store = transaction.objectStore('documents');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteDocument(documentId: string): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['documents', 'chunks'], 'readwrite');
    const documentsStore = transaction.objectStore('documents');
    const chunksStore = transaction.objectStore('chunks');

    // Delete document
    await documentsStore.delete(documentId);

    // Delete associated chunks
    const chunks = await this.getChunksByDocument(documentId);
    for (const chunk of chunks) {
      await chunksStore.delete(chunk.id);
    }

    return new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  private async getChunksByDocument(documentId: string): Promise<DocumentChunk[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['chunks'], 'readonly');
      const store = transaction.objectStore('chunks');
      const request = store.getAll();

      request.onsuccess = () => {
        const allChunks = request.result;
        const documentChunks = allChunks.filter(chunk => 
          chunk.id.startsWith(documentId)
        );
        resolve(documentChunks);
      };
      request.onerror = () => reject(request.error);
    });
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async similaritySearch(
    queryEmbedding: number[],
    topK: number = 5,
    minSimilarity: number = 0.5
  ): Promise<SimilarityResult[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['chunks'], 'readonly');
      const store = transaction.objectStore('chunks');
      const request = store.getAll();

      request.onsuccess = () => {
        const allChunks = request.result;
        const similarities: SimilarityResult[] = [];

        for (const chunk of allChunks) {
          const similarity = this.cosineSimilarity(queryEmbedding, chunk.embedding);
          if (similarity >= minSimilarity) {
            similarities.push({ chunk, similarity });
          }
        }

        // Sort by similarity score (descending) and take top K
        similarities.sort((a, b) => b.similarity - a.similarity);
        resolve(similarities.slice(0, topK));
      };

      request.onerror = () => reject(request.error);
    });
  }
}

export const vectorDB = new VectorDatabase();
