import { py } from './bridge/multimind-bridge';

export interface RAGConfig {
  indexPath: string;
  topK?: number;
  similarityThreshold?: number;
}

export async function queryRAG(prompt: string, config: RAGConfig) {
  const { indexPath, topK = 5, similarityThreshold = 0.7 } = config;
  
  try {
    await py`rag = RAGEngine(index_path=${indexPath}, top_k=${topK}, similarity_threshold=${similarityThreshold})`;
    const result = await py`rag.query(${prompt})`;
    return result;
  } catch (error) {
    console.error('Error querying RAG:', error);
    throw error;
  }
}

export async function createRAGEngine(config: RAGConfig) {
  const { indexPath, topK = 5, similarityThreshold = 0.7 } = config;
  
  try {
    await py`rag = RAGEngine(index_path=${indexPath}, top_k=${topK}, similarity_threshold=${similarityThreshold})`;
    return { success: true, message: 'RAG Engine created successfully' };
  } catch (error) {
    console.error('Error creating RAG Engine:', error);
    throw error;
  }
} 