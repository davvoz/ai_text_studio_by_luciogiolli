import CONFIG from './CONFIG.js';
import UtilityService from './UtilityService.js';
import LLMAgnostic from './LLMAgnostic.js';
import NotificationService from './NotificationService.js';

/**
 * SettingsManager - Handles application settings and configuration
 */
class SettingsManager {
    constructor() {
        this.formatPrompts = { ...CONFIG.PROMPTS.FORMAT.DEFAULT };
        this.generatePrompts = { ...CONFIG.PROMPTS.GENERATE.DEFAULT };
        this.apiConfig = {
            provider: 'mock',
            token: '',
            model: '',
            endpoint: '',
            customModel: ''
        };

        // Settings panel elements
        this.configPanel = UtilityService.getElementById('configPanel');
        this.configToggle = UtilityService.getElementById('configToggle');
        this.closeSettings = UtilityService.getElementById('closeSettings');
        this.saveConfig = UtilityService.getElementById('saveConfig');
        this.configTabButtons = UtilityService.querySelectorAll('.config-tab-btn');
        this.configContents = UtilityService.querySelectorAll('.config-content');

        // Prompt config elements
        this.socialPrompt = UtilityService.getElementById('socialPrompt');
        this.blogPrompt = UtilityService.getElementById('blogPrompt');
        this.minimalPrompt = UtilityService.getElementById('minimalPrompt');
        this.newsPrompt = UtilityService.getElementById('newsPrompt');
        this.blogGenPrompt = UtilityService.getElementById('blogGenPrompt');
        this.essayPrompt = UtilityService.getElementById('essayPrompt');
        this.diaryPrompt = UtilityService.getElementById('diaryPrompt');
        this.storyPrompt = UtilityService.getElementById('storyPrompt');
    }    /**
     * Load saved settings from local storage
     */
    loadSavedSettings() {
        // Load formatting prompts
        const savedPrompts = UtilityService.loadFromLocalStorage(
            CONFIG.PROMPTS.FORMAT.STORAGE_KEY,
            this.formatPrompts
        );

        if (savedPrompts) {
            this.formatPrompts = savedPrompts;

            // Update textarea values if elements exist
            if (this.socialPrompt) this.socialPrompt.value = savedPrompts.social;
            if (this.blogPrompt) this.blogPrompt.value = savedPrompts.blog;
            if (this.minimalPrompt) this.minimalPrompt.value = savedPrompts.minimal;
        } else {
            // Use default prompts
            if (this.socialPrompt) this.socialPrompt.value = CONFIG.PROMPTS.FORMAT.DEFAULT.social;
            if (this.blogPrompt) this.blogPrompt.value = CONFIG.PROMPTS.FORMAT.DEFAULT.blog;
            if (this.minimalPrompt) this.minimalPrompt.value = CONFIG.PROMPTS.FORMAT.DEFAULT.minimal;
        }

        // Load generation prompts
        const savedGenPrompts = UtilityService.loadFromLocalStorage(
            CONFIG.PROMPTS.GENERATE.STORAGE_KEY,
            this.generatePrompts
        );

        if (savedGenPrompts) {
            this.generatePrompts = savedGenPrompts;

            // Update textarea values if elements exist
            if (this.newsPrompt) this.newsPrompt.value = savedGenPrompts.news;
            if (this.blogGenPrompt) this.blogGenPrompt.value = savedGenPrompts.blog;
            if (this.essayPrompt) this.essayPrompt.value = savedGenPrompts.essay;
            if (this.diaryPrompt) this.diaryPrompt.value = savedGenPrompts.diary;
            if (this.storyPrompt) this.storyPrompt.value = savedGenPrompts.story;
        } else {
            // Use default prompts
            if (this.newsPrompt) this.newsPrompt.value = CONFIG.PROMPTS.GENERATE.DEFAULT.news;
            if (this.blogGenPrompt) this.blogGenPrompt.value = CONFIG.PROMPTS.GENERATE.DEFAULT.blog;
            if (this.essayPrompt) this.essayPrompt.value = CONFIG.PROMPTS.GENERATE.DEFAULT.essay;
            if (this.diaryPrompt) this.diaryPrompt.value = CONFIG.PROMPTS.GENERATE.DEFAULT.diary;
            if (this.storyPrompt) this.storyPrompt.value = CONFIG.PROMPTS.GENERATE.DEFAULT.story;
        }
        
        // Load API configuration
        const savedApiConfig = UtilityService.loadFromLocalStorage(
            CONFIG.API.STORAGE_KEY,
            this.apiConfig
        );
        
        if (savedApiConfig) {
            this.apiConfig = savedApiConfig;
            
            // Configure LLMAgnostic with the loaded API settings
            this.configureAPI(savedApiConfig);
        }
    }    /**
     * Save current settings to local storage
     */
    saveSettings() {
        // Update format prompts object from UI inputs
        if (this.socialPrompt) this.formatPrompts.social = this.socialPrompt.value;
        if (this.blogPrompt) this.formatPrompts.blog = this.blogPrompt.value;
        if (this.minimalPrompt) this.formatPrompts.minimal = this.minimalPrompt.value;

        // Update generation prompts object from UI inputs
        if (this.newsPrompt) this.generatePrompts.news = this.newsPrompt.value;
        if (this.blogGenPrompt) this.generatePrompts.blog = this.blogGenPrompt.value;
        if (this.essayPrompt) this.generatePrompts.essay = this.essayPrompt.value;
        if (this.diaryPrompt) this.generatePrompts.diary = this.diaryPrompt.value;
        if (this.storyPrompt) this.generatePrompts.story = this.storyPrompt.value;

        // Save to localStorage
        UtilityService.saveToLocalStorage(CONFIG.PROMPTS.FORMAT.STORAGE_KEY, this.formatPrompts);
        UtilityService.saveToLocalStorage(CONFIG.PROMPTS.GENERATE.STORAGE_KEY, this.generatePrompts);

        return true;
    }
    
