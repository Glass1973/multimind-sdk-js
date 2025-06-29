import { py } from './bridge/multimind-bridge';

export interface ModelConfig {
  name: string;
  config?: Record<string, any>;
}

export async function loadModel(config: ModelConfig) {
  const { name, config: modelConfig = {} } = config;
  
  try {
    const model = await py`load_model(${name}, config=${modelConfig})`;
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    throw error;
  }
}

export async function routeModel(input: string, availableModels?: string[]) {
  try {
    const model = await py`route_model(${input}, available_models=${availableModels || []})`;
    return model;
  } catch (error) {
    console.error('Error routing model:', error);
    throw error;
  }
}

export async function listAvailableModels() {
  try {
    const models = await py`load_model.list_available()`;
    return models;
  } catch (error) {
    console.error('Error listing available models:', error);
    throw error;
  }
} 