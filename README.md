# MultiMind SDK JavaScript/TypeScript

A comprehensive JavaScript/TypeScript SDK that provides a bridge to the Python MultiMind SDK, enabling seamless integration of MultiMind's advanced AI capabilities in Node.js and browser environments.

## 🚀 Features

### Core Features
- 🤖 **Agent Generation**: Generate responses using various AI models
- 🎯 **Fine-tuning**: Fine-tune models with custom configurations
- 🔍 **RAG (Retrieval-Augmented Generation)**: Query knowledge bases with context
- 🔧 **Adapter Management**: Load and manage model adapters
- 📊 **Model Evaluation**: Evaluate model performance on various tasks
- 🚀 **Model Routing**: Automatically route requests to the best model

### Advanced Features
- 🧠 **Advanced Fine-tuning**: LoRA, Adapters, Prefix Tuning, Meta-Learning, Transfer Learning
- 📚 **Advanced RAG**: Document processing, metadata management, hybrid retrieval, vector storage
- 🛠️ **Advanced Agents**: Tool integration, memory management, task orchestration, workflow management
- 🔄 **Model Conversion**: PyTorch, TensorFlow, ONNX, GGUF, TFLite, Safetensors with optimization
- 🔒 **Compliance Monitoring**: Real-time monitoring, privacy protection, audit trails, GDPR/HIPAA compliance
- 🧠 **Model Client System**: LSTM, MoE (Mixture of Experts), MultiModal, Federated routing
- 🌐 **Gateway API**: RESTful API with middleware, authentication, rate limiting
- 📦 **TypeScript Support**: Full TypeScript definitions included

## 📦 Installation

```bash
npm install multimind-sdk-js
```

## Prerequisites

1. **Python 3.8+** installed on your system
2. **MultiMind Python SDK** installed:
   ```bash
   pip install multimind-sdk
   ```

## 🚀 Quick Start

### Basic Usage

```typescript
import MultiMindSDK from 'multimind-sdk-js';

async function main() {
  const sdk = new MultiMindSDK();
  
  try {
    await sdk.initialize();
    
    // Generate a response
    const response = await sdk.generateWithAgent(
      "What is artificial intelligence?",
      { model: "mistral", temperature: 0.7 }
    );
    
    console.log(response);
  } finally {
    await sdk.close();
  }
}

main();
```

### Advanced Usage

```typescript
import MultiMindSDK from 'multimind-sdk-js';

const sdk = new MultiMindSDK();

// Advanced Fine-tuning with LoRA
const fineTuneResult = await sdk.advancedFineTune({
  baseModelName: "bert-base-uncased",
  outputDir: "./output",
  method: "lora",
  epochs: 10,
  learningRate: 0.001,
  batchSize: 32,
  loraConfig: {
    r: 16,
    alpha: 32,
    dropout: 0.1,
    targetModules: ["query", "value"]
  }
});

// Advanced RAG with Document Management
const documents = [
  {
    text: "MultiMind SDK provides comprehensive AI capabilities.",
    metadata: { type: "introduction", source: "docs" }
  }
];

await sdk.addDocumentsToRAG(documents);
const ragResponse = await sdk.queryAdvancedRAG({
  query: "What is MultiMind SDK?",
  topK: 5,
  includeMetadata: true
});

// Model Conversion
const conversionResult = await sdk.pytorchToONNX(
  "./models/model.pt",
  "./models/model.onnx",
  {
    quantization: { method: "int8", targetDevice: "cpu" },
    graphOptimization: { fuseOperations: true, optimizeMemory: true }
  }
);

// Compliance Monitoring
const complianceResult = await sdk.checkCompliance({
  modelId: "model_123",
  dataCategories: ["text", "user_data"],
  useCase: "customer_support",
  region: "EU"
});

// Advanced Agent with Tools
const agentResponse = await sdk.runAdvancedAgent(
  "Calculate 15 * 23 and search for quantum computing information",
  { context: "mathematical and scientific inquiry" }
);

// Model Client System
const lstmClient = await sdk.createLSTMModelClient({
  modelPath: "./models/lstm.pt",
  modelName: "custom_lstm"
});

const moeClient = await sdk.createMoEModelClient({
  experts: {
    "expert1": { modelName: "gpt-3.5-turbo" },
    "expert2": { modelName: "claude-3" }
  },
  router: (input: string) => input.length > 100 ? "expert2" : "expert1"
});

// Gateway API
const gateway = await sdk.startGateway({
  host: "0.0.0.0",
  port: 8000,
  enableMiddleware: true,
  corsEnabled: true,
  rateLimit: 100
});
```

