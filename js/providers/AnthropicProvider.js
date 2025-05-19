/**
 * AnthropicProvider - Implementation of ProviderStrategy for Anthropic API
 */
import ProviderStrategy from './ProviderStrategy.js';

export default class AnthropicProvider extends ProviderStrategy {
    /**
     * Get completions from Anthropic LLM
     * @param {Array} messages - Array of message objects with role and content
     * @param {Object} apiConfig - Anthropic API configuration
     * @returns {Promise<Object>} - Response from Anthropic
     */
    async getCompletions(messages, apiConfig) {
        try {
            if (!apiConfig.token) {
                throw new Error('Anthropic API token is required');
            }

            const endpoint = apiConfig.endpoint || 'https://api.anthropic.com/v1/messages';
            
            const formattedMessages = messages.filter(msg => msg.role !== 'system').map(msg => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.content
            }));
            
            const systemMessage = messages.find(msg => msg.role === 'system');
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'x-api-key': apiConfig.token,
                    'anthropic-version': '2023-06-01',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: apiConfig.model || 'claude-2',
                    messages: formattedMessages,
                    system: systemMessage?.content,
                    max_tokens: 1024
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Anthropic API error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            
            return {
                role: "assistant",
                content: data.content?.[0]?.text || 'No response generated'
            };
        } catch (error) {
            console.error('Error calling Anthropic API:', error);
            throw error;
        }
    }
}
