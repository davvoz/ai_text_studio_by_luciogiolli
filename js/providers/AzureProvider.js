/**
 * AzureProvider - Implementation of ProviderStrategy for Azure OpenAI Service
 */
import ProviderStrategy from './ProviderStrategy.js';

export default class AzureProvider extends ProviderStrategy {
    /**
     * Get completions from Azure OpenAI LLM
     * @param {Array} messages - Array of message objects with role and content
     * @param {Object} apiConfig - Azure API configuration
     * @returns {Promise<Object>} - Response from Azure
     */
    async getCompletions(messages, apiConfig) {
        try {
            if (!apiConfig.token || !apiConfig.endpoint) {
                throw new Error('Azure API token and endpoint are required');
            }

            const response = await fetch(`${apiConfig.endpoint}/openai/deployments/${apiConfig.model}/chat/completions?api-version=2023-05-15`, {
                method: 'POST',
                headers: {
                    'api-key': apiConfig.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: messages,
                    max_tokens: 1024,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Azure API error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            
            return {
                role: "assistant",
                content: data.choices?.[0]?.message?.content || 'No response generated'
            };
        } catch (error) {
            console.error('Error calling Azure API:', error);
            throw error;
        }
    }
}
