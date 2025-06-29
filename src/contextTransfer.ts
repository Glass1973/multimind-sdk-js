import { py } from './bridge/multimind-bridge';

export interface ContextTransferConfig {
  maxContextLength?: number;
  defaultSummaryLength?: number;
  includeMetadata?: boolean;
  preserveFormatting?: boolean;
  smartTruncation?: boolean;
  contextCompression?: boolean;
}

export interface TransferOptions {
  lastN?: number;
  includeSummary?: boolean;
  summaryType?: 'concise' | 'detailed' | 'structured';
  smartExtraction?: boolean;
  outputFormat?: 'txt' | 'json' | 'markdown';
  includeMetadata?: boolean;
  includeCodeContext?: boolean;
  includeReasoning?: boolean;
  includeSafety?: boolean;
  includeCreativity?: boolean;
  includeExamples?: boolean;
  includeStepByStep?: boolean;
  includeMultimodal?: boolean;
  includeWebSearch?: boolean;
}

export interface ModelCapabilities {
  name: string;
  supportedFormats: string[];
  maxContextLength: number;
  supportsCode: boolean;
  supportsImages: boolean;
  supportsTools: boolean;
}

export interface TransferResult {
  success: boolean;
  formattedPrompt?: string;
  metadata?: {
    sourceModel: string;
    targetModel: string;
    summaryType: string;
    smartExtraction: boolean;
    messagesProcessed: number;
    messagesExtracted: number;
    promptLength: number;
    createdAt: string;
    outputFormat: string;
    modelCapabilities?: {
      source: ModelCapabilities;
      target: ModelCapabilities;
    };
  };
  error?: string;
  errorType?: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ValidationResult {
  success: boolean;
  valid: boolean;
  analysis?: {
    totalMessages: number;
    userMessages: number;
    assistantMessages: number;
    systemMessages: number;
    unknownMessages: number;
    averageMessageLength: number;
    hasSystemContext: boolean;
  };
  recommendations?: string[];
  error?: string;
  errorType?: string;
}

export class ContextTransferManager {
  private supportedModels: Record<string, string>;
  private config: ContextTransferConfig;

  constructor(config?: ContextTransferConfig) {
    this.supportedModels = {
      "chatgpt": "ChatGPT",
      "deepseek": "DeepSeek", 
      "claude": "Claude",
      "gemini": "Gemini",
      "mistral": "Mistral",
      "llama": "Llama",
      "cohere": "Cohere",
      "anthropic_claude": "Anthropic Claude",
      "openai_gpt4": "OpenAI GPT-4",
      "gpt4": "GPT-4",
      "gpt-4": "GPT-4",
      "gpt3": "GPT-3",
      "gpt-3": "GPT-3",
      "claude-3": "Claude-3",
      "claude-2": "Claude-2",
      "claude-1": "Claude-1"
    };

    this.config = {
      maxContextLength: 32000,
      defaultSummaryLength: 1000,
      includeMetadata: true,
      preserveFormatting: true,
      smartTruncation: true,
      contextCompression: false,
      ...config
    };
  }

  async extractContext(
    messages: ConversationMessage[], 
    lastN: number = 5, 
    smartExtraction: boolean = true
  ): Promise<ConversationMessage[]> {
    if (!messages.length) return [];

    if (smartExtraction) {
      return this.smartExtractContext(messages, lastN);
    } else {
      const extractedCount = Math.min(lastN, messages.length);
      const extractedMessages = messages.slice(-extractedCount);
      console.log(`Extracted ${extractedMessages.length} messages from conversation`);
      return extractedMessages;
    }
  }

  private smartExtractContext(messages: ConversationMessage[], lastN: number): ConversationMessage[] {
    if (messages.length <= lastN) return messages;

    const recentMessages = messages.slice(-lastN);
    const importantContext: ConversationMessage[] = [];

    for (const msg of messages.slice(0, -lastN)) {
      if (msg.role === 'system' || this.isImportantContext(msg.content)) {
        importantContext.push(msg);
      }
    }

    if (importantContext.length) {
      const contextToInclude = importantContext.slice(-2);
      const combined = [
        ...contextToInclude,
        ...recentMessages.slice(-(lastN - contextToInclude.length))
      ];
      console.log(`Smart extraction: ${contextToInclude.length} important + ${combined.length - contextToInclude.length} recent messages`);
      return combined;
    }

    return recentMessages;
  }

