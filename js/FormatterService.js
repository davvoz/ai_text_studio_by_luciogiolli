
import UtilityService from "./UtilityService.js";
import CONFIG from "./CONFIG.js";
import LLMAgnostic from "./LLMAgnostic.js";

/**
 * FormatterService - Handles text formatting functionality
 */
class FormatterService {
    constructor(notificationService, outputManager, settingsManager) {
        this.notificationService = notificationService;
        this.outputManager = outputManager;
        this.settingsManager = settingsManager;

        // Initialize state
        this.selectedStyle = 'social';
        this.conversationHistory = [];

        // Cache DOM elements
        this.userTextArea = UtilityService.getElementById('userText');
        this.formatBtn = UtilityService.getElementById('formatBtn');
        this.styleButtons = UtilityService.querySelectorAll('.style-btn');
        this.loader = UtilityService.getElementById('loader');
    }

    /**
     * Initialize formatter UI and events
     */
    initialize() {
        if (!this.formatBtn || !this.userTextArea) {
            console.error('Required formatter elements not found');
            return;
        }        // Setup style buttons
        if (this.styleButtons) {
            this.styleButtons.forEach(button => {
                button.addEventListener('click', () => {
                    this.styleButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    this.selectedStyle = button.dataset.style;
                    
                    // Show visual feedback
                    button.classList.add('pulse');
                    setTimeout(() => {
                        button.classList.remove('pulse');
                    }, 500);
                });
            });
            
            // Set the default active style
            const defaultStyleButton = Array.from(this.styleButtons).find(btn => btn.dataset.style === this.selectedStyle);
            if (defaultStyleButton) {
                defaultStyleButton.classList.add('active');
            }
        }

        // Setup format button
        this.formatBtn.addEventListener('click', () => {
            this.formatText();
        });
    }

    /**
     * Show processing state during formatting
     */
    showProcessingState() {
        if (this.loader) {
            this.loader.classList.remove('hidden');
            this.loader.style.display = 'flex';
        }

        if (this.formatBtn) {
            this.formatBtn.classList.add('processing');
            this.formatBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Formattazione...';
            this.formatBtn.disabled = true;
        }

        if (this.outputManager.markdownOutput) {
            this.outputManager.markdownOutput.style.filter = 'blur(3px)';
            this.outputManager.markdownOutput.innerHTML = '';
        }
    }

    /**
     * Reset processing state after formatting
     */
    resetProcessingState() {
        if (this.loader) {
            this.loader.classList.add('hidden');
        }

        if (this.formatBtn) {
            this.formatBtn.classList.remove('processing');
            this.formatBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Formatta';
            this.formatBtn.disabled = false;
        }
    }

    /**
     * Format text based on selected style
     */
    async formatText() {
        if (!this.userTextArea) return;

        const text = this.userTextArea.value.trim();
        if (!text) {
            this.notificationService.showNotification('Inserisci del testo da formattare.', 'error');
            return;
        }

        // Show processing state
        this.showProcessingState();

        try {
            // Get the appropriate prompt based on selected style
            const prompt = this.settingsManager.getFormatterPrompt(this.selectedStyle);

            const newMessage = {
                role: "user",
                content: `${prompt}\n\n${text}`
            };

            // Add the new message to conversation history
            this.conversationHistory.push(newMessage);

            // Only keep the last 5 messages to avoid token limits
            this.conversationHistory = this.conversationHistory.slice(-5);

            // Make the API call to the AI
            const completion = await LLMAgnostic.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are an expert formatter who transforms user text into well-structured, formatted content. You never add extra information or substantially change the meaning of the text. You support markdown formatting. Keep the same language as the input text."
                    },
                    ...this.conversationHistory
                ]
            });

            // Add AI response to conversation history
            this.conversationHistory.push(completion);

            // Display the formatted text
            this.outputManager.displayOutput(completion.content);        } catch (error) {
            console.error('Error formatting text:', error);
            
            let errorMessage = 'Impossibile formattare il testo. Riprova.';
            let errorDetails = '';
            
            // Try to parse detailed error information
            try {
                const errorInfo = JSON.parse(error.message);
                
                if (errorInfo.provider === 'openai') {
                    if (errorInfo.originalError.includes("does not exist or you do not have access")) {
                        // Handle specific OpenAI model access error
                        const modelName = errorInfo.model || 'GPT-4';
                        errorMessage = `Non hai accesso al modello ${modelName}.`;
                        errorDetails = `
                            <p>Possibili soluzioni:</p>
                            <ul>
                                <li>Verifica che la tua API key sia valida e abbia l'accesso al modello ${modelName}</li>
                                <li>Seleziona un modello diverso nelle impostazioni API (ad esempio GPT-3.5-Turbo)</li>
                                <li>Richiedi l'accesso al modello ${modelName} su OpenAI</li>
                            </ul>
                        `;
                    } else if (errorInfo.originalError.includes("Incorrect API key")) {
                        errorMessage = "API key di OpenAI non valida o scaduta.";
                        errorDetails = "Controlla le tue impostazioni API e genera una nuova API key se necessario.";
                    } else {
                        errorMessage = "Errore nell'API OpenAI.";
                        errorDetails = errorInfo.originalError;
                    }
                } else if (errorInfo.provider === 'huggingface') {
                    errorMessage = "Errore nell'API Hugging Face.";
                    errorDetails = errorInfo.originalError;
                } else {
                    errorMessage = `Errore nell'API ${errorInfo.provider || 'selezionata'}.`;
                    errorDetails = errorInfo.originalError;
                }
            } catch (parseError) {
                // If error isn't in our JSON format, use generic message
                errorDetails = error.message;
            }
            
            // Display error in the output
            if (this.outputManager.markdownOutput) {
                this.outputManager.markdownOutput.innerHTML = `
                    <div class="api-error">
                        <p><i class="fas fa-exclamation-triangle"></i> <strong>Errore:</strong> ${errorMessage}</p>
                        ${errorDetails ? `<div class="error-details">${errorDetails}</div>` : ''}
                    </div>`;
                this.outputManager.markdownOutput.style.filter = 'none';
            }
            
            // Show notification
            if (window.notificationService) {
                window.notificationService.showNotification(errorMessage, 'error');
            }
        } finally {
            // Reset processing state
            this.resetProcessingState();
        }    }
}

export default FormatterService;