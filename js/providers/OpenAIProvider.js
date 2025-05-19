/**
 * OpenAIProvider - Implementation of ProviderStrategy for OpenAI API
 */
import ProviderStrategy from './ProviderStrategy.js';

export default class OpenAIProvider extends ProviderStrategy {
    /**
     * Get completions from OpenAI LLM
     * @param {Array} messages - Array of message objects with role and content
     * @param {Object} apiConfig - OpenAI API configuration
     * @returns {Promise<Object>} - Response from OpenAI
     */
    async getCompletions(messages, apiConfig) {
        try {
            if (!apiConfig.token) {
                throw new Error('OpenAI API token is required');
            }

            const endpoint = apiConfig.endpoint || 'https://api.openai.com/v1/chat/completions';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiConfig.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: apiConfig.model || 'gpt-3.5-turbo',
                    messages: messages,
                    max_tokens: 1024,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            
            return {
                role: "assistant",
                content: data.choices?.[0]?.message?.content || 'No response generated'
            };
        } catch (error) {
            console.error('Error calling OpenAI API:', error);
            throw error;
        }
    }
}