  private isImportantContext(content: string): boolean {
    const importantKeywords = [
      "system", "setup", "configuration", "requirements", "constraints",
      "important", "note", "warning", "error", "critical", "essential"
    ];
    const contentLower = content.toLowerCase();
    return importantKeywords.some(keyword => contentLower.includes(keyword));
  }

  async summarizeContext(
    messages: ConversationMessage[], 
    summaryType: string = "concise"
  ): Promise<string> {
    if (!messages.length) return "No conversation context available.";

    switch (summaryType) {
      case "structured":
        return this.createStructuredSummary(messages);
      case "detailed":
        return this.createDetailedSummary(messages);
      default:
        return this.createConciseSummary(messages);
    }
  }

  private createConciseSummary(messages: ConversationMessage[]): string {
    const summaryParts: string[] = [];

    for (const message of messages) {
      let content = message.content;
      if (content.length > 500) {
        content = content.substring(0, 500) + "...";
      }

      switch (message.role) {
        case 'user':
          summaryParts.push(`User: ${content}`);
          break;
        case 'assistant':
          summaryParts.push(`Assistant: ${content}`);
          break;
        case 'system':
          summaryParts.push(`System: ${content}`);
          break;
      }
    }

    const summary = summaryParts.join('\n');
    console.log(`Generated concise summary with ${summaryParts.length} parts`);
    return summary;
  }

  private createDetailedSummary(messages: ConversationMessage[]): string {
    const summaryParts: string[] = [];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      switch (message.role) {
        case 'user':
          summaryParts.push(`User (Message ${i + 1}): ${message.content}`);
          break;
        case 'assistant':
          summaryParts.push(`Assistant (Response ${i + 1}): ${message.content}`);
          break;
        case 'system':
          summaryParts.push(`System Configuration: ${message.content}`);
          break;
      }
    }

    const summary = summaryParts.join('\n\n');
    console.log(`Generated detailed summary with ${summaryParts.length} parts`);
    return summary;
  }

  private createStructuredSummary(messages: ConversationMessage[]): string {
    const userMessages: string[] = [];
    const assistantMessages: string[] = [];
    const systemMessages: string[] = [];

    for (const message of messages) {
      switch (message.role) {
        case 'user':
          userMessages.push(message.content);
          break;
        case 'assistant':
          assistantMessages.push(message.content);
          break;
        case 'system':
          systemMessages.push(message.content);
          break;
      }
    }

    const summaryParts: string[] = [];

    if (systemMessages.length) {
      summaryParts.push("System Context:");
      summaryParts.push(...systemMessages.map(msg => `- ${msg}`));
      summaryParts.push("");
    }

    summaryParts.push("Conversation Flow:");
    for (let i = 0; i < Math.max(userMessages.length, assistantMessages.length); i++) {
      if (i < userMessages.length) {
        summaryParts.push(`User: ${userMessages[i]}`);
      }
      if (i < assistantMessages.length) {
        summaryParts.push(`Assistant: ${assistantMessages[i]}`);
      }
      summaryParts.push("");
    }

    const summary = summaryParts.join('\n').trim();
    console.log(`Generated structured summary with ${userMessages.length} user and ${assistantMessages.length} assistant messages`);
    return summary;
  }

  async loadConversationFromFile(filePath: string, formatType: string = "auto"): Promise<ConversationMessage[]> {
    try {
      if (formatType === "auto") {
        formatType = this.detectFileFormat(filePath);
      }

      switch (formatType) {
        case "json":
          return this.loadJsonConversation(filePath);
        case "txt":
          return this.loadTextConversation(filePath);
        case "markdown":
          return this.loadMarkdownConversation(filePath);
        default:
          throw new Error(`Unsupported format: ${formatType}`);
      }
    } catch (error) {
      console.error(`Error loading conversation from ${filePath}:`, error);
      throw error;
    }
  }