## 📚 API Reference

### MultiMindSDK Class

The main SDK class that provides a unified interface to all MultiMind functionality.

#### Basic Methods

##### Agent Methods
- `generateWithAgent(prompt: string, config?: AgentConfig)`: Generate responses using AI agents
- `createAgent(config?: AgentConfig)`: Create a new agent instance

##### Fine-tuning Methods
- `fineTuneModel(config: FineTuneConfig)`: Fine-tune a model
- `createFineTuner(config: FineTuneConfig)`: Create a fine-tuner instance

##### RAG Methods
- `queryRAG(prompt: string, config: RAGConfig)`: Query a RAG system
- `createRAGEngine(config: RAGConfig)`: Create a RAG engine instance

##### Adapter Methods
- `loadAdapter(config: AdapterConfig)`: Load a model adapter
- `listAdapters(model: string)`: List available adapters for a model
- `removeAdapter(model: string, adapterPath: string)`: Remove an adapter

##### Evaluation Methods
- `evaluateModel(config: EvaluationConfig)`: Evaluate a model
- `compareModels(models: string[], task: string, dataset?: string)`: Compare multiple models

##### Model Methods
- `loadModel(config: ModelConfig)`: Load a model
- `routeModel(input: string, availableModels?: string[])`: Route to the best model
- `listAvailableModels()`: List all available models

#### Advanced Methods

##### Advanced Fine-tuning
- `advancedFineTune(config: AdvancedFineTuneConfig)`: Advanced fine-tuning with LoRA, Adapters, etc.
- `createAdvancedTuner(config: AdvancedFineTuneConfig)`: Create advanced tuner

##### Advanced RAG
- `createAdvancedRAG(config?: AdvancedRAGConfig)`: Create advanced RAG client
- `addDocumentsToRAG(documents: Document[])`: Add documents to RAG
- `queryAdvancedRAG(config: QueryConfig)`: Query advanced RAG system

##### Model Conversion
- `createModelConverter()`: Create model converter
- `convertModel(config: ConversionConfig)`: Convert model between formats
- `pytorchToONNX(inputPath: string, outputPath: string, config?)`: Convert PyTorch to ONNX
- `tensorflowToTFLite(inputPath: string, outputPath: string, config?)`: Convert TensorFlow to TFLite
- `pytorchToGGUF(inputPath: string, outputPath: string, config?)`: Convert PyTorch to GGUF

##### Compliance
- `createComplianceMonitor(config: ComplianceConfig)`: Create compliance monitor
- `checkCompliance(check: ComplianceCheck)`: Check compliance

##### Advanced Agents
- `createAdvancedAgent(config: AdvancedAgentConfig)`: Create advanced agent
- `runAdvancedAgent(input: string, context?)`: Run advanced agent with tools

##### Model Client System
- `createLSTMModelClient(config: ModelClientConfig)`: Create LSTM model client
- `createMoEModelClient(config: MoEConfig)`: Create MoE model client
- `createMultiModalClient(config: MultiModalConfig)`: Create MultiModal client
- `createFederatedRouter(config: FederatedConfig)`: Create federated router

