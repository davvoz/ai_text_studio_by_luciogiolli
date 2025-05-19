/**
 * ProviderStrategy - Base interface for all LLM providers
 * This class defines the contract that all provider implementations must follow
 */
export default class ProviderStrategy {
    /**
     * Get completions from the provider's LLM
     * @param {Array} messages - Array of message objects with role and content
     * @param {Object} apiConfig - Provider configuration
     * @returns {Promise<Object>} - Result containing the model's response
     */
    async getCompletions(messages, apiConfig) {
        throw new Error('getCompletions method must be implemented');
    }
}