  private detectFileFormat(filePath: string): string {
    const extension = filePath.split('.').pop()?.toLowerCase();
    if (extension === "json") return "json";
    if (extension === "md" || extension === "markdown") return "markdown";
    return "txt";
  }

  private async loadJsonConversation(filePath: string): Promise<ConversationMessage[]> {
    const fs = await import('fs/promises');
    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    let messages: ConversationMessage[];
    if (Array.isArray(data)) {
      messages = data;
    } else if (data.messages) {
      messages = data.messages;
    } else if (data.conversation) {
      messages = data.conversation;
    } else {
      throw new Error("Invalid JSON structure. Expected list of messages or dict with 'messages' key.");
    }

    console.log(`Loaded ${messages.length} messages from JSON file ${filePath}`);
    return messages;
  }

  private async loadTextConversation(filePath: string): Promise<ConversationMessage[]> {
    const fs = await import('fs/promises');
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    const messages: ConversationMessage[] = [];
    let currentRole: string | null = null;
    let currentContent: string[] = [];

    for (const line of lines) {
      if (line.startsWith('User:') || line.startsWith('Assistant:') || line.startsWith('System:')) {
        if (currentRole && currentContent.length) {
          messages.push({
            role: currentRole as 'user' | 'assistant' | 'system',
            content: currentContent.join('\n').trim()
          });
        }

        if (line.startsWith('User:')) {
          currentRole = "user";
        } else if (line.startsWith('Assistant:')) {
          currentRole = "assistant";
        } else if (line.startsWith('System:')) {
          currentRole = "system";
        }

        currentContent = [line.split(':', 1)[1]?.trim() || ''];
      } else {
        currentContent.push(line);
      }
    }

    if (currentRole && currentContent.length) {
      messages.push({
        role: currentRole as 'user' | 'assistant' | 'system',
        content: currentContent.join('\n').trim()
      });
    }

    console.log(`Loaded ${messages.length} messages from text file ${filePath}`);
    return messages;
  }

  private async loadMarkdownConversation(filePath: string): Promise<ConversationMessage[]> {
    const fs = await import('fs/promises');
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const messages: ConversationMessage[] = [];
    let currentRole: string | null = null;
    let currentContent: string[] = [];

    for (const line of lines) {
      if (line.startsWith('### User:') || line.startsWith('### Assistant:') || line.startsWith('### System:')) {
        if (currentRole && currentContent.length) {
          messages.push({
            role: currentRole as 'user' | 'assistant' | 'system',
            content: currentContent.join('\n').trim()
          });
        }

        if (line.startsWith('### User:')) {
          currentRole = "user";
        } else if (line.startsWith('### Assistant:')) {
          currentRole = "assistant";
        } else if (line.startsWith('### System:')) {
          currentRole = "system";
        }

        currentContent = [line.split(':', 1)[1]?.trim() || ''];
      } else {
        currentContent.push(line);
      }
    }

    if (currentRole && currentContent.length) {
      messages.push({
        role: currentRole as 'user' | 'assistant' | 'system',
        content: currentContent.join('\n').trim()
      });
    }

    console.log(`Loaded ${messages.length} messages from markdown file ${filePath}`);
    return messages;
  }

  async saveFormattedPrompt(content: string, outputFile: string, formatType: string = "txt"): Promise<void> {
    try {
      switch (formatType) {
        case "json":
          await this.saveJsonPrompt(content, outputFile);
          break;
        case "markdown":
          await this.saveMarkdownPrompt(content, outputFile);
          break;
        default:
          await this.saveTextPrompt(content, outputFile);
      }

      console.log(`Formatted prompt saved to ${outputFile} in ${formatType} format`);
    } catch (error) {
      console.error(`Error saving formatted prompt to ${outputFile}:`, error);
      throw error;
    }
  }

  private async saveTextPrompt(content: string, outputFile: string): Promise<void> {
    const fs = await import('fs/promises');
    await fs.writeFile(outputFile, content, 'utf-8');
  }

  private async saveJsonPrompt(content: string, outputFile: string): Promise<void> {
    const fs = await import('fs/promises');
    const promptData = {
      prompt: content,
      metadata: {
        created_at: new Date().toISOString(),
        format: "json",
        length: content.length
      }
    };
    await fs.writeFile(outputFile, JSON.stringify(promptData, null, 2), 'utf-8');
  }

