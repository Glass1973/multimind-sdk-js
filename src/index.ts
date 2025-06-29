// Bridge exports
export * from './bridge/multimind-bridge';

// Core functionality exports
export * from './agent';
export * from './fineTune';
export * from './rag';
export * from './adapters';
export * from './evaluation';
export * from './models';

// Advanced functionality exports (explicit, to avoid type conflicts)
export { advancedFineTune, createAdvancedTuner } from './advancedFineTuning';
export type { AdvancedFineTuneConfig, LoRAConfig, AdapterConfig as AdvancedAdapterConfig, PrefixConfig, MetaLearningConfig, TransferLearningConfig } from './advancedFineTuning';
export { AdvancedRAGClient } from './advancedRAG';
export type { Document, AdvancedRAGConfig, QueryConfig } from './advancedRAG';
export { ModelConverter, pytorchToONNX, tensorflowToTFLite, pytorchToGGUF } from './modelConversion';
export type { ConversionConfig, QuantizationConfig, PruningConfig, GraphOptimizationConfig } from './modelConversion';
export { ComplianceMonitor } from './compliance';
export type { ComplianceConfig, ComplianceCheck, ComplianceResult, AuditEntry, DashboardMetrics, AlertThresholds } from './compliance';
export { AdvancedAgent, builtInTools } from './advancedAgent';
export type { Tool, WorkflowStep, MemoryEntry, AgentResponse, AgentConfig as AdvancedAgentConfig } from './advancedAgent';
export { LSTMModelClient, MoEModelClient, MultiModalClient, FederatedRouter, createLoadBalancedRouter, createIntelligentRouter } from './modelClientSystem';
export type { ModelClientConfig, MoEConfig, MultiModalConfig, FederatedConfig } from './modelClientSystem';
export { MultiMindGateway, RequestMiddleware, ResponseMiddleware } from './gateway';
export type { GatewayConfig, APIRoute } from './gateway';

// Main SDK class for easier usage
import { initBridge, closeBridge, py } from './bridge/multimind-bridge';
import { generateWithAgent, createAgent, AgentConfig as BasicAgentConfig } from './agent';
import { fineTuneModel, createFineTuner, FineTuneConfig } from './fineTune';
import { queryRAG, createRAGEngine, RAGConfig } from './rag';
import { loadAdapter, listAdapters, removeAdapter, AdapterConfig as BasicAdapterConfig } from './adapters';
import { evaluateModel, compareModels, EvaluationConfig } from './evaluation';
import { loadModel, routeModel, listAvailableModels, ModelConfig } from './models';

// Advanced imports
import { advancedFineTune, createAdvancedTuner } from './advancedFineTuning';
import type { AdvancedFineTuneConfig } from './advancedFineTuning';
import { AdvancedRAGClient } from './advancedRAG';
import type { Document, AdvancedRAGConfig, QueryConfig } from './advancedRAG';
import { ModelConverter, pytorchToONNX, tensorflowToTFLite, pytorchToGGUF } from './modelConversion';
import type { ConversionConfig } from './modelConversion';
import { ComplianceMonitor } from './compliance';
import type { ComplianceConfig, ComplianceCheck } from './compliance';
import { AdvancedAgent, builtInTools } from './advancedAgent';
import type { AgentConfig as AdvancedAgentConfig, Tool } from './advancedAgent';
import { LSTMModelClient, MoEModelClient, MultiModalClient, FederatedRouter } from './modelClientSystem';
import type { ModelClientConfig, MoEConfig, MultiModalConfig, FederatedConfig } from './modelClientSystem';
import { MultiMindGateway } from './gateway';
import type { GatewayConfig, APIRoute } from './gateway';

export class MultiMindSDK {
  private initialized = false;
  private advancedRAG?: AdvancedRAGClient;
  private modelConverter?: ModelConverter;
  private complianceMonitor?: ComplianceMonitor;
  private advancedAgent?: AdvancedAgent;
  private gateway?: MultiMindGateway;

  async initialize() {
    if (!this.initialized) {
      await initBridge();
      this.initialized = true;
    }
  }

  async close() {
    if (this.initialized) {
      await closeBridge();
      this.initialized = false;
    }
  }

  // ===== BASIC FUNCTIONALITY =====

  // Agent methods
  async generateWithAgent(prompt: string, config: BasicAgentConfig = {}) {
    await this.initialize();
    return generateWithAgent(prompt, config);
  }

  async createAgent(config: BasicAgentConfig = {}) {
    await this.initialize();
    return createAgent(config);
  }

  // Fine-tuning methods
  async fineTuneModel(config: FineTuneConfig) {
    await this.initialize();
    return fineTuneModel(config);
  }

  async createFineTuner(config: FineTuneConfig) {
    await this.initialize();
    return createFineTuner(config);
  }

  // RAG methods
  async queryRAG(prompt: string, config: RAGConfig) {
    await this.initialize();
    return queryRAG(prompt, config);
  }

  async createRAGEngine(config: RAGConfig) {
    await this.initialize();
    return createRAGEngine(config);
  }

  // Adapter methods
  async loadAdapter(config: BasicAdapterConfig) {
    await this.initialize();
    return loadAdapter(config);
  }

  async listAdapters(model: string) {
    await this.initialize();
    return listAdapters(model);
  }

  async removeAdapter(model: string, adapterPath: string) {
    await this.initialize();
    return removeAdapter(model, adapterPath);
  }

  // Evaluation methods
  async evaluateModel(config: EvaluationConfig) {
    await this.initialize();
    return evaluateModel(config);
  }

  async compareModels(models: string[], task: string, dataset?: string) {
    await this.initialize();
    return compareModels(models, task, dataset);
  }

