#!/usr/bin/env node

/**
 * MultiMind Context Transfer CLI
 * 
 * A comprehensive command-line interface for transferring conversation context
 * between different LLM providers, mirroring the Python SDK's functionality.
 */

import { MultiMindSDK, ConversationMessage } from '../src';
import * as fs from 'fs/promises';
import * as path from 'path';

interface CLIOptions {
  sourceModel: string;
  targetModel: string;
  inputFile?: string;
  outputFile?: string;
  lastN?: number;
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
  batch?: boolean;
  validate?: boolean;
  listModels?: boolean;
  chromeConfig?: boolean;
  help?: boolean;
}

class ContextTransferCLI {
  private sdk: MultiMindSDK;

  constructor() {
    this.sdk = new MultiMindSDK();
  }

  async run() {
    try {
      const options = this.parseArgs();
      
      if (options.help) {
        this.showHelp();
        return;
      }

      await this.sdk.initialize();

      if (options.listModels) {
        await this.listSupportedModels();
        return;
      }

      if (options.chromeConfig) {
        await this.generateChromeConfig();
        return;
      }

      if (options.validate && options.inputFile) {
        await this.validateConversation(options.inputFile);
        return;
      }

      if (options.batch) {
        await this.runBatchTransfer();
        return;
      }

      if (options.sourceModel && options.targetModel) {
        await this.runTransfer(options);
        return;
      }

      this.showHelp();
    } catch (error) {
      console.error('❌ Error:', error);
      process.exit(1);
    } finally {
      await this.sdk.close();
    }
  }

  private parseArgs(): CLIOptions {
    const args = process.argv.slice(2);
    const options: CLIOptions = {
      sourceModel: '',
      targetModel: '',
      smartExtraction: true,
      summaryType: 'concise',
      outputFormat: 'txt',
      includeMetadata: true
    };

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const nextArg = args[i + 1];

      switch (arg) {
        case '--source':
        case '-s':
          options.sourceModel = nextArg;
          i++;
          break;
        case '--target':
        case '-t':
          options.targetModel = nextArg;
          i++;
          break;
        case '--input':
        case '-i':
          options.inputFile = nextArg;
          i++;
          break;
        case '--output':
        case '-o':
          options.outputFile = nextArg;
          i++;
          break;
        case '--last-n':
          options.lastN = parseInt(nextArg);
          i++;
          break;
        case '--summary-type':
          options.summaryType = nextArg as 'concise' | 'detailed' | 'structured';
          i++;
          break;
        case '--output-format':
          options.outputFormat = nextArg as 'txt' | 'json' | 'markdown';
          i++;
          break;
        case '--no-smart-extraction':
          options.smartExtraction = false;
          break;
        case '--no-metadata':
          options.includeMetadata = false;
          break;
        case '--include-code':
          options.includeCodeContext = true;
          break;
        case '--include-reasoning':
          options.includeReasoning = true;
          break;
        case '--include-safety':
          options.includeSafety = true;
          break;
        case '--include-creativity':
          options.includeCreativity = true;
          break;
        case '--include-examples':
          options.includeExamples = true;
          break;
        case '--include-step-by-step':
          options.includeStepByStep = true;
          break;
        case '--include-multimodal':
          options.includeMultimodal = true;
          break;
        case '--include-web-search':
          options.includeWebSearch = true;
          break;
        case '--batch':
          options.batch = true;
          break;
        case '--validate':
          options.validate = true;
          break;
        case '--list-models':
          options.listModels = true;
          break;
        case '--chrome-config':
          options.chromeConfig = true;
          break;
        case '--help':
        case '-h':
          options.help = true;
          break;
      }
    }

