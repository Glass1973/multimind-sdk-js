import { MultiMindSDK } from '../src/index';
import { 
  generateWithAgent, 
  createAgent 
} from '../src/agent';
import { 
  fineTuneModel, 
  createFineTuner 
} from '../src/fineTune';
import { 
  queryRAG, 
  createRAGEngine 
} from '../src/rag';
import { 
  loadAdapter, 
  listAdapters 
} from '../src/adapters';
import { 
  evaluateModel, 
  compareModels 
} from '../src/evaluation';
import { 
  loadModel, 
  routeModel 
} from '../src/models';
import { 
  ContextTransferManager,
  quickTransfer,
  validateConversation
} from '../src/contextTransfer';

// Mock the bridge for all tests
jest.mock('../src/bridge/multimind-bridge', () => ({
  initBridge: jest.fn(),
  closeBridge: jest.fn(),
  py: { 
    ex: jest.fn().mockResolvedValue({ success: true }),
    end: jest.fn().mockResolvedValue(true)
  },
}));

describe('MultiMind SDK Modules', () => {
  let sdk: MultiMindSDK;

  beforeEach(() => {
    sdk = new MultiMindSDK();
  });

  describe('Agent Module', () => {
    it('should have agent functions', () => {
      expect(typeof generateWithAgent).toBe('function');
      expect(typeof createAgent).toBe('function');
    });

    it('should expose agent methods in SDK', () => {
      expect(typeof sdk.generateWithAgent).toBe('function');
      expect(typeof sdk.createAgent).toBe('function');
    });
  });

  describe('Fine-tuning Module', () => {
    it('should have fine-tuning functions', () => {
      expect(typeof fineTuneModel).toBe('function');
      expect(typeof createFineTuner).toBe('function');
    });

    it('should expose fine-tuning methods in SDK', () => {
      expect(typeof sdk.fineTuneModel).toBe('function');
      expect(typeof sdk.createFineTuner).toBe('function');
    });
  });

  describe('RAG Module', () => {
    it('should have RAG functions', () => {
      expect(typeof queryRAG).toBe('function');
      expect(typeof createRAGEngine).toBe('function');
    });

    it('should expose RAG methods in SDK', () => {
      expect(typeof sdk.queryRAG).toBe('function');
      expect(typeof sdk.createRAGEngine).toBe('function');
    });
  });

  describe('Adapters Module', () => {
    it('should have adapter functions', () => {
      expect(typeof loadAdapter).toBe('function');
      expect(typeof listAdapters).toBe('function');
    });

    it('should expose adapter methods in SDK', () => {
      expect(typeof sdk.loadAdapter).toBe('function');
      expect(typeof sdk.listAdapters).toBe('function');
    });
  });

  describe('Evaluation Module', () => {
    it('should have evaluation functions', () => {
      expect(typeof evaluateModel).toBe('function');
      expect(typeof compareModels).toBe('function');
    });

    it('should expose evaluation methods in SDK', () => {
      expect(typeof sdk.evaluateModel).toBe('function');
      expect(typeof sdk.compareModels).toBe('function');
    });
  });

  describe('Models Module', () => {
    it('should have model functions', () => {
      expect(typeof loadModel).toBe('function');
      expect(typeof routeModel).toBe('function');
    });

    it('should expose model methods in SDK', () => {
      expect(typeof sdk.loadModel).toBe('function');
      expect(typeof sdk.routeModel).toBe('function');
    });
  });

  describe('Context Transfer Module', () => {
    it('should have context transfer functions', () => {
      expect(typeof quickTransfer).toBe('function');
      expect(typeof validateConversation).toBe('function');
    });

    it('should expose context transfer methods in SDK', () => {
      expect(typeof sdk.transferContext).toBe('function');
      expect(typeof sdk.quickTransfer).toBe('function');
      expect(typeof sdk.validateConversationFormat).toBe('function');
    });

    it('should create context transfer manager', () => {
      const manager = new ContextTransferManager();
      expect(manager).toBeInstanceOf(ContextTransferManager);
    });
  });

  describe('Advanced Features', () => {
    it('should expose advanced fine-tuning methods', () => {
      expect(typeof sdk.advancedFineTune).toBe('function');
      expect(typeof sdk.createAdvancedTuner).toBe('function');
    });

    it('should expose advanced RAG methods', () => {
      expect(typeof sdk.createAdvancedRAG).toBe('function');
      expect(typeof sdk.addDocumentsToRAG).toBe('function');
      expect(typeof sdk.queryAdvancedRAG).toBe('function');
    });

    it('should expose model conversion methods', () => {
      expect(typeof sdk.createModelConverter).toBe('function');
      expect(typeof sdk.pytorchToONNX).toBe('function');
      expect(typeof sdk.tensorflowToTFLite).toBe('function');
      expect(typeof sdk.pytorchToGGUF).toBe('function');
    });

    it('should expose compliance methods', () => {
      expect(typeof sdk.createComplianceMonitor).toBe('function');
      expect(typeof sdk.checkCompliance).toBe('function');
    });

    it('should expose advanced agent methods', () => {
      expect(typeof sdk.createAdvancedAgent).toBe('function');
      expect(typeof sdk.runAdvancedAgent).toBe('function');
    });

    it('should expose model client methods', () => {
      expect(typeof sdk.createLSTMModelClient).toBe('function');
      expect(typeof sdk.createMoEModelClient).toBe('function');
      expect(typeof sdk.createMultiModalClient).toBe('function');
    });

    it('should expose gateway methods', () => {
      expect(typeof sdk.createGateway).toBe('function');
      expect(typeof sdk.startGateway).toBe('function');
      expect(typeof sdk.stopGateway).toBe('function');
    });
  });

  describe('SDK Info and Health', () => {
    it('should provide SDK information', async () => {
      const info = await sdk.getSDKInfo();
      expect(info).toHaveProperty('version');
      expect(info).toHaveProperty('features');
      expect(info).toHaveProperty('initialized');
    });

    it('should provide health check', async () => {
      const health = await sdk.healthCheck();
      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('message');
    });
  });
}); 