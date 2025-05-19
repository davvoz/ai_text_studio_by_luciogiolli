/**
 * HuggingFaceProvider - Implementation of ProviderStrategy for Hugging Face API
 */
import ProviderStrategy from './ProviderStrategy.js';

export default class HuggingFaceProvider extends ProviderStrategy {
    /**
     * Get completions from Hugging Face LLM
     * @param {Array} messages - Array of message objects with role and content
     * @param {Object} apiConfig - Hugging Face API configuration
     * @returns {Promise<Object>} - Response from Hugging Face
     */
    async getCompletions(messages, apiConfig) {
        try {
            if (!apiConfig.token) {
                throw new Error('Hugging Face API token is required');
            }

            const token = apiConfig.token.trim();
            const userMessage = messages[messages.length - 1];
            const systemMessage = messages.find(msg => msg.role === 'system');
            
            const endpoint = apiConfig.endpoint || 
                    `https://api-inference.huggingface.co/models/${apiConfig.model || 'mistralai/Mistral-7B-Instruct-v0.2'}`;
            
            console.log(`Using model endpoint: ${endpoint}`);
            console.log(`Token length: ${token.length} characters`);
            
            let prompt = '';
            if (systemMessage) {
                prompt += `System: ${systemMessage.content}\n\n`;
            }
            
            for (let i = 0; i < messages.length - 1; i++) {
                const msg = messages[i];
                if (msg.role !== 'system') {
                    prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n\n`;
                }
            }
            
            prompt += `User: ${userMessage.content}\n\nAssistant: `;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
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
                if (response.status === 401) {
                    throw new Error(`Autenticazione fallita. Assicurati di utilizzare un token di INFERENZA API Hugging Face, non un token di accesso utente standard. Error: ${response.status} ${errorText}`);
                } else if (response.status === 404) {
                    throw new Error(`Modello non trovato: "${apiConfig.model}". Verifica che il nome del modello sia corretto o scegli un altro modello.`);
                } else if (response.status === 503) {
                    throw new Error(`Il modello "${apiConfig.model}" non è attualmente disponibile. Potrebbe essere in fase di caricamento o non più supportato. Prova con un altro modello.`);
                } else {
                    throw new Error(`Errore API Hugging Face: ${response.status} ${errorText}`);
                }
            }

            const data = await response.json();
            
            let generatedText = '';
            if (Array.isArray(data) && data.length > 0) {
                generatedText = data[0]?.generated_text || '';
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
            
            const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            if (isDevelopment) {
                console.warn('Using fallback response due to API error');
                return {
                    role: "assistant",
                    content: "**API Error:** Unable to generate content. Please check your API configuration. The specific error was: " + error.message
                };
            }
            
            throw error;
        }
    }
    
    /**
     * Check if a specific Hugging Face model is available
     * @param {string} modelId - The model ID to check
     * @param {string} token - Hugging Face API token
     * @returns {Promise<Object>} - Result of the check
     */
    async checkModelAvailability(modelId, token) {
        if (!modelId || !token) {
            return { available: false, error: 'Model ID and token are required' };
        }
        
        const trimmedToken = token.trim();
        
        try {
            const inferenceEndpoint = `https://api-inference.huggingface.co/models/${modelId}`;
            
            const response = await fetch(inferenceEndpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${trimmedToken}`
                }
            });
            
            if (response.ok) {
                return { available: true };
            }
            
            const statusErrors = {
                401: {
                    available: false, 
                    error: 'Token di inferenza API non valido. Assicurati di utilizzare un token di INFERENZA API Hugging Face, non un token di accesso utente standard.'
                },
                404: {
                    available: false, 
                    error: `Modello "${modelId}" non trovato. Verifica che l'ID del modello sia corretto.`
                },
                503: {
                    available: false,
                    error: `Il modello "${modelId}" non è attualmente disponibile. Potrebbe essere in fase di caricamento o non più supportato.`
                }
            };
            
            return statusErrors[response.status] || { 
                available: false, 
                error: `Errore nella verifica del modello: ${response.status}`
            };
        } catch (error) {
            return { 
                available: false, 
                error: `Errore durante la verifica del modello: ${error.message}`
            };
        }
    }
}