##### Gateway
- `createGateway(config?: GatewayConfig)`: Create gateway
- `startGateway(config?: GatewayConfig)`: Start gateway API
- `stopGateway()`: Stop gateway

#### Utility Methods
- `getSDKInfo()`: Get SDK information
- `healthCheck()`: Check SDK health
- `initialize()`: Initialize SDK
- `close()`: Close SDK

### Configuration Interfaces

#### AdvancedFineTuneConfig
```typescript
interface AdvancedFineTuneConfig {
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
```

#### AdvancedRAGConfig
```typescript
interface AdvancedRAGConfig {
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
```

#### ConversionConfig
```typescript
interface ConversionConfig {
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
```

#### ComplianceConfig
```typescript
interface ComplianceConfig {
  organizationId: string;
  enabledRegulations: string[];
  privacyLevel: 'basic' | 'enhanced' | 'enterprise';
  auditEnabled: boolean;
  realTimeMonitoring: boolean;
  alertThresholds?: AlertThresholds;
}
```

#### AdvancedAgentConfig
```typescript
interface AdvancedAgentConfig {
  name: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  memoryCapacity?: number;
  tools?: Tool[];
  workflow?: WorkflowStep[];
}
```

## 📖 Examples

### Running Examples

```bash
# Basic agent example
npm run dev

# Advanced usage example
npx ts-node example/advanced-usage.ts

# Comprehensive demo
npx ts-node example/comprehensive-demo.ts
```

### Example Files

- `example/run-agent.ts`: Basic agent generation example
- `example/advanced-usage.ts`: Advanced features example
- `example/comprehensive-demo.ts`: Complete feature demonstration

## 🛠️ Development

### Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev
```

### Project Structure

```
multimind-sdk-js/
├── src/
│   ├── bridge/
│   │   └── multimind-bridge.ts    # Python bridge setup
│   ├── agent.ts                   # Basic agent functionality
│   ├── fineTune.ts               # Basic fine-tuning functionality
│   ├── rag.ts                    # Basic RAG functionality
│   ├── adapters.ts               # Adapter management
│   ├── evaluation.ts             # Model evaluation
│   ├── models.ts                 # Model loading and routing
│   ├── advancedFineTuning.ts     # Advanced fine-tuning (LoRA, Adapters, etc.)
│   ├── advancedRAG.ts            # Advanced RAG with document management
│   ├── modelConversion.ts        # Model conversion and optimization
│   ├── compliance.ts             # Compliance monitoring and validation
│   ├── advancedAgent.ts          # Advanced agents with tools and memory
│   ├── modelClientSystem.ts      # LSTM, MoE, MultiModal, Federated routing
│   ├── gateway.ts                # Gateway API and middleware
│   └── index.ts                  # Main SDK class and exports
├── example/
│   ├── run-agent.ts              # Basic example
│   ├── advanced-usage.ts         # Advanced example
│   └── comprehensive-demo.ts     # Complete feature demo
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Error Handling

The SDK includes comprehensive error handling. All methods throw errors with descriptive messages when operations fail:

```typescript
try {
  const response = await sdk.generateWithAgent("Hello world");
} catch (error) {
  console.error('Generation failed:', error.message);
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Python not found**: Ensure Python 3.8+ is installed and accessible via `python3`
2. **MultiMind SDK not installed**: Install the Python SDK with `pip install multimind-sdk`
3. **Bridge initialization failed**: Check that all required Python modules are available
4. **Memory issues**: For large models, ensure sufficient RAM and consider using quantization
5. **GPU issues**: Ensure CUDA is properly installed for GPU acceleration

### Debug Mode

Enable debug logging by setting the environment variable:
```bash
DEBUG=multimind-sdk npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Ensure you have the latest version installed
- Review the comprehensive examples

## 🔗 Related Links

- [MultiMind Python SDK](https://github.com/multimindlab/multimind-sdk)
- [MultiMind Documentation](https://multimind.dev)
- [MultiMind Discord Community](https://discord.gg/multimind)
