import { py } from './bridge/multimind-bridge';

export interface Document {
  text: string;
  metadata?: Record<string, any>;
  id?: string;
}

export interface AdvancedRAGConfig {
  vectorStore?: 'faiss' | 'chroma' | 'pinecone' | 'weaviate';
  embeddingModel?: string;
  chunkSize?: number;
  chunkOverlap?: number;
  topK?: number;
  similarityThreshold?: number;
  hybridRetrieval?: boolean;
  knowledgeGraph?: boolean;
  cacheResults?: boolean;
}

export interface QueryConfig {
  query: string;
  topK?: number;
  similarityThreshold?: number;
  filters?: Record<string, any>;
  includeMetadata?: boolean;
  hybridSearch?: boolean;
}

export class AdvancedRAGClient {
  private client: any;
  private config: AdvancedRAGConfig;

  constructor(config: AdvancedRAGConfig = {}) {
    this.config = {
      vectorStore: 'chroma',
      embeddingModel: 'text-embedding-ada-002',
      chunkSize: 1000,
      chunkOverlap: 200,
      topK: 5,
      similarityThreshold: 0.7,
      hybridRetrieval: false,
      knowledgeGraph: false,
      cacheResults: true,
      ...config
    };
  }

  async initialize() {
    try {
      this.client = await py`RAGClient(
        vector_store=${this.config.vectorStore},
        embedding_model=${this.config.embeddingModel},
        chunk_size=${this.config.chunkSize},
        chunk_overlap=${this.config.chunkOverlap},
        top_k=${this.config.topK},
        similarity_threshold=${this.config.similarityThreshold},
        hybrid_retrieval=${this.config.hybridRetrieval},
        knowledge_graph=${this.config.knowledgeGraph},
        cache_results=${this.config.cacheResults}
      )`;
      return { success: true, message: 'Advanced RAG client initialized' };
    } catch (error) {
      console.error('Error initializing Advanced RAG client:', error);
      throw error;
    }
  }

  async addDocuments(documents: Document[]) {
    try {
      const docs = documents.map(doc => ({
        text: doc.text,
        metadata: doc.metadata || {},
        id: doc.id
      }));

      await py`self.client.add_documents(${docs})`;
      return { success: true, message: `${documents.length} documents added` };
    } catch (error) {
      console.error('Error adding documents:', error);
      throw error;
    }
  }

  async addDocument(document: Document) {
    return this.addDocuments([document]);
  }

  async query(config: QueryConfig) {
    try {
      const queryConfig = {
        query: config.query,
        top_k: config.topK || this.config.topK,
        similarity_threshold: config.similarityThreshold || this.config.similarityThreshold,
        filters: config.filters || {},
        include_metadata: config.includeMetadata !== false,
        hybrid_search: config.hybridSearch || this.config.hybridRetrieval
      };

      const results = await py`self.client.query(${queryConfig})`;
      return results;
    } catch (error) {
      console.error('Error querying RAG:', error);
      throw error;
    }
  }

  async updateDocument(documentId: string, newText: string, newMetadata?: Record<string, any>) {
    try {
      await py`self.client.update_document(${documentId}, ${newText}, ${newMetadata || {}})`;
      return { success: true, message: 'Document updated successfully' };
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  async deleteDocument(documentId: string) {
    try {
      await py`self.client.delete_document(${documentId})`;
      return { success: true, message: 'Document deleted successfully' };
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  async getDocument(documentId: string) {
    try {
      const document = await py`self.client.get_document(${documentId})`;
      return document;
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  async listDocuments(limit?: number, offset?: number) {
    try {
      const documents = await py`self.client.list_documents(limit=${limit || 100}, offset=${offset || 0})`;
      return documents;
    } catch (error) {
      console.error('Error listing documents:', error);
      throw error;
    }
  }

  async clearIndex() {
    try {
      await py`self.client.clear_index()`;
      return { success: true, message: 'Index cleared successfully' };
    } catch (error) {
      console.error('Error clearing index:', error);
      throw error;
    }
  }

  async getIndexStats() {
    try {
      const stats = await py`self.client.get_index_stats()`;
      return stats;
    } catch (error) {
      console.error('Error getting index stats:', error);
      throw error;
    }
  }
} 