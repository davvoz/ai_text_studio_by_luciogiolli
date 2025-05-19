/**
 * ProviderFactory - Factory for creating instances of LLM providers
 */
import MockProvider from './MockProvider.js';
import HuggingFaceProvider from './HuggingFaceProvider.js';
import OpenAIProvider from './OpenAIProvider.js';
import AzureProvider from './AzureProvider.js';
import AnthropicProvider from './AnthropicProvider.js';
import GitHubProvider from './GitHubProvider.js';

export default class ProviderFactory {
    /**
     * Get a provider instance based on the provider name
     * @param {string} providerName - Name of the provider to create
     * @returns {ProviderStrategy} - A provider instance
     */
    static getProvider(providerName) {
        const providers = {
            'mock': new MockProvider(),
            'huggingface': new HuggingFaceProvider(),
            'openai': new OpenAIProvider(),
            'azure': new AzureProvider(),
            'anthropic': new AnthropicProvider(),
            'github': new GitHubProvider()
        };
        
        return providers[providerName] || providers['mock'];
    }
}
