import MultiMindSDK from '../src/index';

async function main() {
  const sdk = new MultiMindSDK();
  
  try {
    console.log('Initializing MultiMind SDK...');
    await sdk.initialize();
    
    console.log('Generating response with agent...');
    const output = await sdk.generateWithAgent("What is MultiMind SDK?", {
      model: "mistral",
      temperature: 0.7,
      maxTokens: 500
    });
    
    console.log("Agent Output:", output);
    
    // Example of using RAG
    console.log('\n--- RAG Example ---');
    try {
      const ragOutput = await sdk.queryRAG("What is the latest research on transformers?", {
        indexPath: "./data/index",
        topK: 3,
        similarityThreshold: 0.8
      });
      console.log("RAG Output:", ragOutput);
    } catch (error) {
      console.log("RAG example skipped (index path may not exist):", (error as Error).message);
    }
    
    // Example of listing available models
    console.log('\n--- Available Models ---');
    try {
      const models = await sdk.listAvailableModels();
      console.log("Available models:", models);
    } catch (error) {
      console.log("Could not list models:", (error as Error).message);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    console.log('Closing MultiMind SDK...');
    await sdk.close();
  }
}

// Run the example
main().catch(console.error); 