  private async saveMarkdownPrompt(content: string, outputFile: string): Promise<void> {
    const fs = await import('fs/promises');
    const markdownContent = `# Formatted Prompt

## Content

${content}

---
*Generated by MultiMind Context Transfer*
`;
    await fs.writeFile(outputFile, markdownContent, 'utf-8');
  }

  async transferContext(
    fromModel: string,
    toModel: string,
    inputFile: string,
    outputFile: string,
    lastN: number = 5,
    includeSummary: boolean = true,
    summaryType: string = "concise",
    smartExtraction: boolean = true,
    outputFormat: string = "txt",
    options: Record<string, any> = {}
  ): Promise<string> {
    const messages = await this.loadConversationFromFile(inputFile);
    const extractedMessages = await this.extractContext(messages, lastN, smartExtraction);
    
    let summary: string;
    if (includeSummary) {
      summary = await this.summarizeContext(extractedMessages, summaryType);
    } else {
      summary = await this.summarizeContext(extractedMessages.slice(-1), "concise");
    }

    const formattedPrompt = await this.formatForTargetModel(toModel, summary, fromModel, options);
    await this.saveFormattedPrompt(formattedPrompt, outputFile, outputFormat);
    
    return formattedPrompt;
  }

  private async formatForTargetModel(
    targetModel: string, 
    summary: string, 
    sourceModel: string, 
    options: Record<string, any> = {}
  ): Promise<string> {
    const targetModelLower = targetModel.toLowerCase().replace(/[ -]/g, "_");
    
    try {
      const adapter = await this.getAdapter(targetModelLower);
      return adapter.formatContext(summary, sourceModel, options);
    } catch (error) {
      return this.formatGeneric(summary, sourceModel, targetModel, options);
    }
  }

  private async getAdapter(modelName: string): Promise<any> {
    try {
      return await py`AdapterFactory.get_adapter(${modelName})`;
    } catch (error) {
      throw new Error(`Model '${modelName}' not supported`);
    }
  }

  private formatGeneric(summary: string, sourceModel: string, targetModel: string, options: Record<string, any> = {}): string {
    const includeMetadata = options.include_metadata ?? this.config.includeMetadata;
    
    let prompt = `You are ${targetModel}, an AI assistant.

A user was previously working with ${sourceModel} on the following conversation:

${summary}

Please continue helping the user from where they left off. Maintain the context and provide helpful responses.`;
    
    if (includeMetadata) {
      prompt += `\n\n---\nContext transferred from ${sourceModel} to ${targetModel} using MultiMind SDK`;
    }
    
    return prompt;
  }

  getSupportedModels(): string[] {
    return Object.keys(this.supportedModels);
  }

  async getModelInfo(modelName: string): Promise<ModelCapabilities> {
    try {
      const capabilities = await py`AdapterFactory.get_model_capabilities(${modelName})`;
      return capabilities;
    } catch (error) {
      return {
        name: modelName,
        supportedFormats: ["text"],
        maxContextLength: 8000,
        supportsCode: true,
        supportsImages: false,
        supportsTools: false
      };
    }
  }

  async listAllModels(): Promise<Record<string, ModelCapabilities>> {
    try {
      return await py`AdapterFactory.list_all_capabilities()`;
    } catch (error) {
      console.error('Error getting model capabilities:', error);
      return {};
    }
  }
}

export class ContextTransferAPI {
  private manager: ContextTransferManager;
  private supportedFormats: string[];
  private supportedModels: string[];

  constructor() {
    this.manager = new ContextTransferManager();
    this.supportedFormats = ["json", "txt", "markdown"];
    this.supportedModels = this.manager.getSupportedModels();
  }

