# MultiMind SDK for JavaScript/TypeScript

A comprehensive AI development toolkit that unifies fine-tuning, RAG, and agent orchestration, providing full feature parity with the Python MultiMind SDK.

## 🚀 Features

- **🤖 Agent Orchestration**: Create and manage AI agents with advanced capabilities
- **🎯 Advanced Fine-tuning**: LoRA, Adapters, Prefix Tuning, and Meta-learning
- **📚 Advanced RAG**: Document processing, vector storage, and hybrid retrieval
- **🔄 Model Conversion**: PyTorch to ONNX, TensorFlow to TFLite, and more
- **🔒 Compliance Monitoring**: GDPR, HIPAA, and privacy compliance tools
- **🧠 Model Client System**: LSTM, MoE, and MultiModal clients
- **🌐 Gateway API**: RESTful API server with middleware support
- **📋 Context Transfer**: Transfer conversations between different LLM providers
- **📊 Model Evaluation**: Comprehensive model comparison and benchmarking

## 📦 Installation

```bash
npm install multimind-sdk-js
```

## 🛠️ Quick Start

### Basic Usage

```typescript
import { MultiMindSDK } from 'multimind-sdk-js';

const sdk = new MultiMindSDK();

// Initialize the SDK
await sdk.initialize();

// Generate with an agent
const response = await sdk.generateWithAgent(
  "Explain quantum computing in simple terms",
  { model: "gpt-3.5-turbo", temperature: 0.7, maxTokens: 200 }
);

console.log(response);

// Close the SDK
await sdk.close();
```

### Advanced Fine-tuning

```typescript
const fineTuneResult = await sdk.advancedFineTune({
  baseModelName: "bert-base-uncased",
  outputDir: "./output/finetune",
  method: "lora",
  epochs: 3,
  learningRate: 0.001,
  batchSize: 16,
  loraConfig: {
    r: 16,
    alpha: 32,
    dropout: 0.1,
    targetModules: ["query", "value"]
  }
});
```

### Advanced RAG System

```typescript
// Add documents to RAG
const documents = [
  {
    text: "MultiMind SDK is a comprehensive AI development toolkit.",
    metadata: { type: "introduction", source: "docs" }
  }
];

await sdk.addDocumentsToRAG(documents);

// Query the RAG system
const ragResponse = await sdk.queryAdvancedRAG({
  query: "What is MultiMind SDK?",
  topK: 3,
  includeMetadata: true
});
```

## 🖥️ Command Line Interface (CLI)

The MultiMind SDK includes a powerful CLI for context transfer operations:

### Installation

```bash
npm install -g multimind-sdk-js
```

### Basic CLI Usage

```bash
# Transfer context from ChatGPT to Claude
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

## 📚 Examples

### Run Examples

```bash
# Run comprehensive demo
npm run demo

# Run agent example
npm run example:agent

# Run advanced usage example
npm run example:advanced

# Run CLI directly
npm run cli -- --help
```

### Example Scripts

The SDK includes several example scripts in the `example/` directory:

- **`comprehensive-demo.ts`**: Full feature demonstration
- **`run-agent.ts`**: Basic agent usage
- **`advanced-usage.ts`**: Advanced features showcase
- **`context-transfer-cli.ts`**: CLI implementation

## 🔧 Development

### Prerequisites

- Node.js 18+ 
- TypeScript 5+
- Python 3.8+ (for bridge functionality)

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd multimind-sdk-js

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
npm run sync-features      # Sync with Python SDK features
npm run cli                # Run CLI
npm run demo               # Run comprehensive demo
```

## 🏗️ Architecture

The SDK is built with a modular architecture:

- **Core Modules**: Agent, Fine-tuning, RAG, Adapters, Evaluation, Models
- **Advanced Modules**: Advanced Fine-tuning, Advanced RAG, Model Conversion, Compliance
- **Bridge System**: Python bridge for seamless integration with Python SDK
- **CLI Interface**: Command-line tools for context transfer operations
- **TypeScript Support**: Full type definitions and IntelliSense support

## 🔗 Integration

### Python Bridge

The SDK uses a Python bridge to leverage the full capabilities of the Python MultiMind SDK:

```typescript
import { initBridge, py } from 'multimind-sdk-js';

await initBridge();

// Execute Python code
const result = await py`from multimind_sdk import MultiMindAgent`;
```

### Model Support

Supports all major LLM providers:
- OpenAI (GPT-3.5, GPT-4)
- Anthropic (Claude)
- Google (Gemini)
- DeepSeek
- Mistral
- And many more...

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

MIT License - see [LICENSE](LICENSE) file for details.

## 🔄 Feature Parity

This JavaScript/TypeScript SDK maintains full feature parity with the Python MultiMind SDK. Use the sync script to check for any missing features:

```bash
npm run sync-features
```

## 📞 Support

- **Documentation**: [GitHub Wiki](https://github.com/your-org/multimind-sdk-js/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-org/multimind-sdk-js/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/multimind-sdk-js/discussions)

## 🚀 Roadmap

- [ ] WebAssembly support for edge computing
- [ ] React/Vue.js components
- [ ] Deno runtime support
- [ ] Cloud deployment templates
- [ ] Advanced monitoring and analytics

---

**Built with ❤️ by the MultiMind Team**
