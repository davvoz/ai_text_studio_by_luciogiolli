/**
 * GitHubProvider - Implementation of ProviderStrategy for GitHub Models API
 */
import ProviderStrategy from './ProviderStrategy.js';

export default class GitHubProvider extends ProviderStrategy {
    /**
     * Get completions from GitHub Models LLM
     * @param {Array} messages - Array of message objects with role and content
     * @param {Object} apiConfig - GitHub API configuration
     * @returns {Promise<Object>} - Response from GitHub Models
     */
    async getCompletions(messages, apiConfig) {
        try {
            if (!apiConfig.token) {
                throw new Error('GitHub API token is required');
            }

            const token = apiConfig.token.trim();
            const endpoint = 'https://models.github.ai/inference/chat/completions';
            const modelName = apiConfig.model || 'openai/gpt-4o-mini';
            
            console.log(`Using GitHub model: ${modelName}`);
            
            // Use XMLHttpRequest as a workaround for CORS/OPTIONS issues
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', endpoint, true);
                xhr.setRequestHeader('Accept', 'application/vnd.github+json');
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                xhr.setRequestHeader('X-GitHub-Api-Version', '2022-11-28');
                xhr.setRequestHeader('Content-Type', 'application/json');
                
                const data = {
                    model: modelName,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1024
                };
                
                xhr.onload = function() {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const responseData = JSON.parse(xhr.responseText);
                            console.log('GitHub completions API response:', responseData);
                            resolve({
                                role: "assistant",
                                content: responseData.choices?.[0]?.message?.content || 'No response generated'
                            });
                        } catch (error) {
                            console.error('Error parsing GitHub API response:', error, xhr.responseText);
                            reject(new Error(`Error parsing GitHub API response: ${error.message}`));
                        }
                    } else if (xhr.status === 401) {
                        console.error('GitHub API authorization error:', xhr.responseText);
                        reject(new Error(`Autenticazione fallita. Verifica il tuo token GitHub. Error: ${xhr.status}`));
                    } else if (xhr.status === 404) {
                        console.error('GitHub API model not found:', xhr.responseText);
                        reject(new Error(`Modello non trovato: "${modelName}". Verifica che il nome del modello sia corretto o scegli un altro modello.`));
                    } else {
                        console.error('GitHub API error response:', xhr.status, xhr.responseText);
                        reject(new Error(`Errore API GitHub: ${xhr.status} ${xhr.responseText}`));
                    }
                };
                
                xhr.onerror = function() {
                    reject(new Error('Errore di connessione all\'API GitHub. Verifica la tua connessione di rete.'));
                };
                
                xhr.send(JSON.stringify(data));
            });
        } catch (error) {
            console.error('Error calling GitHub Models API:', error);
            throw error;
        }
    }

    /**
     * Get available GitHub Models
     * @param {string} token - GitHub API token
     * @returns {Promise<Object>} - Result containing available models
     */
    async getAvailableModels(token) {
        if (!token) {
            return { success: false, error: 'GitHub API token is required' };
        }
        
        try {
            console.log('Getting available GitHub models with token');
            const endpoint = 'https://models.github.ai/catalog/models';
            
            console.log('Fetching from endpoint:', endpoint);
            
            // Use XMLHttpRequest as a workaround for CORS/OPTIONS issues
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', endpoint, true);
                xhr.setRequestHeader('Accept', 'application/vnd.github+json');
                xhr.setRequestHeader('Authorization', `Bearer ${token.trim()}`);
                xhr.setRequestHeader('X-GitHub-Api-Version', '2022-11-28');
                
                xhr.onload = function() {
                    console.log('GitHub models API response status:', xhr.status);
                    
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const modelsData = JSON.parse(xhr.responseText);
                            console.log('GitHub models API response successful, received models:', modelsData);
                            
                            // Formatta i modelli per l'uso nell'interfaccia utente
                            const formattedModels = modelsData.map(model => ({
                                value: model.id,
                                name: model.name || model.id,
                                publisher: model.publisher,
                                summary: model.summary,
                                tags: model.tags
                            }));
                            
                            resolve({ 
                                success: true, 
                                models: modelsData,
                                formattedModels: formattedModels
                            });
                        } catch (error) {
                            console.error('Error parsing GitHub models API response:', error);
                            reject(new Error(`Error parsing GitHub models API response: ${error.message}`));
                        }
                    } else if (xhr.status === 401) {
                        console.error('GitHub models API authorization error:', xhr.responseText);
                        resolve({ 
                            success: false, 
                            error: 'Token GitHub non valido. Verifica le tue credenziali.'
                        });
                    } else {
                        console.error('GitHub models API error response:', xhr.status, xhr.responseText);
                        resolve({ 
                            success: false, 
                            error: `Errore API GitHub: ${xhr.status}. Verifica che il token e le impostazioni siano corretti.`
                        });
                    }
                };
                
                xhr.onerror = function() {
                    console.error('GitHub models API request failed');
                    resolve({ 
                        success: false, 
                        error: 'Errore di connessione all\'API GitHub. Verifica la tua connessione di rete.'
                    });
                };
                
                xhr.send();
            });
        } catch (error) {
            return { 
                success: false, 
                error: `Error retrieving models: ${error.message}`
            };
        }
    }
}
