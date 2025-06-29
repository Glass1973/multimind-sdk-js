import { py } from './bridge/multimind-bridge';

export interface AdvancedFineTuneConfig {
  baseModelName: string;
  outputDir: string;
  method: 'lora' | 'adapter' | 'prefix' | 'unipelt' | 'meta' | 'transfer';
  epochs?: number;
  learningRate?: number;
  batchSize?: number;
  loraConfig?: LoRAConfig;
  adapterConfig?: AdapterConfig;
  prefixConfig?: PrefixConfig;
  metaConfig?: MetaLearningConfig;
  transferConfig?: TransferLearningConfig;
}

export interface LoRAConfig {
  r: number;
  alpha: number;
  dropout: number;
  targetModules?: string[];
}

export interface AdapterConfig {
  adapterType: string;
  adapterSize: number;
  adapterDropout: number;
}

export interface PrefixConfig {
  prefixLength: number;
  prefixDropout: number;
}

export interface MetaLearningConfig {
  innerSteps: number;
  innerLR: number;
  outerLR: number;
  adaptationSteps: number;
}

export interface TransferLearningConfig {
  sourceTask: string;
  targetTask: string;
  freezeLayers: string[];
  transferStrategy: 'feature' | 'parameter' | 'knowledge';
}

export async function advancedFineTune(config: AdvancedFineTuneConfig) {
  const {
    baseModelName,
    outputDir,
    method,
    epochs = 10,
    learningRate = 0.001,
    batchSize = 32,
    loraConfig,
    adapterConfig,
    prefixConfig,
    metaConfig,
    transferConfig
  } = config;

  try {
    let tuner;

    switch (method) {
      case 'lora':
        tuner = await py`LoRATuner(
          base_model_name=${baseModelName},
          output_dir=${outputDir},
          epochs=${epochs},
          learning_rate=${learningRate},
          batch_size=${batchSize},
          r=${loraConfig?.r || 16},
          alpha=${loraConfig?.alpha || 32},
          dropout=${loraConfig?.dropout || 0.1},
          target_modules=${loraConfig?.targetModules || []}
        )`;
        break;

      case 'adapter':
        tuner = await py`AdapterTuner(
          base_model_name=${baseModelName},
          output_dir=${outputDir},
          epochs=${epochs},
          learning_rate=${learningRate},
          batch_size=${batchSize},
          adapter_type=${adapterConfig?.adapterType || 'houlsby'},
          adapter_size=${adapterConfig?.adapterSize || 64},
          adapter_dropout=${adapterConfig?.adapterDropout || 0.1}
        )`;
        break;

      case 'prefix':
        tuner = await py`PrefixTuner(
          base_model_name=${baseModelName},
          output_dir=${outputDir},
          epochs=${epochs},
          learning_rate=${learningRate},
          batch_size=${batchSize},
          prefix_length=${prefixConfig?.prefixLength || 20},
          prefix_dropout=${prefixConfig?.prefixDropout || 0.1}
        )`;
        break;

      case 'unipelt':
        tuner = await py`UniPELTPlusTuner(
          base_model_name=${baseModelName},
          output_dir=${outputDir},
          epochs=${epochs},
          learning_rate=${learningRate},
          batch_size=${batchSize},
          available_methods=['lora', 'adapter', 'prefix']
        )`;
        break;

      case 'meta':
        tuner = await py`MetaLearningOptimizer(
          base_model_name=${baseModelName},
          output_dir=${outputDir},
          epochs=${epochs},
          learning_rate=${learningRate},
          batch_size=${batchSize},
          inner_steps=${metaConfig?.innerSteps || 5},
          inner_lr=${metaConfig?.innerLR || 0.01},
          outer_lr=${metaConfig?.outerLR || 0.001},
          adaptation_steps=${metaConfig?.adaptationSteps || 3}
        )`;
        break;

      case 'transfer':
        tuner = await py`TransferLearningOptimizer(
          base_model_name=${baseModelName},
          output_dir=${outputDir},
          epochs=${epochs},
          learning_rate=${learningRate},
          batch_size=${batchSize},
          source_task=${transferConfig?.sourceTask || 'general'},
          target_task=${transferConfig?.targetTask || 'specific'},
          freeze_layers=${transferConfig?.freezeLayers || []},
          transfer_strategy=${transferConfig?.transferStrategy || 'parameter'}
        )`;
        break;

      default:
        throw new Error(`Unsupported fine-tuning method: ${method}`);
    }

    const result = await py`tuner.train()`;
    return result;
  } catch (error) {
    console.error('Error during advanced fine-tuning:', error);
    throw error;
  }
}

export async function createAdvancedTuner(config: AdvancedFineTuneConfig) {
  try {
    const tuner = await advancedFineTune(config);
    return { success: true, message: 'Advanced tuner created successfully', tuner };
  } catch (error) {
    console.error('Error creating advanced tuner:', error);
    throw error;
  }
} 