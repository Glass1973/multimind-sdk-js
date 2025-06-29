# MultiMind SDK for JavaScript/TypeScript

[![npm](https://img.shields.io/npm/v/multimind-sdk.svg)](https://www.npmjs.com/package/multimind-sdk)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

This SDK gives JavaScript/TypeScript developers full access to advanced AI features like agent orchestration, RAG, and fine-tuning — without needing to manage backend code.

## 🚀 What This SDK Does

The MultiMind SDK provides a comprehensive JavaScript/TypeScript interface for advanced AI capabilities:

- **🤖 AI Agent Orchestration**: Create intelligent agents that can reason, plan, and execute complex tasks
- **🔍 RAG (Retrieval-Augmented Generation)**: Build knowledge systems that combine your data with AI reasoning
- **🎯 Model Fine-tuning**: Customize AI models for your specific use cases and domains
- **🔄 Model Routing**: Automatically select the best AI model for each task
- **📊 Model Evaluation**: Assess and compare AI model performance
- **🔧 Adapter Management**: Enhance models with specialized capabilities
- **🛠️ Advanced Workflows**: LoRA fine-tuning, document processing, compliance monitoring, and more

## 📦 Installation

```bash
npm install multimind-sdk
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { MultiMindSDK } from 'multimind-sdk';

async function main() {
  const sdk = new MultiMindSDK();
  
  try {
    await sdk.initialize();
    
    // Generate a response with an AI agent
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
import { MultiMindSDK } from 'multimind-sdk';

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

## 🤖 Models and Agents

### Supported AI Models
- **OpenAI Models**: GPT-3.5, GPT-4, GPT-4 Turbo
- **Anthropic Models**: Claude-2, Claude-3, Claude-3.5 Sonnet
- **Open Source Models**: Mistral, Llama, BERT, and many more
- **Custom Models**: Load and use your own fine-tuned models

### Agent Types
- **Basic Agents**: Simple question-answering and text generation
- **Advanced Agents**: Multi-step reasoning, tool usage, and memory
- **Specialized Agents**: Code generation, data analysis, creative writing
- **Custom Agents**: Build agents tailored to your specific domain

### RAG Capabilities
- **Document Processing**: PDF, DOCX, TXT, and more
- **Vector Storage**: Efficient similarity search
- **Knowledge Graphs**: Structured information retrieval
- **Hybrid Search**: Combine semantic and keyword search

## 🖥️ Command Line Interface (CLI)

The MultiMind SDK includes a powerful CLI for automation and batch operations:

### Installation

```bash
npm install -g multimind-sdk
```

### Basic CLI Usage

```bash
# Transfer context between different AI models
multimind-cli --source chatgpt --target claude --input conversation.json --output prompt.txt

# List supported models
multimind-cli --list-models

# Run batch transfer operations
multimind-cli --batch

# Generate Chrome extension configuration
multimind-cli --chrome-config
```

### CLI Options

```bash
# Basic Transfer
--source, -s <model>           Source model name (e.g., chatgpt, claude)
--target, -t <model>           Target model name (e.g., deepseek, gemini)
--input, -i <file>             Input conversation file (JSON, TXT, MD)
--output, -o <file>            Output formatted prompt file

# Transfer Options
--last-n <number>              Number of recent messages to extract (default: 5)
--summary-type <type>          Summary type: concise, detailed, structured
--output-format <format>       Output format: txt, json, markdown
--no-smart-extraction          Disable smart context extraction
--no-metadata                  Exclude metadata from output

# Model-Specific Options
--include-code                 Include code context (for coding models)
--include-reasoning            Include reasoning capabilities
--include-safety               Include safety considerations
--include-creativity           Include creative capabilities
--include-examples             Include example generation
--include-step-by-step         Include step-by-step explanations
--include-multimodal           Include multimodal capabilities
--include-web-search           Include web search capabilities

# Advanced Features
--batch                        Run batch transfer operations
--validate                     Validate conversation format
--list-models                  List all supported models
--chrome-config                Generate Chrome extension configuration
--help, -h                     Show help message
```

### CLI Examples

```bash
# Basic transfer from ChatGPT to Claude
multimind-cli --source chatgpt --target claude --input conversation.json --output prompt.txt

# Advanced transfer with custom options
multimind-cli --source gpt-4 --target deepseek --input chat.txt --output formatted.md \
  --summary-type detailed --include-code --include-reasoning

# Batch transfer with validation
multimind-cli --batch --validate

# Generate Chrome extension config
multimind-cli --chrome-config
```

## 🔧 Automation Potential

### Node.js Scripts
```typescript
// Automated content generation
const sdk = new MultiMindSDK();
await sdk.initialize();

// Generate blog posts from outlines
const outline = "AI trends in 2024";
const blogPost = await sdk.generateWithAgent(
  `Write a comprehensive blog post about: ${outline}`,
  { model: "gpt-4", temperature: 0.7 }
);

// Automated customer support
const customerQuery = "How do I reset my password?";
const response = await sdk.queryAdvancedRAG({
  query: customerQuery,
  topK: 3,
  includeMetadata: true
});
```

### CI/CD Integration
```yaml
# GitHub Actions example
- name: Generate Documentation
  run: |
    npm install multimind-sdk
    node scripts/generate-docs.js
```

### Batch Processing
```typescript
// Process multiple documents
const documents = await loadDocuments('./data/');
const results = [];

for (const doc of documents) {
  const summary = await sdk.generateWithAgent(
    `Summarize this document: ${doc.content}`,
    { model: "claude-3" }
  );
  results.push({ id: doc.id, summary });
}
```

## 📚 Examples

### Running Examples

```bash
# Basic agent example
npm run example:agent

# Advanced usage example
npm run example:advanced

# Comprehensive demo
npm run demo

# CLI directly
npm run cli -- --help
```

### Example Files

- `example/run-agent.ts`: Basic agent generation example
- `example/advanced-usage.ts`: Advanced features example
- `example/comprehensive-demo.ts`: Complete feature demonstration
- `example/context-transfer-cli.ts`: CLI implementation

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

##### Context Transfer
- `transferContext(sourceModel: string, targetModel: string, conversationData: ConversationMessage[], options?: TransferOptions)`: Transfer context between models
- `quickTransfer(sourceModel: string, targetModel: string, conversationData: ConversationMessage[], options?: Record<string, any>)`: Quick context transfer
- `getSupportedModels()`: Get supported models for context transfer
- `validateConversationFormat(data: ConversationMessage[])`: Validate conversation format
- `batchTransfer(transfers: Array<{sourceModel: string, targetModel: string, conversationData: ConversationMessage[], options?: TransferOptions}>)`: Batch context transfer
- `createChromeExtensionConfig()`: Create Chrome extension configuration

#### Utility Methods
- `getSDKInfo()`: Get SDK information
- `healthCheck()`: Check SDK health
- `initialize()`: Initialize SDK
- `close()`: Close SDK

## 🛠️ Development

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd multimind-sdk

# Install dependencies
npm install

# Build the project
npm run build:examples

# Run tests
npm test

# Run linting
npm run lint
```

### Available Scripts

```bash
npm run build              # Build TypeScript to JavaScript
npm run build:examples     # Build with example fixes
npm run test               # Run test suite
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage
npm run lint               # Run ESLint
npm run lint:fix           # Fix linting issues
npm run sync-features      # Sync with backend features
npm run cli                # Run CLI
npm run demo               # Run comprehensive demo
```

### Project Structure

```
multimind-sdk/
├── src/
│   ├── bridge/
│   │   └── multimind-bridge.ts    # Backend bridge setup
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
│   ├── contextTransfer.ts        # Context transfer functionality
│   └── index.ts                  # Main SDK class and exports
├── example/
│   ├── run-agent.ts              # Basic example
│   ├── advanced-usage.ts         # Advanced example
│   ├── comprehensive-demo.ts     # Complete feature demo
│   └── context-transfer-cli.ts   # CLI implementation
├── test/
│   ├── sdk-smoke.test.ts         # Basic SDK tests
│   ├── module-tests.test.ts      # Module functionality tests
│   └── cli.test.ts               # CLI tests
├── scripts/
│   ├── fix-example-imports.js    # Fix example import paths
│   ├── fix-all-imports.js        # Fix all import paths
│   └── sync-features.js          # Sync with backend features
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

1. **Initialization failed**: Ensure all required dependencies are installed
2. **Model loading issues**: Check that model files are accessible and valid
3. **Memory issues**: For large models, ensure sufficient RAM and consider using quantization
4. **GPU issues**: Ensure CUDA is properly installed for GPU acceleration
5. **Network issues**: Check internet connectivity for cloud-based models

### Debug Mode

Enable debug logging by setting the environment variable:

```bash
DEBUG=multimind-sdk npm run dev
```

## 📊 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- test/sdk-smoke.test.ts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

Apache License 2.0 - see [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Ensure you have the latest version installed
- Review the comprehensive examples

## 🔗 Related Links

- [MultiMind Documentation](https://multimind.dev)
- [MultiMind Discord Community](https://discord.gg/multimind)

---

**Built with ❤️ by the MultiMind Team**
