import { py } from './bridge/multimind-bridge';

export interface EvaluationConfig {
  model: string;
  task: string;
  dataset?: string;
  metrics?: string[];
}

export async function evaluateModel(config: EvaluationConfig) {
  const { model, task, dataset = 'default', metrics = ['accuracy', 'f1'] } = config;
  
  try {
    const result = await py`evaluate(${model}, ${task}, dataset=${dataset}, metrics=${metrics})`;
    return result;
  } catch (error) {
    console.error('Error evaluating model:', error);
    throw error;
  }
}

export async function compareModels(models: string[], task: string, dataset?: string) {
  try {
    const result = await py`evaluate.compare_models(${models}, ${task}, dataset=${dataset || 'default'})`;
    return result;
  } catch (error) {
    console.error('Error comparing models:', error);
    throw error;
  }
} 