  async transferContextAPI(
    sourceModel: string,
    targetModel: string,
    conversationData: string | ConversationMessage[] | Record<string, any>,
    options: TransferOptions = {}
  ): Promise<TransferResult> {
    try {
      const defaultOptions: TransferOptions = {
        lastN: 5,
        includeSummary: true,
        summaryType: "concise",
        smartExtraction: true,
        outputFormat: "txt",
        includeMetadata: true,
        includeCodeContext: false,
        includeReasoning: false,
        includeSafety: false,
        includeCreativity: false,
        includeExamples: false,
        includeStepByStep: false,
        includeMultimodal: false,
        includeWebSearch: false
      };

      const finalOptions = { ...defaultOptions, ...options };
      const messages = this.processConversationData(conversationData);
      const extractedMessages = await this.manager.extractContext(
        messages, 
        finalOptions.lastN!, 
        finalOptions.smartExtraction!
      );

      let summary: string;
      if (finalOptions.includeSummary) {
        summary = await this.manager.summarizeContext(extractedMessages, finalOptions.summaryType);
      } else {
        summary = await this.manager.summarizeContext(extractedMessages.slice(-1), "concise");
      }

      const formattingOptions = Object.fromEntries(
        Object.entries(finalOptions).filter(([key]) => key.startsWith('include_') && key !== 'includeMetadata')
      );

      const formattedPrompt = await this.manager.formatForTargetModel(
        targetModel, summary, sourceModel, formattingOptions
      );

      const response: TransferResult = {
        success: true,
        formattedPrompt,
        metadata: {
          sourceModel,
          targetModel,
          summaryType: finalOptions.summaryType!,
          smartExtraction: finalOptions.smartExtraction!,
          messagesProcessed: messages.length,
          messagesExtracted: extractedMessages.length,
          promptLength: formattedPrompt.length,
          createdAt: new Date().toISOString(),
          outputFormat: finalOptions.outputFormat!
        }
      };

      if (finalOptions.includeMetadata) {
        response.metadata!.modelCapabilities = {
          source: await this.manager.getModelInfo(sourceModel),
          target: await this.manager.getModelInfo(targetModel)
        };
      }

      console.log(`Context transfer completed: ${sourceModel} -> ${targetModel}`);
      return response;
    } catch (error) {
      console.error('Context transfer failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.constructor.name : 'Unknown'
      };
    }
  }

  private processConversationData(data: string | ConversationMessage[] | Record<string, any>): ConversationMessage[] {
    if (typeof data === 'string') {
      // This would need to be handled asynchronously in a real implementation
      throw new Error('File path processing not implemented in this demo');
    } else if (Array.isArray(data)) {
      return data;
    } else if (typeof data === 'object') {
      if (data.messages) {
        return data.messages;
      } else if (data.conversation) {
        return data.conversation;
      } else {
        return [data as ConversationMessage];
      }
    } else {
      throw new Error(`Unsupported data type: ${typeof data}`);
    }
  }

  async getSupportedModels(): Promise<Record<string, any>> {
    try {
      const capabilities = await this.manager.listAllModels();
      
      return {
        success: true,
        models: capabilities,
        totalModels: Object.keys(capabilities).length,
        supportedFormats: this.supportedFormats,
        metadata: {
          generatedAt: new Date().toISOString(),
          apiVersion: "2.0"
        }
      };
    } catch (error) {
      console.error('Failed to get supported models:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.constructor.name : 'Unknown'
      };
    }
  }

