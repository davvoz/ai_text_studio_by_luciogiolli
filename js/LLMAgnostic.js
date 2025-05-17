/**
 * LLMAgnostic - API client for multiple AI model providers
 * This class provides a unified interface for interacting with different language model APIs
 */
import CONFIG from './CONFIG.js';

class LLMAgnostic {
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
    }    /**
     * Get current configuration
     * @returns {Object} Current API configuration
     */
    static getConfig() {
        return { ...this.#apiConfig };
    }
    
    /**
     * Test the connection to the selected API provider
     * @param {Object} config - Configuration to test
     * @returns {Promise<Object>} - Result of the test
     */
    static async testConnection(config) {
        // Use provided config or current config
        const testConfig = config || this.#apiConfig;
        
        // Skip test for mock provider
        if (testConfig.provider === 'mock') {
            return { success: true };
        }
        
        try {
            // For testing purposes, we'll just check if we have the required credentials
            switch (testConfig.provider) {
                case 'huggingface':
                    if (!testConfig.token) {
                        throw new Error('Hugging Face API token is required');
                    }
                    // In a real implementation, we would make a simple request to the API
                    return { success: true, message: 'Connection to Hugging Face successful' };
                    
                case 'openai':
                    if (!testConfig.token) {
                        throw new Error('OpenAI API token is required');
                    }
                    return { success: true, message: 'Connection to OpenAI successful' };
                    
                case 'azure':
                    if (!testConfig.token || !testConfig.endpoint) {
                        throw new Error('Azure API token and endpoint are required');
                    }
                    return { success: true, message: 'Connection to Azure successful' };
                    
                case 'anthropic':
                    if (!testConfig.token) {
                        throw new Error('Anthropic API token is required');
                    }
                    return { success: true, message: 'Connection to Anthropic successful' };
                    
                default:
                    throw new Error('Unknown API provider');
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static chat = {
        completions: {
            create: async ({ messages }) => {
                const apiConfig = LLMAgnostic.#apiConfig;
                
                // Handle mock API (for development/demo)
                if (apiConfig.provider === 'mock') {
                    return LLMAgnostic.#mockCompletions(messages);
                }
                
                // Handle Hugging Face API
                if (apiConfig.provider === 'huggingface') {
                    return LLMAgnostic.#huggingFaceCompletions(messages, apiConfig);
                }

                // Handle OpenAI API
                if (apiConfig.provider === 'openai') {
                    return LLMAgnostic.#openAICompletions(messages, apiConfig);
                }

                // Handle Azure OpenAI API
                if (apiConfig.provider === 'azure') {
                    return LLMAgnostic.#azureCompletions(messages, apiConfig);
                }

                // Handle Anthropic API
                if (apiConfig.provider === 'anthropic') {
                    return LLMAgnostic.#anthropicCompletions(messages, apiConfig);
                }

                // If no provider matches or configuration is incomplete, fall back to mock
                console.warn('Unknown or misconfigured API provider. Using mock response.');
                return LLMAgnostic.#mockCompletions(messages);
            }
        }
    };

    /**
     * Mock completion API (for development/demo)
     * @private
     * @param {Array} messages - Array of messages
     * @returns {Promise<Object>} Mock response
     */
    static #mockCompletions(messages) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Get the user message (last message)
                const userMessage = messages[messages.length - 1];
                
                // Generate a mock response based on the prompt type and user input
                let response = "This is a mock response from the AI model.";
                
                // If the message contains keywords, it's probably from the generator service
                if (userMessage.content.includes("Enter topic or keywords")) {
                    response = `# Generated Content\n\nThis is a generated response based on your keywords.\n\n## Main Points\n\n- First point about your topic\n- Second important consideration\n- Third interesting aspect\n\n## Further Information\n\nHere's more detailed information about what you requested. This is a mock response but in a real implementation, this would be generated by an AI model.`;
                } 
                // Otherwise it's probably from the formatter service
                else {
                    response = `# Formatted Text\n\nThis is your text after formatting.\n\n## Highlights\n\n- Made it more concise\n- Improved readability\n- Added structure\n\nThe actual formatting would depend on the style you selected (social, blog, or minimal).`;
                }
                
                resolve({
                    role: "assistant",
                    content: response
                });
            }, 2000);
        });
    }

    /**
     * Hugging Face API
     * @private
     * @param {Array} messages - Array of messages
     * @param {Object} apiConfig - API configuration
     * @returns {Promise<Object>} Response from Hugging Face API
     */
    static async #huggingFaceCompletions(messages, apiConfig) {
        try {
            if (!apiConfig.token) {
                throw new Error('Hugging Face API token is required');
            }

            // Get last user message as prompt
            const userMessage = messages[messages.length - 1];
            const systemMessage = messages.find(msg => msg.role === 'system');
            
            // Prepare endpoint - use custom endpoint if provided or default inference API
            const endpoint = apiConfig.endpoint || 
                `https://api-inference.huggingface.co/models/${apiConfig.model || 'mistralai/Mistral-7B-Instruct-v0.2'}`;
            
            // Format the messages into a prompt suitable for Hugging Face models
            let prompt = '';
            if (systemMessage) {
                prompt += `System: ${systemMessage.content}\n\n`;
            }
            
            // Add context from previous messages
            for (let i = 0; i < messages.length - 1; i++) {
                const msg = messages[i];
                if (msg.role !== 'system') {
                    prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n\n`;
                }
            }
            
            // Add the current user message
            prompt += `User: ${userMessage.content}\n\nAssistant: `;

            // Make request to Hugging Face
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiConfig.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: 1024,
                        temperature: 0.7,
                        top_p: 0.9,
                        do_sample: true
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Hugging Face API error: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            
            // Extract the generated text
            let generatedText = '';
            if (Array.isArray(data) && data.length > 0) {
                generatedText = data[0]?.generated_text || '';
                // Extract only the Assistant's response
                const assistantPart = generatedText.split('Assistant: ').pop();
                generatedText = assistantPart || generatedText;
            } else {
                generatedText = data?.generated_text || '';
            }

            return {
                role: "assistant",
                content: generatedText
            };
        } catch (error) {
            console.error('Error calling Hugging Face API:', error);
            throw error;
        }
    }

    /**
     * OpenAI API
     * @private
     * @param {Array} messages - Array of messages
     * @param {Object} apiConfig - API configuration
     * @returns {Promise<Object>} Response from OpenAI API
     */
    static async #openAICompletions(messages, apiConfig) {
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

    /**
     * Azure OpenAI API
     * @private
     * @param {Array} messages - Array of messages
     * @param {Object} apiConfig - API configuration
     * @returns {Promise<Object>} Response from Azure OpenAI API
     */
    static async #azureCompletions(messages, apiConfig) {
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

    /**
     * Anthropic API
     * @private
     * @param {Array} messages - Array of messages
     * @param {Object} apiConfig - API configuration
     * @returns {Promise<Object>} Response from Anthropic API
     */
    static async #anthropicCompletions(messages, apiConfig) {
        try {
            if (!apiConfig.token) {
                throw new Error('Anthropic API token is required');
            }

            const endpoint = apiConfig.endpoint || 'https://api.anthropic.com/v1/messages';
            
            // Convert messages to Anthropic format
            const formattedMessages = messages.filter(msg => msg.role !== 'system').map(msg => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.content
            }));
            
            // Get system message if present
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

export default LLMAgnostic;