import UtilityService from "./UtilityService.js";
import CONFIG from "./CONFIG.js";
import LLMAgnostic from "./LLMAgnostic.js";
/**
 * GeneratorService - Handles text generation functionality
 */
class GeneratorService {
    constructor(notificationService, outputManager, settingsManager) {
        this.notificationService = notificationService;
        this.outputManager = outputManager;
        this.settingsManager = settingsManager;

        // Initialize state
        this.selectedGenStyle = 'news';
        this.selectedLanguage = CONFIG.LANGUAGES.DEFAULT;
        this.genConversationHistory = [];

        // Cache DOM elements
        this.genKeywordsArea = UtilityService.getElementById('genKeywords');
        this.generateBtn = UtilityService.getElementById('generateBtn');
        this.genStyleSelect = UtilityService.getElementById('genStyleSelect');
        this.languageSelect = UtilityService.getElementById('languageSelect');
        this.loader = UtilityService.getElementById('loader');
        this.customLanguageWrapper = UtilityService.getElementById('customLanguageWrapper');
        this.customLanguageInput = UtilityService.getElementById('customLanguage');
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

        // Setup generate button
        this.generateBtn.addEventListener('click', () => {
            this.generateText();
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

        try {            // Get the appropriate prompt
            const prompt = this.settingsManager.getGeneratorPrompt(this.selectedGenStyle);
            const languageInstruction = this.selectedLanguage || CONFIG.LANGUAGES.OPTIONS['italian'];
            
            // Create the full prompt with language instruction
            const fullPrompt = `${prompt}\n\n${keywords}\n\n${languageInstruction}`;
            
            const newMessage = {
                role: "user",
                content: fullPrompt
            };
            // Add the new message to conversation history
            this.genConversationHistory.push(newMessage);
            // Only keep the last 5 messages to avoid token limits
            this.genConversationHistory = this.genConversationHistory.slice(-5);
            // Make the API call to the AI
            const completion = await LLMAgnostic.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are an expert content generator who creates engaging and informative text based on user input. You never add extra information or substantially change the meaning of the text. You support markdown formatting. Keep the same language as the input text."
                    },
                    ...this.genConversationHistory
                ]
            });
            // Add AI response to conversation history
            this.genConversationHistory.push(completion);
            // Display the generated text
            this.outputManager.displayOutput(completion.content);
        }
        catch (error) {
            console.error('Error generating text:', error);
            if (this.outputManager.markdownOutput) {
                this.outputManager.markdownOutput.innerHTML = `<p style="color: red;"><i class="fas fa-exclamation-triangle"></i> Errore: Impossibile generare il testo. Riprova.</p>`;
                this.outputManager.markdownOutput.style.filter = 'none';
            }
        } finally {
            // Reset processing state
            this.resetProcessingState();
        }    }
}

export default GeneratorService;