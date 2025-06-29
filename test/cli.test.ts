import { ContextTransferCLI } from '../example/context-transfer-cli';

// Mock the SDK for CLI tests
jest.mock('../src/index', () => ({
  MultiMindSDK: jest.fn().mockImplementation(() => ({
    initialize: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true),
    getSupportedModels: jest.fn().mockResolvedValue({
      success: true,
      totalModels: 5,
      supportedFormats: ['json', 'txt', 'markdown'],
      models: {
        'chatgpt': { max_context_length: 4096, supports_code: true },
        'claude': { max_context_length: 100000, supports_images: true },
        'deepseek': { max_context_length: 32768, supports_tools: true }
      }
    }),
    transferContext: jest.fn().mockResolvedValue({
      success: true,
      formattedPrompt: 'Test prompt',
      metadata: {
        messagesProcessed: 2,
        messagesExtracted: 2,
        summaryType: 'concise',
        smartExtraction: true,
        promptLength: 100,
        outputFormat: 'txt'
      }
    }),
    batchTransfer: jest.fn().mockResolvedValue({
      totalTransfers: 3,
      successfulTransfers: 3,
      failedTransfers: 0,
      results: []
    }),
    createChromeExtensionConfig: jest.fn().mockResolvedValue({
      apiVersion: '1.0.0',
      supportedModels: ['chatgpt', 'claude'],
      supportedFormats: ['json', 'txt'],
      defaultOptions: {},
      endpoints: {},
      chromeExtension: {
        manifestVersion: 3,
        permissions: ['storage'],
        contentScripts: [],
        backgroundScripts: []
      }
    })
  })),
  ConversationMessage: jest.fn()
}));

describe('Context Transfer CLI', () => {
  let cli: ContextTransferCLI;

  beforeEach(() => {
    cli = new ContextTransferCLI();
  });

  it('should create CLI instance', () => {
    expect(cli).toBeInstanceOf(ContextTransferCLI);
  });

  it('should parse help argument', () => {
    const originalArgv = process.argv;
    process.argv = ['node', 'test', '--help'];
    
    const options = (cli as any).parseArgs();
    expect(options.help).toBe(true);
    
    process.argv = originalArgv;
  });

  it('should parse source and target models', () => {
    const originalArgv = process.argv;
    process.argv = ['node', 'test', '--source', 'chatgpt', '--target', 'claude'];
    
    const options = (cli as any).parseArgs();
    expect(options.sourceModel).toBe('chatgpt');
    expect(options.targetModel).toBe('claude');
    
    process.argv = originalArgv;
  });

  it('should parse input and output files', () => {
    const originalArgv = process.argv;
    process.argv = ['node', 'test', '--input', 'test.json', '--output', 'output.txt'];
    
    const options = (cli as any).parseArgs();
    expect(options.inputFile).toBe('test.json');
    expect(options.outputFile).toBe('output.txt');
    
    process.argv = originalArgv;
  });

  it('should parse transfer options', () => {
    const originalArgv = process.argv;
    process.argv = ['node', 'test', '--last-n', '10', '--summary-type', 'detailed', '--output-format', 'markdown'];
    
    const options = (cli as any).parseArgs();
    expect(options.lastN).toBe(10);
    expect(options.summaryType).toBe('detailed');
    expect(options.outputFormat).toBe('markdown');
    
    process.argv = originalArgv;
  });

  it('should parse boolean flags', () => {
    const originalArgv = process.argv;
    process.argv = ['node', 'test', '--include-code', '--include-reasoning', '--batch'];
    
    const options = (cli as any).parseArgs();
    expect(options.includeCodeContext).toBe(true);
    expect(options.includeReasoning).toBe(true);
    expect(options.batch).toBe(true);
    
    process.argv = originalArgv;
  });

  // Note: parseTextConversation is a private method and not easily testable
  // The CLI functionality is tested through the argument parsing above
}); 