  // Model methods
  async loadModel(config: ModelConfig) {
    await this.initialize();
    return loadModel(config);
  }

  async routeModel(input: string, availableModels?: string[]) {
    await this.initialize();
    return routeModel(input, availableModels);
  }

  async listAvailableModels() {
    await this.initialize();
    return listAvailableModels();
  }

  // ===== ADVANCED FUNCTIONALITY =====

  // Advanced Fine-tuning
  async advancedFineTune(config: AdvancedFineTuneConfig) {
    await this.initialize();
    return advancedFineTune(config);
  }

  async createAdvancedTuner(config: AdvancedFineTuneConfig) {
    await this.initialize();
    return createAdvancedTuner(config);
  }

  // Advanced RAG
  async createAdvancedRAG(config: AdvancedRAGConfig = {}) {
    await this.initialize();
    if (!this.advancedRAG) {
      this.advancedRAG = new AdvancedRAGClient(config);
      await this.advancedRAG.initialize();
    }
    return this.advancedRAG;
  }

  async addDocumentsToRAG(documents: Document[]) {
    const rag = await this.createAdvancedRAG();
    return rag.addDocuments(documents);
  }

  async queryAdvancedRAG(config: QueryConfig) {
    const rag = await this.createAdvancedRAG();
    return rag.query(config);
  }

  // Model Conversion
  async createModelConverter() {
    await this.initialize();
    if (!this.modelConverter) {
      this.modelConverter = new ModelConverter();
      await this.modelConverter.initialize();
    }
    return this.modelConverter;
  }

  async convertModel(config: ConversionConfig) {
    const converter = await this.createModelConverter();
    return converter.convert(config);
  }

  async pytorchToONNX(inputPath: string, outputPath: string, config?: Partial<ConversionConfig>) {
    await this.initialize();
    return pytorchToONNX(inputPath, outputPath, config);
  }

  async tensorflowToTFLite(inputPath: string, outputPath: string, config?: Partial<ConversionConfig>) {
    await this.initialize();
    return tensorflowToTFLite(inputPath, outputPath, config);
  }

  async pytorchToGGUF(inputPath: string, outputPath: string, config?: Partial<ConversionConfig>) {
    await this.initialize();
    return pytorchToGGUF(inputPath, outputPath, config);
  }

  // Compliance
  async createComplianceMonitor(config: ComplianceConfig) {
    await this.initialize();
    if (!this.complianceMonitor) {
      this.complianceMonitor = new ComplianceMonitor(config);
      await this.complianceMonitor.initialize();
    }
    return this.complianceMonitor;
  }

  async checkCompliance(check: ComplianceCheck) {
    const monitor = await this.createComplianceMonitor({
      organizationId: 'default',
      enabledRegulations: ['GDPR', 'HIPAA'],
      privacyLevel: 'basic',
      auditEnabled: true,
      realTimeMonitoring: false
    });
    return monitor.checkCompliance(check);
  }

  // Advanced Agent
  async createAdvancedAgent(config: AdvancedAgentConfig) {
    await this.initialize();
    if (!this.advancedAgent) {
      this.advancedAgent = new AdvancedAgent(config);
      await this.advancedAgent.initialize();
    }
    return this.advancedAgent;
  }

  async runAdvancedAgent(input: string, context?: any) {
    const agent = await this.createAdvancedAgent({
      name: 'DefaultAgent',
      model: 'gpt-3.5-turbo',
      tools: [builtInTools.calculator, builtInTools.search]
    });
    return agent.run(input, context);
  }

  // Model Client System
  async createLSTMModelClient(config: ModelClientConfig) {
    await this.initialize();
    const client = new LSTMModelClient(config);
    await client.initialize();
    return client;
  }

  async createMoEModelClient(config: MoEConfig) {
    await this.initialize();
    const client = new MoEModelClient(config);
    await client.initialize();
    return client;
  }

  async createMultiModalClient(config: MultiModalConfig) {
    await this.initialize();
    const client = new MultiModalClient(config);
    await client.initialize();
    return client;
  }

  async createFederatedRouter(config: FederatedConfig) {
    await this.initialize();
    const router = new FederatedRouter(config);
    await router.initialize();
    return router;
  }

  // Gateway
  async createGateway(config: GatewayConfig = {}) {
    await this.initialize();
    if (!this.gateway) {
      this.gateway = new MultiMindGateway(config);
      await this.gateway.initialize();
    }
    return this.gateway;
  }

  async startGateway(config: GatewayConfig = {}) {
    const gateway = await this.createGateway(config);
    return gateway.start();
  }

  async stopGateway() {
    if (this.gateway) {
      return this.gateway.stop();
    }
    return { success: true, message: 'No gateway running' };
  }

  // ===== UTILITY METHODS =====

  async getSDKInfo() {
    return {
      version: '0.1.0',
      features: [
        'Basic Agent Generation',
        'Advanced Fine-tuning (LoRA, Adapters, Prefix, Meta-Learning)',
        'Advanced RAG with Document Management',
        'Model Conversion (PyTorch, TensorFlow, ONNX, GGUF, TFLite)',
        'Compliance Monitoring (GDPR, HIPAA)',
        'Advanced Agents with Tools and Memory',
        'Model Client System (LSTM, MoE, MultiModal, Federated)',
        'Gateway API',
        'Evaluation and Comparison'
      ],
      initialized: this.initialized
    };
  }

  async healthCheck() {
    try {
      await this.initialize();
      return { status: 'healthy', message: 'MultiMind SDK is ready' };
    } catch (error) {
      return { status: 'unhealthy', message: (error as Error).message };
    }
  }
}

// Default export
export default MultiMindSDK; 