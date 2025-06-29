import MultiMindSDK from '../src/index';
async function advancedExample() {
    const sdk = new MultiMindSDK();
    try {
        console.log('=== MultiMind SDK Advanced Usage Example ===\n');
        await sdk.initialize();
        // 1. Agent Generation with different models
        console.log('1. Testing different models...');
        const models = ['mistral', 'gpt-3.5-turbo', 'claude-3'];
        for (const model of models) {
            try {
                console.log(`\nGenerating with ${model}...`);
                const response = await sdk.generateWithAgent("Explain quantum computing in simple terms", { model, temperature: 0.3, maxTokens: 200 });
                console.log(`${model} response:`, response);
            }
            catch (error) {
                console.log(`${model} failed:`, error.message);
            }
        }
        // 2. Model Routing
        console.log('\n2. Testing model routing...');
        try {
            const routedModel = await sdk.routeModel("I need to analyze sentiment in customer reviews", ['sentiment-analyzer', 'gpt-4', 'bert-base']);
            console.log('Routed to model:', routedModel);
        }
        catch (error) {
            console.log('Model routing failed:', error.message);
        }
        // 3. Fine-tuning example (commented out as it requires actual config)
        console.log('\n3. Fine-tuning example (commented out)...');
        /*
        try {
          const fineTuneResult = await sdk.fineTuneModel({
            configPath: './config/finetune.yaml',
            epochs: 5,
            learningRate: 0.0001,
            batchSize: 16
          });
          console.log('Fine-tuning result:', fineTuneResult);
        } catch (error) {
          console.log('Fine-tuning failed:', (error as Error).message);
        }
        */
        // 4. Adapter management
        console.log('\n4. Testing adapter management...');
        try {
            const adapters = await sdk.listAdapters('mistral');
            console.log('Available adapters for mistral:', adapters);
        }
        catch (error) {
            console.log('Adapter listing failed:', error.message);
        }
        // 5. Model evaluation
        console.log('\n5. Testing model evaluation...');
        try {
            const evaluation = await sdk.evaluateModel({
                model: 'mistral',
                task: 'text-generation',
                dataset: 'test-dataset',
                metrics: ['perplexity', 'accuracy']
            });
            console.log('Evaluation results:', evaluation);
        }
        catch (error) {
            console.log('Evaluation failed:', error.message);
        }
        // 6. Model comparison
        console.log('\n6. Testing model comparison...');
        try {
            const comparison = await sdk.compareModels(['mistral', 'gpt-3.5-turbo'], 'text-classification', 'benchmark-dataset');
            console.log('Model comparison:', comparison);
        }
        catch (error) {
            console.log('Model comparison failed:', error.message);
        }
    }
    catch (error) {
        console.error('Advanced example failed:', error);
    }
    finally {
        await sdk.close();
        console.log('\n=== Example completed ===');
    }
}
// Run the advanced example
advancedExample().catch(console.error);
//# sourceMappingURL=advanced-usage.js.map