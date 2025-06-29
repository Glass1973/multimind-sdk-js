import { py } from './bridge/multimind-bridge';

export interface AdapterConfig {
  model: string;
  adapterPath: string;
  adapterType?: string;
}

export async function loadAdapter(config: AdapterConfig) {
  const { model, adapterPath, adapterType = 'default' } = config;
  
  try {
    await py`AdapterLoader.load(${model}, ${adapterPath}, adapter_type=${adapterType})`;
    return { success: true, message: 'Adapter loaded successfully' };
  } catch (error) {
    console.error('Error loading adapter:', error);
    throw error;
  }
}

export async function listAdapters(model: string) {
  try {
    const adapters = await py`AdapterLoader.list_adapters(${model})`;
    return adapters;
  } catch (error) {
    console.error('Error listing adapters:', error);
    throw error;
  }
}

export async function removeAdapter(model: string, adapterPath: string) {
  try {
    await py`AdapterLoader.remove(${model}, ${adapterPath})`;
    return { success: true, message: 'Adapter removed successfully' };
  } catch (error) {
    console.error('Error removing adapter:', error);
    throw error;
  }
} 