    return options;
  }

  private showHelp() {
    console.log(`
🎯 MultiMind Context Transfer CLI

Transfer conversation context between different LLM providers with advanced features.

USAGE:
  npx ts-node context-transfer-cli.ts [OPTIONS]

OPTIONS:
  Basic Transfer:
    --source, -s <model>           Source model name (e.g., chatgpt, claude)
    --target, -t <model>           Target model name (e.g., deepseek, gemini)
    --input, -i <file>             Input conversation file (JSON, TXT, MD)
    --output, -o <file>            Output formatted prompt file

  Transfer Options:
    --last-n <number>              Number of recent messages to extract (default: 5)
    --summary-type <type>          Summary type: concise, detailed, structured (default: concise)
    --output-format <format>       Output format: txt, json, markdown (default: txt)
    --no-smart-extraction          Disable smart context extraction
    --no-metadata                  Exclude metadata from output

  Model-Specific Options:
    --include-code                 Include code context (for coding models)
    --include-reasoning            Include reasoning capabilities
    --include-safety               Include safety considerations
    --include-creativity           Include creative capabilities
    --include-examples             Include example generation
    --include-step-by-step         Include step-by-step explanations
    --include-multimodal           Include multimodal capabilities
    --include-web-search           Include web search capabilities

  Advanced Features:
    --batch                        Run batch transfer operations
    --validate                     Validate conversation format
    --list-models                  List all supported models
    --chrome-config                Generate Chrome extension configuration
    --help, -h                     Show this help message

EXAMPLES:
  # Basic transfer from ChatGPT to Claude
  npx ts-node context-transfer-cli.ts --source chatgpt --target claude --input conversation.json --output prompt.txt

  # Advanced transfer with custom options
  npx ts-node context-transfer-cli.ts --source gpt-4 --target deepseek --input chat.txt --output formatted.md \\
    --summary-type detailed --include-code --include-reasoning --output-format markdown

  # List supported models
  npx ts-node context-transfer-cli.ts --list-models

  # Validate conversation format
  npx ts-node context-transfer-cli.ts --validate --input conversation.json

  # Generate Chrome extension config
  npx ts-node context-transfer-cli.ts --chrome-config

SUPPORTED MODELS:
  - chatgpt, gpt-3, gpt-4
  - claude, claude-2, claude-3
  - deepseek
  - gemini
  - mistral
  - llama
  - cohere
  - anthropic_claude
  - openai_gpt4

FILE FORMATS:
  - JSON: Array of message objects with 'role' and 'content'
  - TXT: Plain text with User:/Assistant:/System: prefixes
  - MD: Markdown with ### User:/### Assistant:/### System: headers
`);
  }

  private async listSupportedModels() {
    console.log('🤖 Fetching supported models...\n');
    
    try {
      const result = await this.sdk.getSupportedModels();
      
      if (result.success) {
        console.log(`📋 Total supported models: ${result.totalModels}`);
        console.log(`📄 Supported formats: ${result.supportedFormats.join(', ')}\n`);
        
        // Show models by category
        const models = result.models;
        const categories: Record<string, string[]> = {
          'OpenAI': ['chatgpt', 'gpt-3', 'gpt-4', 'openai_gpt4'],
          'Anthropic': ['claude', 'claude-2', 'claude-3', 'anthropic_claude'],
          'Other': Object.keys(models).filter(m => 
            !['chatgpt', 'gpt-3', 'gpt-4', 'openai_gpt4', 'claude', 'claude-2', 'claude-3', 'anthropic_claude'].includes(m)
          )
        };

        for (const [category, modelList] of Object.entries(categories)) {
          if (modelList.length > 0) {
            console.log(`${category}:`);
            for (const modelName of modelList) {
              if (models[modelName]) {
                const caps = models[modelName];
                const contextLength = caps.max_context_length?.toLocaleString() || 'Unknown';
                const features = [];
                if (caps.supports_code) features.push('Code');
                if (caps.supports_images) features.push('Images');
                if (caps.supports_tools) features.push('Tools');
                
                console.log(`  📌 ${modelName}: ${contextLength} tokens${features.length ? ` (${features.join(', ')})` : ''}`);
              }
            }
            console.log('');
          }
        }
      } else {
        console.error('❌ Failed to get model info:', result.error);
      }
    } catch (error) {
      console.error('❌ Error listing models:', error);
    }
  }

  private async validateConversation(inputFile: string) {
    console.log(`🔍 Validating conversation format: ${inputFile}\n`);
    
    try {
      const content = await fs.readFile(inputFile, 'utf-8');
      let conversationData: ConversationMessage[];

      // Try to parse as JSON first
      try {
        const data = JSON.parse(content);
        conversationData = Array.isArray(data) ? data : data.messages || data.conversation || [];
      } catch {
        // Fall back to text parsing
        conversationData = this.parseTextConversation(content);
      }

      const result = await this.sdk.validateConversationFormat(conversationData);
      
      if (result.success && result.valid) {
        console.log('✅ Conversation format is valid!\n');
        
        const analysis = result.analysis!;
        console.log('📊 Analysis:');
        console.log(`  Total messages: ${analysis.totalMessages}`);
        console.log(`  User messages: ${analysis.userMessages}`);
        console.log(`  Assistant messages: ${analysis.assistantMessages}`);
        console.log(`  System messages: ${analysis.systemMessages}`);
        console.log(`  Unknown messages: ${analysis.unknownMessages}`);
        console.log(`  Average message length: ${analysis.averageMessageLength.toFixed(0)} characters`);
        console.log(`  Has system context: ${analysis.hasSystemContext ? 'Yes' : 'No'}\n`);

        if (result.recommendations && result.recommendations.length > 0) {
          console.log('💡 Recommendations:');
          for (const rec of result.recommendations) {
            console.log(`  • ${rec}`);
          }
        }
      } else {
        console.log('❌ Conversation format is invalid!');
        if (result.error) {
          console.log(`Error: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('❌ Error validating conversation:', error);
    }
  }

  private parseTextConversation(content: string): ConversationMessage[] {
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

    return messages;
  }

  private async runTransfer(options: CLIOptions) {
    console.log(`🔄 Transferring context from ${options.sourceModel} to ${options.targetModel}...\n`);
    
    try {
      let conversationData: ConversationMessage[];

      if (options.inputFile) {
        const content = await fs.readFile(options.inputFile, 'utf-8');
        try {
          const data = JSON.parse(content);
          conversationData = Array.isArray(data) ? data : data.messages || data.conversation || [];
        } catch {
          conversationData = this.parseTextConversation(content);
        }
      } else {
        // Use sample conversation for demo
        conversationData = [
          { role: 'user', content: 'I need help with Python programming' },
          { role: 'assistant', content: 'I\'d be happy to help with Python! What specific topic are you working on?' },
          { role: 'user', content: 'I\'m trying to understand decorators' },
          { role: 'assistant', content: 'Decorators are a powerful Python feature. They allow you to modify or enhance functions...' }
        ];
        console.log('📝 Using sample conversation (use --input to specify a file)');
      }

      const transferOptions = {
        lastN: options.lastN,
        includeSummary: true,
        summaryType: options.summaryType,
        smartExtraction: options.smartExtraction,
        outputFormat: options.outputFormat,
        includeMetadata: options.includeMetadata,
        includeCodeContext: options.includeCodeContext,
        includeReasoning: options.includeReasoning,
        includeSafety: options.includeSafety,
        includeCreativity: options.includeCreativity,
        includeExamples: options.includeExamples,
        includeStepByStep: options.includeStepByStep,
        includeMultimodal: options.includeMultimodal,
        includeWebSearch: options.includeWebSearch
      };

      const result = await this.sdk.transferContext(
        options.sourceModel,
        options.targetModel,
        conversationData,
        transferOptions
      );

      if (result.success && result.formattedPrompt) {
        console.log('✅ Transfer successful!\n');
        
        const metadata = result.metadata!;
        console.log('📊 Transfer Details:');
        console.log(`  Messages processed: ${metadata.messagesProcessed}`);
        console.log(`  Messages extracted: ${metadata.messagesExtracted}`);
        console.log(`  Summary type: ${metadata.summaryType}`);
        console.log(`  Smart extraction: ${metadata.smartExtraction ? 'Enabled' : 'Disabled'}`);
        console.log(`  Prompt length: ${metadata.promptLength.toLocaleString()} characters`);
        console.log(`  Output format: ${metadata.outputFormat}\n`);

        if (metadata.modelCapabilities) {
          console.log('🤖 Model Capabilities:');
          console.log(`  Source (${metadata.sourceModel}): ${metadata.modelCapabilities.source.maxContextLength.toLocaleString()} tokens`);
          console.log(`  Target (${metadata.targetModel}): ${metadata.modelCapabilities.target.maxContextLength.toLocaleString()} tokens\n`);
        }

        // Save or display output
        if (options.outputFile) {
          await fs.writeFile(options.outputFile, result.formattedPrompt, 'utf-8');
          console.log(`💾 Formatted prompt saved to: ${options.outputFile}`);
        } else {
          console.log('📋 Formatted Prompt:');
          console.log('─'.repeat(50));
          console.log(result.formattedPrompt);
          console.log('─'.repeat(50));
        }
      } else {
        console.error('❌ Transfer failed:', result.error);
      }
    } catch (error) {
      console.error('❌ Error during transfer:', error);
    }
  }

  private async runBatchTransfer() {
    console.log('📦 Running batch transfer operations...\n');
    
    try {
      const transfers = [
        {
          sourceModel: 'chatgpt',
          targetModel: 'deepseek',
          conversationData: [
            { role: 'user', content: 'Explain machine learning basics' },
            { role: 'assistant', content: 'Machine learning is a subset of AI that enables computers to learn...' }
          ],
          options: { summaryType: 'concise' }
        },
        {
          sourceModel: 'claude',
          targetModel: 'gemini',
          conversationData: [
            { role: 'user', content: 'Help me with data analysis' },
            { role: 'assistant', content: 'Data analysis involves collecting, cleaning, and interpreting data...' }
          ],
          options: { summaryType: 'detailed', includeCodeContext: true }
        },
        {
          sourceModel: 'gemini',
          targetModel: 'mistral',
          conversationData: [
            { role: 'user', content: 'What are the best practices for API design?' },
            { role: 'assistant', content: 'API design best practices include RESTful principles, proper error handling...' }
          ],
          options: { includeReasoning: true, includeExamples: true }
        }
      ];

      const result = await this.sdk.batchTransfer(transfers);
      
      console.log(`📊 Batch Transfer Results:`);
      console.log(`  Total transfers: ${result.totalTransfers}`);
      console.log(`  Successful: ${result.successfulTransfers}`);
      console.log(`  Failed: ${result.failedTransfers}`);
      console.log(`  Success rate: ${((result.successfulTransfers / result.totalTransfers) * 100).toFixed(1)}%\n`);

      for (let i = 0; i < result.results.length; i++) {
        const transferResult = result.results[i];
        if (transferResult.success) {
          const metadata = transferResult.metadata!;
          console.log(`  ✅ Transfer ${i + 1}: ${metadata.sourceModel} → ${metadata.targetModel} (${metadata.promptLength.toLocaleString()} chars)`);
        } else {
          console.log(`  ❌ Transfer ${i + 1}: ${transferResult.error}`);
        }
      }
    } catch (error) {
      console.error('❌ Error during batch transfer:', error);
    }
  }

  private async generateChromeConfig() {
    console.log('🌐 Generating Chrome extension configuration...\n');
    
    try {
      const config = await this.sdk.createChromeExtensionConfig();
      
      const configFile = 'chrome_extension_config.json';
      await fs.writeFile(configFile, JSON.stringify(config, null, 2), 'utf-8');
      
      console.log('✅ Chrome extension configuration generated!');
      console.log(`📁 Configuration saved to: ${configFile}\n`);
      
      console.log('📋 Configuration Summary:');
      console.log(`  API Version: ${config.apiVersion}`);
      console.log(`  Supported Models: ${config.supportedModels.length}`);
      console.log(`  Supported Formats: ${config.supportedFormats.join(', ')}\n`);
      
      console.log('🔧 Default Options:');
      for (const [key, value] of Object.entries(config.defaultOptions)) {
        console.log(`  ${key}: ${value}`);
      }
      
      console.log('\n🌐 Endpoints:');
      for (const [endpoint, path] of Object.entries(config.endpoints)) {
        console.log(`  ${endpoint}: ${path}`);
      }
      
      console.log('\n📦 Chrome Extension Info:');
      const chromeInfo = config.chromeExtension;
      console.log(`  Manifest Version: ${chromeInfo.manifestVersion}`);
      console.log(`  Permissions: ${chromeInfo.permissions.join(', ')}`);
      console.log(`  Scripts: ${chromeInfo.contentScripts.concat(chromeInfo.backgroundScripts).join(', ')}`);
    } catch (error) {
      console.error('❌ Error generating Chrome config:', error);
    }
  }
}

// Run the CLI
if (require.main === module) {
  const cli = new ContextTransferCLI();
  cli.run().catch(console.error);
} 