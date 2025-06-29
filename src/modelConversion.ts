import { py } from './bridge/multimind-bridge';

export interface ConversionConfig {
  inputPath: string;
  outputPath: string;
  inputFormat: 'pytorch' | 'tensorflow' | 'onnx' | 'gguf' | 'tflite' | 'safetensors';
  outputFormat: 'pytorch' | 'tensorflow' | 'onnx' | 'gguf' | 'tflite' | 'safetensors';
  modelType?: string;
  quantization?: QuantizationConfig;
  pruning?: PruningConfig;
  graphOptimization?: GraphOptimizationConfig;
  validation?: boolean;
}

export interface QuantizationConfig {
  method: 'int8' | 'int16' | 'fp16' | 'dynamic' | 'static';
  calibrationData?: string;
  targetDevice?: 'cpu' | 'gpu' | 'mobile';
}

export interface PruningConfig {
  method: 'magnitude' | 'structured' | 'unstructured';
  sparsity: number;
  targetLayers?: string[];
}

export interface GraphOptimizationConfig {
  fuseOperations: boolean;
  removeUnusedNodes: boolean;
  optimizeMemory: boolean;
}

export class ModelConverter {
  private converters: Record<string, any> = {};

  async initialize() {
    try {
      // Initialize converters
      this.converters.pytorch = await py`PyTorchConverter()`;
      this.converters.tensorflow = await py`TensorFlowConverter()`;
      this.converters.onnx = await py`ONNXConverter()`;
      this.converters.ollama = await py`OllamaConverter()`;
      
      // Initialize optimizers
      this.converters.quantization = await py`QuantizationOptimizer()`;
      this.converters.pruning = await py`PruningOptimizer()`;
      this.converters.graph = await py`GraphOptimizer()`;

      return { success: true, message: 'Model converters initialized' };
    } catch (error) {
      console.error('Error initializing model converters:', error);
      throw error;
    }
  }

  async convert(config: ConversionConfig) {
    try {
      const {
        inputPath,
        outputPath,
        inputFormat,
        outputFormat,
        modelType,
        quantization,
        pruning,
        graphOptimization,
        validation = true
      } = config;

      // Get appropriate converter
      const converter = this.converters[inputFormat];
      if (!converter) {
        throw new Error(`Unsupported input format: ${inputFormat}`);
      }

      // Perform conversion
      let convertedModel = await py`converter.convert(
        input_path=${inputPath},
        output_path=${outputPath},
        input_format=${inputFormat},
        output_format=${outputFormat},
        model_type=${modelType || 'auto'},
        validation=${validation}
      )`;

      // Apply optimizations if specified
      if (quantization) {
        convertedModel = await this.applyQuantization(convertedModel, quantization);
      }

      if (pruning) {
        convertedModel = await this.applyPruning(convertedModel, pruning);
      }

      if (graphOptimization) {
        convertedModel = await this.applyGraphOptimization(convertedModel, graphOptimization);
      }

      return {
        success: true,
        message: `Model converted from ${inputFormat} to ${outputFormat}`,
        outputPath,
        model: convertedModel
      };
    } catch (error) {
      console.error('Error during model conversion:', error);
      throw error;
    }
  }

  private async applyQuantization(model: any, config: QuantizationConfig) {
    try {
      const optimizer = this.converters.quantization;
      return await py`optimizer.optimize(
        model=${model},
        method=${config.method},
        calibration_data=${config.calibrationData || null},
        target_device=${config.targetDevice || 'cpu'}
      )`;
    } catch (error) {
      console.error('Error applying quantization:', error);
      throw error;
    }
  }

  private async applyPruning(model: any, config: PruningConfig) {
    try {
      const optimizer = this.converters.pruning;
      return await py`optimizer.optimize(
        model=${model},
        method=${config.method},
        sparsity=${config.sparsity},
        target_layers=${config.targetLayers || []}
      )`;
    } catch (error) {
      console.error('Error applying pruning:', error);
      throw error;
    }
  }

  private async applyGraphOptimization(model: any, config: GraphOptimizationConfig) {
    try {
      const optimizer = this.converters.graph;
      return await py`optimizer.optimize(
        model=${model},
        fuse_operations=${config.fuseOperations},
        remove_unused_nodes=${config.removeUnusedNodes},
        optimize_memory=${config.optimizeMemory}
      )`;
    } catch (error) {
      console.error('Error applying graph optimization:', error);
      throw error;
    }
  }

  async validateModel(modelPath: string, format: string) {
    try {
      const converter = this.converters[format];
      const validation = await py`converter.validate(${modelPath})`;
      return validation;
    } catch (error) {
      console.error('Error validating model:', error);
      throw error;
    }
  }

  async getModelInfo(modelPath: string, format: string) {
    try {
      const converter = this.converters[format];
      const info = await py`converter.get_model_info(${modelPath})`;
      return info;
    } catch (error) {
      console.error('Error getting model info:', error);
      throw error;
    }
  }

  async batchConvert(configs: ConversionConfig[]) {
    try {
      const results = [];
      for (const config of configs) {
        const result = await this.convert(config);
        results.push(result);
      }
      return results;
    } catch (error) {
      console.error('Error during batch conversion:', error);
      throw error;
    }
  }
}

// Convenience functions for common conversions
export async function pytorchToONNX(inputPath: string, outputPath: string, config?: Partial<ConversionConfig>) {
  const converter = new ModelConverter();
  await converter.initialize();
  return converter.convert({
    inputPath,
    outputPath,
    inputFormat: 'pytorch',
    outputFormat: 'onnx',
    ...config
  });
}

export async function tensorflowToTFLite(inputPath: string, outputPath: string, config?: Partial<ConversionConfig>) {
  const converter = new ModelConverter();
  await converter.initialize();
  return converter.convert({
    inputPath,
    outputPath,
    inputFormat: 'tensorflow',
    outputFormat: 'tflite',
    ...config
  });
}

export async function pytorchToGGUF(inputPath: string, outputPath: string, config?: Partial<ConversionConfig>) {
  const converter = new ModelConverter();
  await converter.initialize();
  return converter.convert({
    inputPath,
    outputPath,
    inputFormat: 'pytorch',
    outputFormat: 'gguf',
    ...config
  });
} 