import { py } from './bridge/multimind-bridge';

export interface FineTuneConfig {
  configPath: string;
  epochs?: number;
  learningRate?: number;
  batchSize?: number;
}

export async function fineTuneModel(config: FineTuneConfig) {
  const { configPath, epochs = 10, learningRate = 0.001, batchSize = 32 } = config;
  
  try {
    await py`tuner = FineTuner(config_path=${configPath}, epochs=${epochs}, learning_rate=${learningRate}, batch_size=${batchSize})`;
    const result = await py`tuner.train()`;
    return result;
  } catch (error) {
    console.error('Error during fine-tuning:', error);
    throw error;
  }
}

export async function createFineTuner(config: FineTuneConfig) {
  const { configPath, epochs = 10, learningRate = 0.001, batchSize = 32 } = config;
  
  try {
    await py`tuner = FineTuner(config_path=${configPath}, epochs=${epochs}, learning_rate=${learningRate}, batch_size=${batchSize})`;
    return { success: true, message: 'FineTuner created successfully' };
  } catch (error) {
    console.error('Error creating FineTuner:', error);
    throw error;
  }
} 