
import UtilityService from "./UtilityService.js";
import CONFIG from "./CONFIG.js";
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
            this.outputManager.displayOutput(completion.content);

        } catch (error) {
            console.error('Error formatting text:', error);
            if (this.outputManager.markdownOutput) {
                this.outputManager.markdownOutput.innerHTML = `<p style="color: red;"><i class="fas fa-exclamation-triangle"></i> Errore: Impossibile formattare il testo. Riprova.</p>`;
                this.outputManager.markdownOutput.style.filter = 'none';
            }
        } finally {
            // Reset processing state
            this.resetProcessingState();
        }    }
}

export default FormatterService;