    /**
     * Save API configuration to local storage and apply it
     * @param {Object} config - API configuration
     */    saveApiConfig(config) {
        if (!config) return;
        
        // Ensure the token is trimmed to prevent whitespace issues
        if (config.token) {
            config.token = config.token.trim();
        }
        
        // Update API config
        this.apiConfig = { ...this.apiConfig, ...config };
        
        // Save to localStorage
        UtilityService.saveToLocalStorage(CONFIG.API.STORAGE_KEY, this.apiConfig);
        
        // Configure the LLMAgnostic with the new settings
        this.configureAPI(this.apiConfig);
        
        return true;
    }
    
    /**
     * Configure the LLMAgnostic with API settings
     * @param {Object} config - API configuration
     */    configureAPI(config) {
        if (!config) return;
        
        const llmConfig = {
            provider: config.provider,
            token: config.token ? config.token.trim() : '',
            endpoint: config.endpoint
        };
        
        // Use custom model if that option is selected
        if (config.model === 'custom' && config.customModel) {
            llmConfig.model = config.customModel;
        } else {
            llmConfig.model = config.model;
        }
        
        // Configure LLMAgnostic
        LLMAgnostic.configure(llmConfig);
    }
    
    /**
     * Test API connection with given configuration
     * @param {Object} config - API configuration to test
     * @returns {Promise<Object>} - Result of the test
     */
    async testApiConnection(config) {
        try {
            if (!config) {
                return { success: false, error: 'No configuration provided' };
            }
            
            // Skip testing for mock provider
            if (config.provider === 'mock') {
                return { success: true };
            }
            
            // Check if token is provided for providers that require it
            const providerConfig = CONFIG.API.PROVIDERS[config.provider];
            if (providerConfig && providerConfig.tokenRequired && !config.token) {
                return { success: false, error: 'API token is required' };
            }            // Configure LLMAgnostic with the test config
            const llmConfig = {
                provider: config.provider,
                token: config.token ? config.token.trim() : '',
                endpoint: config.endpoint
            };
            
            // Use custom model if that option is selected
            if (config.model === 'custom' && config.customModel) {
                llmConfig.model = config.customModel;
            } else {
                llmConfig.model = config.model;
            }
              // Test the connection by sending a simple request
            try {
                // Per GitHub, usa un metodo specifico per testare la connessione
                if (config.provider === 'github') {
                    return await LLMAgnostic.testGitHubConnection(llmConfig.token);
                }
                
                // Per altri provider, usa il metodo standard
                const testResult = await LLMAgnostic.testConnection(llmConfig);
                return testResult;
            } catch (error) {
                return { success: false, error: error.message };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }    /**
     * Get the prompt for a specific formatter style
     * @param {string} style - Formatter style
     * @returns {string} - The corresponding prompt
     */
    getFormatterPrompt(style) {
        return this.formatPrompts[style] || this.formatPrompts.social;
    }

    /**
     * Get the prompt for a specific generator style
     * @param {string} style - Generator style
     * @returns {string} - The corresponding prompt
     */    
    getGeneratorPrompt(style) {
        return this.generatePrompts[style] || this.generatePrompts.news;
    }
    
    /**
     * Get the current API configuration
     * @returns {Object} - Current API configuration
     */
    getApiConfig() {
        return { ...this.apiConfig };
    }
}

export default SettingsManager;