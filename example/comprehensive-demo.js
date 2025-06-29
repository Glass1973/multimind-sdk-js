import MultiMindSDK from '../src/index';
async function comprehensiveDemo() {
    const sdk = new MultiMindSDK();
    try {
        console.log('🚀 MultiMind SDK Comprehensive Demo\n');
        await sdk.initialize();
        // 1. SDK Information
        console.log('1. 📊 SDK Information');
        const sdkInfo = await sdk.getSDKInfo();
        console.log('SDK Version:', sdkInfo.version);
        console.log('Features:', sdkInfo.features.length);
        console.log('Initialized:', sdkInfo.initialized);
        // 2. Health Check
        console.log('\n2. 🏥 Health Check');
        const health = await sdk.healthCheck();
        console.log('Status:', health.status);
        console.log('Message:', health.message);
        // 3. Basic Agent Generation
        console.log('\n3. 🤖 Basic Agent Generation');
        try {
            const response = await sdk.generateWithAgent("Explain quantum computing in simple terms", { model: "gpt-3.5-turbo", temperature: 0.7, maxTokens: 200 });
            console.log('Response:', response);
        }
        catch (error) {
            console.log('Basic agent failed:', error.message);
        }
        // 4. Advanced Fine-tuning
        console.log('\n4. 🎯 Advanced Fine-tuning Demo');
        try {
            const fineTuneResult = await sdk.advancedFineTune({
                baseModelName: "bert-base-uncased",
                outputDir: "./output/finetune",
                method: "lora",
                epochs: 3,
                learningRate: 0.001,
                batchSize: 16,
                loraConfig: {
                    r: 16,
                    alpha: 32,
                    dropout: 0.1,
                    targetModules: ["query", "value"]
                }
            });
            console.log('Fine-tuning result:', fineTuneResult);
        }
        catch (error) {
            console.log('Advanced fine-tuning failed:', error.message);
        }
        // 5. Advanced RAG System
        console.log('\n5. 📚 Advanced RAG System');
        try {
            const documents = [
                {
                    text: "MultiMind SDK is a comprehensive AI development toolkit that unifies fine-tuning, RAG, and agent orchestration.",
                    metadata: { type: "introduction", source: "docs" }
                },
                {
                    text: "The SDK supports advanced fine-tuning methods including LoRA, Adapters, and Prefix Tuning.",
                    metadata: { type: "features", source: "docs" }
                },
                {
                    text: "RAG capabilities include document processing, vector storage, and hybrid retrieval.",
                    metadata: { type: "features", source: "docs" }
                }
            ];
            await sdk.addDocumentsToRAG(documents);
            console.log('Documents added to RAG');
            const ragResponse = await sdk.queryAdvancedRAG({
                query: "What are the main features of MultiMind SDK?",
                topK: 3,
                includeMetadata: true
            });
            console.log('RAG Response:', ragResponse);
        }
        catch (error) {
            console.log('Advanced RAG failed:', error.message);
        }
        // 6. Model Conversion
        console.log('\n6. 🔄 Model Conversion');
        try {
            const conversionResult = await sdk.pytorchToONNX("./models/sample_model.pt", "./models/sample_model.onnx", {
                quantization: {
                    method: "int8",
                    targetDevice: "cpu"
                },
                graphOptimization: {
                    fuseOperations: true,
                    removeUnusedNodes: true,
                    optimizeMemory: true
                }
            });
            console.log('Model conversion result:', conversionResult);
        }
        catch (error) {
            console.log('Model conversion failed:', error.message);
        }
        // 7. Compliance Monitoring
        console.log('\n7. 🔒 Compliance Monitoring');
        try {
            const complianceResult = await sdk.checkCompliance({
                modelId: "model_123",
                dataCategories: ["text", "user_data"],
                useCase: "customer_support",
                region: "EU"
            });
            console.log('Compliance check result:', complianceResult);
        }
        catch (error) {
            console.log('Compliance check failed:', error.message);
        }
        // 8. Advanced Agent with Tools
        console.log('\n8. 🛠️ Advanced Agent with Tools');
        try {
            const agentResponse = await sdk.runAdvancedAgent("Calculate 15 * 23 and then search for information about quantum computing", { context: "mathematical and scientific inquiry" });
            console.log('Advanced Agent Response:', agentResponse);
        }
        catch (error) {
            console.log('Advanced agent failed:', error.message);
        }
        // 9. Model Client System
        console.log('\n9. 🧠 Model Client System');
        try {
            // LSTM Model Client
            const lstmClient = await sdk.createLSTMModelClient({
                modelPath: "./models/lstm_model.pt",
                modelName: "custom_lstm",
                maxLength: 512,
                temperature: 0.7
            });
            console.log('LSTM client created');
            // MoE Model Client
            const moeClient = await sdk.createMoEModelClient({
                experts: {
                    "expert1": { modelName: "gpt-3.5-turbo" },
                    "expert2": { modelName: "claude-3" }
                },
                router: (input) => input.length > 100 ? "expert2" : "expert1",
                loadBalancing: true
            });
            console.log('MoE client created');
            // MultiModal Client
            const mmClient = await sdk.createMultiModalClient({
                textClient: lstmClient,
                fusionStrategy: "attention"
            });
            console.log('MultiModal client created');
        }
        catch (error) {
            console.log('Model client system failed:', error.message);
        }
        // 10. Gateway API
        console.log('\n10. 🌐 Gateway API');
        try {
            const gatewayResult = await sdk.startGateway({
                host: "0.0.0.0",
                port: 8000,
                enableMiddleware: true,
                corsEnabled: true,
                rateLimit: 100
            });
            console.log('Gateway started:', gatewayResult);
            // Stop gateway after demo
            setTimeout(async () => {
                await sdk.stopGateway();
                console.log('Gateway stopped');
            }, 5000);
        }
        catch (error) {
            console.log('Gateway failed:', error.message);
        }
        // 11. Model Evaluation
        console.log('\n11. 📈 Model Evaluation');
        try {
            const evaluation = await sdk.evaluateModel({
                model: "gpt-3.5-turbo",
                task: "text-generation",
                dataset: "test-dataset",
                metrics: ["perplexity", "accuracy", "f1"]
            });
            console.log('Model evaluation:', evaluation);
        }
        catch (error) {
            console.log('Model evaluation failed:', error.message);
        }
        // 12. Model Comparison
        console.log('\n12. ⚖️ Model Comparison');
        try {
            const comparison = await sdk.compareModels(["gpt-3.5-turbo", "claude-3", "mistral"], "text-classification", "benchmark-dataset");
            console.log('Model comparison:', comparison);
        }
        catch (error) {
            console.log('Model comparison failed:', error.message);
        }
        console.log('\n✅ Comprehensive demo completed successfully!');
    }
    catch (error) {
        console.error('❌ Demo failed:', error);
    }
    finally {
        await sdk.close();
        console.log('\n🔚 SDK closed');
    }
}
// Run the comprehensive demo
comprehensiveDemo().catch(console.error);
//# sourceMappingURL=comprehensive-demo.js.map