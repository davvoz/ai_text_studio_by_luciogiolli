import UtilityService from "./UtilityService.js";
import CONFIG from "./CONFIG.js";
import LLMGateway from "./LLMGateway.js";
/**
 * GeneratorService - Handles text generation functionality
 */
class GeneratorService {    constructor(notificationService, outputManager, settingsManager) {
        this.notificationService = notificationService;
        this.outputManager = outputManager;
        this.settingsManager = settingsManager;

        // Initialize state
        this.selectedGenStyle = 'news';
        this.selectedLanguage = CONFIG.LANGUAGES.DEFAULT;
        this.selectedLength = 'medium'; // Default to medium length
        this.genConversationHistory = [];

        // Cache DOM elements
        this.genKeywordsArea = UtilityService.getElementById('genKeywords');
        this.generateBtn = UtilityService.getElementById('generateBtn');
        this.genStyleSelect = UtilityService.getElementById('genStyleSelect');
        this.languageSelect = UtilityService.getElementById('languageSelect');
        this.loader = UtilityService.getElementById('loader');
        this.customLanguageWrapper = UtilityService.getElementById('customLanguageWrapper');
        this.customLanguageInput = UtilityService.getElementById('customLanguage');
        
        // Length selection buttons
        this.lengthShortBtn = UtilityService.getElementById('lengthShort');
        this.lengthMediumBtn = UtilityService.getElementById('lengthMedium');
        this.lengthLongBtn = UtilityService.getElementById('lengthLong');
    }

    /**
     * Initialize generator UI and events
     */
    initialize() {
        if (!this.generateBtn || !this.genKeywordsArea) {
            console.error('Required generator elements not found');
            return;
        }

        // Setup style selection
        if (this.genStyleSelect) {
            this.genStyleSelect.addEventListener('change', () => {
                this.selectedGenStyle = this.genStyleSelect.value;
            });
        }

        // Setup language selection
        if (this.languageSelect && this.customLanguageWrapper && this.customLanguageInput) {
            this.languageSelect.addEventListener('change', () => {
                if (this.languageSelect.value === 'custom') {
                    // Show custom language input field
                    this.customLanguageWrapper.classList.remove('hidden');
                    // Focus the input for better UX
                    this.customLanguageInput.focus();
                    
                    // Update selectedLanguage only when custom input changes
                    this.customLanguageInput.addEventListener('input', () => {
                        const customLang = this.customLanguageInput.value.trim();
                        this.selectedLanguage = customLang 
                            ? `Response should be in ${customLang}.`
                            : CONFIG.LANGUAGES.OPTIONS['italian']; // Default to Italian if empty
                    });
                } else {
                    // Hide custom language input field
                    this.customLanguageWrapper.classList.add('hidden');
                    // Use predefined language from config
                    this.selectedLanguage = CONFIG.LANGUAGES.OPTIONS[this.languageSelect.value] || CONFIG.LANGUAGES.OPTIONS['italian'];
                }
            });
        }

        // Setup length selection buttons
        this.setupLengthButtons();

        // Setup generate button
        this.generateBtn.addEventListener('click', () => {
            this.generateText();
        });
    }
    
    /**
     * Setup length selection buttons
     */
    setupLengthButtons() {
        if (!this.lengthShortBtn || !this.lengthMediumBtn || !this.lengthLongBtn) {
            console.warn('Length selection buttons not found');
            return;
        }
        
        const lengthButtons = [this.lengthShortBtn, this.lengthMediumBtn, this.lengthLongBtn];
        
        // Add click event listeners to all length buttons
        lengthButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                lengthButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Update selected length
                this.selectedLength = button.dataset.length;
            });
        });
    }

    /**
     * Show processing state during generation
     */
    showProcessingState() {
        if (this.loader) {
            this.loader.classList.remove('hidden');
            this.loader.style.display = 'flex';
        }

        if (this.generateBtn) {
            this.generateBtn.classList.add('processing');
            this.generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generazione...';
            this.generateBtn.disabled = true;
        }

        if (this.outputManager.markdownOutput) {
            this.outputManager.markdownOutput.style.filter = 'blur(3px)';
            this.outputManager.markdownOutput.innerHTML = '';
        }
    }

    /**
     * Reset processing state after generation
     */
    resetProcessingState() {
        if (this.loader) {
            this.loader.classList.add('hidden');
        }

        if (this.generateBtn) {
            this.generateBtn.classList.remove('processing');
            this.generateBtn.innerHTML = '<i class="fas fa-robot"></i> Genera testo';
            this.generateBtn.disabled = false;
        }
    }    /**
     * Get the appropriate length instruction based on selected length
     * @param {string} length - Selected length ('short', 'medium', or 'long')
     * @returns {string} - The corresponding length instruction
     */
    getLengthInstruction(length) {
        switch (length) {
            case 'short':
                return 'Please keep the response concise and brief, approximately 150-250 words.';
            case 'medium':
                return 'Please provide a moderate-length response, approximately 400-600 words.';
            case 'long':
                return 'Please provide a detailed and comprehensive response, approximately 800-1200 words.';
            default:
                return 'Please provide a moderate-length response, approximately 400-600 words.';
        }
    }

    /**
     * Generate text based on keywords and selected style
     */
    async generateText() {
        if (!this.genKeywordsArea) return;

        const keywords = this.genKeywordsArea.value.trim();
        if (!keywords) {
            this.notificationService.showNotification('Inserisci delle parole chiave o un argomento.', 'error');
            return;
        }

        // Show processing state
        this.showProcessingState();

        try {
            // Get the appropriate prompt
            const prompt = this.settingsManager.getGeneratorPrompt(this.selectedGenStyle);
            const languageInstruction = this.selectedLanguage || CONFIG.LANGUAGES.OPTIONS['italian'];
            
            // Get length instruction based on selected length
            const lengthInstruction = this.getLengthInstruction(this.selectedLength);
            
            // Create the full prompt with language and length instructions
            const fullPrompt = `${prompt}\n\n${keywords}\n\n${languageInstruction}\n\n${lengthInstruction}`;
            
            const newMessage = {
                role: "user",
                content: fullPrompt
            };
            
            // Add the new message to conversation history
            this.genConversationHistory.push(newMessage);
            
            // Only keep the last 5 messages to avoid token limits
            this.genConversationHistory = this.genConversationHistory.slice(-5);
            
            // Make the API call to the AI
            const completion = await LLMGateway.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are an expert content generator who creates engaging and informative text based on user input. You support markdown formatting for headings, lists, emphasis, links, etc. IMPORTANT: Do not wrap your entire response in a code block with triple backticks (```). Apply markdown formatting directly to the text. Keep the same language as the input text. Strictly follow any length instructions provided in the prompt."
                    },
                    ...this.genConversationHistory
                ]
            });
            
            // Add AI response to conversation history
            this.genConversationHistory.push(completion);
            
            // Clean any code blocks that wrap the entire output
            let cleanContent = completion.content;
            
            // Remove markdown code blocks that wrap the entire output
            const codeBlockRegex = /^```(?:markdown)?\s*([\s\S]*?)```$/;
            const match = cleanContent.trim().match(codeBlockRegex);
            if (match) {
                console.log("Trovato blocco di codice che avvolge l'intero output, rimuovendo i delimitatori...");
                cleanContent = match[1];
            }
            
            // Display the generated text
            this.outputManager.displayOutput(cleanContent);
        } catch (error) {
            console.error('Error generating text:', error);
            
            let errorMessage = 'Impossibile generare il testo. Riprova.';
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

export default GeneratorService;