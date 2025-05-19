/**
 * LLMGateway - API client for multiple AI model providers
 * This class provides a unified interface for interacting with different language model APIs
 */

import ProviderFactory from './providers/ProviderFactory.js';

class LLMGateway {
    static #apiConfig = {
        provider: 'mock', // default to mock
        token: '',
        model: '',
        endpoint: ''
    };

    /**
     * Configure the API settings
     * @param {Object} config - Configuration object
     * @param {string} config.provider - API provider (huggingface, openai, azure, mock, etc.)
     * @param {string} config.token - API token
     * @param {string} config.model - Model name for the provider
     * @param {string} config.endpoint - Custom endpoint URL if needed
     */
    static configure(config) {
        if (config) {
            this.#apiConfig = { ...this.#apiConfig, ...config };
        }
    }
    
    /**
     * Get current configuration
     * @returns {Object} Current API configuration
     */
    static getConfig() {
        return { ...this.#apiConfig };
    }
    
    static chat = {
        completions: {
            create: async ({ messages }) => {
                const apiConfig = LLMGateway.#apiConfig;
                const provider = ProviderFactory.getProvider(apiConfig.provider);
                  try {
                    return await provider.getCompletions(messages, apiConfig);
                } catch (error) {
                    console.error(`Error in ${apiConfig.provider} completions:`, error);
                    
                    // Instead of falling back to mock, propagate the error with additional info
                    const errorMsg = {
                        provider: apiConfig.provider,
                        model: apiConfig.model,
                        originalError: error.message,
                        content: "Si è verificato un errore durante la comunicazione con l'API."
                    };
                    
                    throw new Error(JSON.stringify(errorMsg));
                }
            }
        }
    };
}

export default LLMGateway;