  async getModelCapabilities(modelName: string): Promise<Record<string, any>> {
    try {
      const capabilities = await this.manager.getModelInfo(modelName);
      
      return {
        success: true,
        model: modelName,
        capabilities,
        metadata: {
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.constructor.name : 'Unknown'
      };
    }
  }

  async validateConversationFormat(data: string | ConversationMessage[] | Record<string, any>): Promise<ValidationResult> {
    try {
      const messages = this.processConversationData(data);
      
      const analysis = {
        totalMessages: messages.length,
        userMessages: 0,
        assistantMessages: 0,
        systemMessages: 0,
        unknownMessages: 0,
        averageMessageLength: 0,
        hasSystemContext: false
      };

      let totalLength = 0;
      for (const msg of messages) {
        const role = msg.role;
        const content = msg.content;

        switch (role) {
          case 'user':
            analysis.userMessages++;
            break;
          case 'assistant':
            analysis.assistantMessages++;
            break;
          case 'system':
            analysis.systemMessages++;
            analysis.hasSystemContext = true;
            break;
          default:
            analysis.unknownMessages++;
        }

        totalLength += content.length;
      }

      if (analysis.totalMessages > 0) {
        analysis.averageMessageLength = totalLength / analysis.totalMessages;
      }

      return {
        success: true,
        valid: true,
        analysis,
        recommendations: this.generateRecommendations(analysis)
      };
    } catch (error) {
      return {
        success: false,
        valid: false,
        error: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.constructor.name : 'Unknown'
      };
    }
  }

  private generateRecommendations(analysis: any): string[] {
    const recommendations: string[] = [];

    if (analysis.totalMessages === 0) {
      recommendations.push("No messages found in conversation data");
    }

    if (analysis.userMessages === 0) {
      recommendations.push("No user messages found - ensure conversation has user input");
    }

    if (analysis.assistantMessages === 0) {
      recommendations.push("No assistant messages found - ensure conversation has AI responses");
    }

    if (analysis.unknownMessages > 0) {
      recommendations.push(`Found ${analysis.unknownMessages} messages with unknown roles`);
    }

    if (analysis.averageMessageLength > 1000) {
      recommendations.push("Long messages detected - consider using smart extraction");
    }

    if (analysis.totalMessages > 20) {
      recommendations.push("Large conversation detected - consider using smart extraction and detailed summary");
    }

    if (!analysis.hasSystemContext) {
      recommendations.push("No system context found - consider adding system messages for better context");
    }

    return recommendations;
  }

  async batchTransfer(transfers: Array<{
    sourceModel: string;
    targetModel: string;
    conversationData: string | ConversationMessage[] | Record<string, any>;
    options?: TransferOptions;
  }>): Promise<Record<string, any>> {
    const results: TransferResult[] = [];
    let successful = 0;
    let failed = 0;

    for (let i = 0; i < transfers.length; i++) {
      const transferConfig = transfers[i];
      try {
        const result = await this.transferContextAPI(
          transferConfig.sourceModel,
          transferConfig.targetModel,
          transferConfig.conversationData,
          transferConfig.options
        );

        result.metadata = { ...result.metadata, transferIndex: i };
        results.push(result);

        if (result.success) {
          successful++;
        } else {
          failed++;
        }
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : String(error),
          errorType: error instanceof Error ? error.constructor.name : 'Unknown',
          metadata: { transferIndex: i }
        });
        failed++;
      }
    }

    return {
      success: failed === 0,
      totalTransfers: transfers.length,
      successfulTransfers: successful,
      failedTransfers: failed,
      results,
      metadata: {
        completedAt: new Date().toISOString()
      }
    };
  }

  createChromeExtensionConfig(): Record<string, any> {
    return {
      apiVersion: "2.0",
      supportedModels: this.supportedModels,
      supportedFormats: this.supportedFormats,
      defaultOptions: {
        lastN: 5,
        includeSummary: true,
        summaryType: "concise",
        smartExtraction: true,
        outputFormat: "txt"
      },
      chromeExtension: {
        manifestVersion: 3,
        permissions: ["activeTab", "storage"],
        contentScripts: ["content.js"],
        backgroundScripts: ["background.js"],
        popup: "popup.html"
      },
      endpoints: {
        transfer: "/api/transfer",
        models: "/api/models",
        validate: "/api/validate",
        batch: "/api/batch"
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        sdkVersion: "2.0.0"
      }
    };
  }
}

// Convenience functions
export async function quickTransfer(
  sourceModel: string,
  targetModel: string,
  conversationData: string | ConversationMessage[] | Record<string, any>,
  options: Record<string, any> = {}
): Promise<string> {
  const api = new ContextTransferAPI();
  const result = await api.transferContextAPI(sourceModel, targetModel, conversationData, options);
  
  if (result.success && result.formattedPrompt) {
    return result.formattedPrompt;
  } else {
    throw new Error(`Transfer failed: ${result.error || 'Unknown error'}`);
  }
}

export async function getAllModels(): Promise<Record<string, any>> {
  const api = new ContextTransferAPI();
  return api.getSupportedModels();
}

export async function validateConversation(data: string | ConversationMessage[] | Record<string, any>): Promise<ValidationResult> {
  const api = new ContextTransferAPI();
  return api.validateConversationFormat(data);
}
