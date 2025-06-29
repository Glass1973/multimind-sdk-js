import { pythonBridge } from 'python-bridge';

export const py = pythonBridge({ python: 'python3' });

export async function initBridge() {
  try {
    // Core imports
    await py.ex`
      from multimind_sdk.agent import MultiMindAgent
      from multimind_sdk.finetune import FineTuner
      from multimind_sdk.rag import RAGEngine
      from multimind_sdk.adapters import AdapterLoader
      from multimind_sdk.evaluation import evaluate
      from multimind_sdk.model_loader import load_model
      from multimind_sdk.model_router import route_model
    `;

    // Advanced client imports
    await py.ex`
      from multimind.client.rag_client import RAGClient, Document
      from multimind.client.model_client import LSTMModelClient, MoEModelClient, MultiModalClient
      from multimind.client.federated_router import FederatedRouter
      from multimind.client.agent_client import AgentClient
      from multimind.client.compliance_client import ComplianceClient
    `;

    // Fine-tuning imports
    await py.ex`
      from multimind.fine_tuning import UniPELTPlusTuner
      from multimind.fine_tuning.methods import LoRATuner, AdapterTuner, PrefixTuner
      from multimind.fine_tuning.optimizers import MetaLearningOptimizer, TransferLearningOptimizer
    `;

    // Model conversion imports
    await py.ex`
      from multimind.model_conversion.converters.pytorch import PyTorchConverter
      from multimind.model_conversion.converters.tensorflow import TensorFlowConverter
      from multimind.model_conversion.converters.onnx import ONNXConverter
      from multimind.model_conversion.converters.ollama import OllamaConverter
      from multimind.model_conversion.optimizers.quantization import QuantizationOptimizer
      from multimind.model_conversion.optimizers.pruning import PruningOptimizer
      from multimind.model_conversion.optimizers.graph import GraphOptimizer
    `;

    // Context transfer imports
    await py.ex`
      from multimind.context_transfer import ContextTransferManager, ContextTransferAPI
      from multimind.context_transfer.adapters import AdapterFactory, ModelAdapter
      from multimind.context_transfer.adapters import DeepSeekAdapter, ClaudeAdapter, ChatGPTAdapter
      from multimind.context_transfer.adapters import GeminiAdapter, MistralAdapter, LlamaAdapter
      from multimind.context_transfer.adapters import CohereAdapter, AnthropicClaudeAdapter, OpenAIGPT4Adapter
    `;

    // Compliance imports
    await py.ex`
      from multimind.compliance.monitors import GDPRMonitor, HIPAAMonitor, ComplianceMonitor
      from multimind.compliance.validators import DataValidator, PrivacyValidator
      from multimind.compliance.reporting import ComplianceReporter
    `;

    // Advanced RAG imports
    await py.ex`
      from multimind.rag.advanced import AdvancedRAGEngine
      from multimind.rag.document_manager import DocumentManager
      from multimind.rag.hybrid_retrieval import HybridRetrieval
    `;

    // Advanced agent imports
    await py.ex`
      from multimind.agents.advanced import AdvancedAgent
      from multimind.agents.tools import ToolRegistry, built_in_tools
      from multimind.agents.memory import MemoryManager
    `;

    console.log('MultiMind SDK bridge initialized successfully with all advanced features');
  } catch (error) {
    console.error('Failed to initialize MultiMind SDK bridge:', error);
    throw error;
  }
}

export async function closeBridge() {
  try {
    await py.end();
    console.log('MultiMind SDK bridge closed successfully');
  } catch (error) {
    console.error('Error closing bridge:', error);
    throw error;
  }
} 