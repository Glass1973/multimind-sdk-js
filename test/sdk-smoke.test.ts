import { MultiMindSDK } from '../src/index';

jest.mock('../src/bridge/multimind-bridge', () => ({
  initBridge: jest.fn(),
  closeBridge: jest.fn(),
  py: { ex: jest.fn(), end: jest.fn() },
}));

describe('MultiMindSDK', () => {
  let sdk: MultiMindSDK;

  beforeEach(() => {
    sdk = new MultiMindSDK();
  });

  it('should initialize and close without error', async () => {
    await expect(sdk.initialize()).resolves.not.toThrow();
    await expect(sdk.close()).resolves.not.toThrow();
  });

  it('should expose basic methods', () => {
    expect(typeof sdk.generateWithAgent).toBe('function');
    expect(typeof sdk.fineTuneModel).toBe('function');
    expect(typeof sdk.queryRAG).toBe('function');
    expect(typeof sdk.loadAdapter).toBe('function');
    expect(typeof sdk.evaluateModel).toBe('function');
    expect(typeof sdk.loadModel).toBe('function');
  });
}); 