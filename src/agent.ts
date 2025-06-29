import { py } from './bridge/multimind-bridge';

export interface AgentConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function generateWithAgent(prompt: string, config: AgentConfig = {}) {
  const { model = "mistral", temperature = 0.7, maxTokens = 1000 } = config;
  
  try {
    await py`agent = MultiMindAgent(${model}, temperature=${temperature}, max_tokens=${maxTokens})`;
    const result = await py`agent.generate(${prompt})`;
    return result;
  } catch (error) {
    console.error('Error generating with agent:', error);
    throw error;
  }
}

export async function createAgent(config: AgentConfig = {}) {
  const { model = "mistral", temperature = 0.7, maxTokens = 1000 } = config;
  
  try {
    await py`agent = MultiMindAgent(${model}, temperature=${temperature}, max_tokens=${maxTokens})`;
    return { success: true, message: 'Agent created successfully' };
  } catch (error) {
    console.error('Error creating agent:', error);
    throw error;
  }
} 