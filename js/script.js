
import  NotificationService  from "./NotificationService.js";
import  ThemeManager from "./ThemeManager.js";
import  UIController  from "./UIController.js";
import  SettingsManager  from "./SettingsManager.js";
import  OutputManager  from "./OutputManager.js";
import  FormatterService  from "./FormatterService.js";
import  GeneratorService  from "./GeneratorService.js";

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeApplication();
});

/**
 * Initialize all application components
 */
function initializeApplication() {    try {
        // Initialize utility services
        const notificationService = new NotificationService();
        // Make notificationService available globally for error handling
        window.notificationService = notificationService;
        
        // Initialize theme manager
        const themeManager = new ThemeManager();
          // Initialize UI controller
        const uiController = new UIController();
        uiController.hideLoader();
        uiController.setupThemeToggle(themeManager);
        uiController.setupNavigation();
        uiController.setupAboutModal();
        
        // Initialize settings manager
        const settingsManager = new SettingsManager();
        settingsManager.loadSavedSettings();
        uiController.setupSettingsPanel(settingsManager);
        
        // Initialize API config modal
        uiController.setupApiConfigModal(settingsManager);
        
        // Update API info display
        uiController.updateApiInfoDisplay(settingsManager.getApiConfig());
        
        // Load API config into form
        uiController.loadApiConfigIntoForm(settingsManager.getApiConfig());
        
        // Animate cards
        uiController.animateCards();
        
        // Initialize output manager
        const outputManager = new OutputManager(notificationService);
        outputManager.setupOutputActions();
        
        // Initialize formatter service
        const formatterService = new FormatterService(notificationService, outputManager, settingsManager);
        formatterService.initialize();
        
        // Initialize generator service
        const generatorService = new GeneratorService(notificationService, outputManager, settingsManager);
        generatorService.initialize();
        
        // Show success notification
        notificationService.showNotification('Applicazione inizializzata con successo!', 'success');
        
        console.log('AI Text Studio initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        // Show error in UI if possible
        try {
            const notificationService = new NotificationService();
            notificationService.showNotification('Errore durante l\'inizializzazione: ' + error.message, 'error');
        } catch (e) {
            // If notification service fails, at least alert the user
            alert('Error initializing the application: ' + error.message);
        }
    }
}

/**
 * Export components for console debugging in development
 * This allows testing components via browser console
 */
function exportDebugComponents() {
    if (typeof window !== 'undefined') {
        window.DEBUG = {
            notificationService: null,
            themeManager: null,
            uiController: null,
            settingsManager: null,
            outputManager: null,
            formatterService: null,
            generatorService: null
        };
        
        // After initialization, components can be assigned to DEBUG object
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                try {
                    // Attempt to capture instances after they're initialized
                    window.DEBUG.notificationService = new NotificationService();
                    window.DEBUG.themeManager = new ThemeManager();
                    window.DEBUG.uiController = new UIController();
                    window.DEBUG.settingsManager = new SettingsManager();
                    window.DEBUG.outputManager = new OutputManager(window.DEBUG.notificationService);
                    window.DEBUG.formatterService = new FormatterService(
                        window.DEBUG.notificationService, 
                        window.DEBUG.outputManager,
                        window.DEBUG.settingsManager
                    );
                    window.DEBUG.generatorService = new GeneratorService(
                        window.DEBUG.notificationService,
                        window.DEBUG.outputManager,
                        window.DEBUG.settingsManager
                    );
                    
                    console.log('Debug components initialized. Access via window.DEBUG');
                } catch (error) {
                    console.warn('Could not initialize debug components:', error);
                }
            }, 1000);
        });
    }
}

// Initialize debug components in non-production environments
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    exportDebugComponents();
}
