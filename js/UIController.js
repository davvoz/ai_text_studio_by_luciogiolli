import UtilityService from './UtilityService.js';
import CONFIG from './CONFIG.js';
import NotificationService from './NotificationService.js';
import LLMGateway from './LLMGateway.js';

/**
 * UIController - Handles all UI interactions and state
 */
class UIController {
    constructor() {
        // Cache DOM elements
        this.loader = UtilityService.getElementById('loader');
        this.navButtons = UtilityService.querySelectorAll('.nav-btn');
        this.tabContents = UtilityService.querySelectorAll('.tab-content');
        this.configTabButtons = UtilityService.querySelectorAll('.config-tab-btn');
        this.configContents = UtilityService.querySelectorAll('.config-content');
        this.configPanel = UtilityService.getElementById('configPanel');
        this.configToggle = UtilityService.getElementById('configToggle');
        this.closeSettings = UtilityService.getElementById('closeSettings');
        this.saveConfig = UtilityService.getElementById('saveConfig');
        this.aboutLink = UtilityService.getElementById('aboutLink');
        this.aboutModal = UtilityService.getElementById('aboutModal');
        this.closeModal = UtilityService.getElementById('closeModal');

        // API Config elements
        this.apiConfigModal = UtilityService.getElementById('apiConfigModal');
        this.closeApiModal = UtilityService.getElementById('closeApiModal');
        this.openApiConfig = UtilityService.getElementById('openApiConfig');
        this.apiProviderSelect = UtilityService.getElementById('apiProviderSelect');
        this.providerDescription = UtilityService.getElementById('providerDescription');
        this.apiTokenField = UtilityService.getElementById('apiTokenField');
        this.apiTokenInput = UtilityService.getElementById('apiTokenInput');
        this.toggleToken = UtilityService.getElementById('toggleToken');
        this.apiModelSelect = UtilityService.getElementById('apiModelSelect');
        this.apiCustomModelField = UtilityService.getElementById('apiCustomModelField');
        this.apiCustomModelInput = UtilityService.getElementById('apiCustomModelInput');
        this.apiEndpointField = UtilityService.getElementById('apiEndpointField');
        this.apiEndpointInput = UtilityService.getElementById('apiEndpointInput'); this.saveApiConfig = UtilityService.getElementById('saveApiConfig');
        this.apiStatusIndicator = UtilityService.getElementById('apiStatusIndicator');
        this.apiStatusText = UtilityService.getElementById('apiStatusText');
        this.currentProviderName = UtilityService.getElementById('currentProviderName');
        this.currentModelName = UtilityService.getElementById('currentModelName');

        // Elementi per la gestione dei modelli GitHub
        this.refreshModelsContainer = UtilityService.getElementById('refreshModelsContainer');
        this.refreshModels = UtilityService.getElementById('refreshModels');
    }

    /**
     * Hide loader element
     */
    hideLoader() {
        if (this.loader) {
            this.loader.classList.add('hidden');
            this.loader.style.display = 'none';
        }
    }

    /**
     * Show loader element
     */
    showLoader() {
        if (this.loader) {
            this.loader.classList.remove('hidden');
            this.loader.style.display = 'flex';
        }
    }

    /**
     * Setup theme toggle functionality
     * @param {ThemeManager} themeManager - Theme manager instance
     */
    setupThemeToggle(themeManager) {
        const themeToggle = UtilityService.getElementById('themeToggle');
        if (themeToggle && themeManager) {
            themeToggle.addEventListener('click', () => {
                themeManager.toggleTheme();
            });
        }
    }    /**
     * Setup tab navigation
     */
    setupNavigation() {
        if (this.navButtons && this.tabContents) {
            this.navButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Skip for settings button
                    if (!button.classList.contains('settings-btn')) {
                        // Remove active class from all nav buttons except settings
                        this.navButtons.forEach(btn => {
                            if (!btn.classList.contains('settings-btn')) {
                                btn.classList.remove('active');
                            }
                        });

                        // Add active class to clicked button with a small delay for animation
                        setTimeout(() => {
                            button.classList.add('active');
                        }, 50);

                        // Find current active tab
                        const currentActiveTab = Array.from(this.tabContents).find(tab => tab.classList.contains('active'));

                        // Activate corresponding tab content with smooth transition
                        const tabId = `${button.dataset.tab}Tab`;
                        const targetTab = document.getElementById(tabId);

                        if (targetTab) {
                            // If there is an active tab, transition out first
                            if (currentActiveTab) {
                                currentActiveTab.style.opacity = '0';
                                currentActiveTab.style.transform = 'translateY(10px)';

                                // After transition out, show new tab
                                setTimeout(() => {
                                    currentActiveTab.classList.remove('active');
                                    targetTab.classList.add('active');

                                    // Trigger reflow for animation
                                    void targetTab.offsetWidth;

                                    // Animate in new tab
                                    setTimeout(() => {
                                        targetTab.style.opacity = '1';
                                        targetTab.style.transform = 'translateY(0)';
                                    }, 50);
                                }, 300);
                            } else {
                                // If no active tab, just show the new one
                                targetTab.classList.add('active');
                                setTimeout(() => {
                                    targetTab.style.opacity = '1';
                                    targetTab.style.transform = 'translateY(0)';
                                }, 50);
                            }
                        } else {
                            console.error(`Tab with ID ${tabId} not found!`);
                        }
                    }
                });
            });
        }
    }    /**
     * Setup settings panel functionality
     * @param {SettingsManager} settingsManager - Settings manager instance
     */
    setupSettingsPanel(settingsManager) {
        // Toggle settings panel visibility
        if (this.configToggle && this.configPanel) {
            this.configToggle.addEventListener('click', () => {
                if (this.configPanel.classList.contains('hidden')) {
                    // Show panel with animation
                    this.configPanel.classList.remove('hidden');
                    // Force reflow to make animation work
                    void this.configPanel.offsetWidth;
                    this.configPanel.style.opacity = '1';
                    this.configPanel.style.transform = 'translateX(0)';
                } else {
                    // Hide panel with animation
                    this.configPanel.style.opacity = '0';
                    this.configPanel.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        this.configPanel.classList.add('hidden');
                    }, 400); // Match transition duration
                }
            });
        }

        // Close settings panel
        if (this.closeSettings && this.configPanel) {
            this.closeSettings.addEventListener('click', () => {
                this.configPanel.style.opacity = '0';
                this.configPanel.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    this.configPanel.classList.add('hidden');
                }, 400); // Match transition duration
            });
        }

        // Save settings
        const saveConfig = UtilityService.getElementById('saveConfig');
        if (saveConfig && settingsManager) {
            saveConfig.addEventListener('click', () => {
                if (settingsManager.saveSettings()) {
                    // Add ripple effect on click
                    saveConfig.classList.add('pulse');
                    setTimeout(() => {
                        saveConfig.classList.remove('pulse');
                    }, 400);

                    // Hide panel with animation
                    this.configPanel.style.opacity = '0';
                    this.configPanel.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        this.configPanel.classList.add('hidden');
                    }, 400);

                    const notificationService = new NotificationService();
                    notificationService.showNotification('Impostazioni salvate con successo!', 'success');
                }
            });
        }

        // Config tab navigation with improved transitions
        if (this.configTabButtons && this.configContents) {
            this.configTabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Skip if already active
                    if (button.classList.contains('active')) return;

                    // Find current active content
                    const currentActiveContent = Array.from(this.configContents).find(content =>
                        content.classList.contains('active')
                    );

                    // Get the target content
                    const targetContent = document.getElementById(button.dataset.tab);
                    if (!targetContent) return;

                    // Remove active class from all buttons
                    this.configTabButtons.forEach(btn => btn.classList.remove('active'));

                    // Add active class to clicked button
                    button.classList.add('active');

                    // If there's an active content, fade it out first
                    if (currentActiveContent) {
                        currentActiveContent.style.opacity = '0';
                        currentActiveContent.style.transform = 'translateY(10px)';

                        // Then switch content after fade out
                        setTimeout(() => {
                            this.configContents.forEach(content => content.classList.remove('active'));
                            targetContent.classList.add('active');

                            // Force reflow to make animation work
                            void targetContent.offsetWidth;

                            // Animate in new content
                            setTimeout(() => {
                                targetContent.style.opacity = '1';
                                targetContent.style.transform = 'translateY(0)';
                            }, 50);
                        }, 200);
                    } else {
                        // If no active content, just switch
                        this.configContents.forEach(content => content.classList.remove('active'));
                        targetContent.classList.add('active');

                        // Animate in new content
                        setTimeout(() => {
                            targetContent.style.opacity = '1';
                            targetContent.style.transform = 'translateY(0)';
                        }, 50);
                    }
                });
            });
        }
    }    /**
     * Setup about modal functionality
     */
    setupAboutModal() {
        if (this.aboutLink && this.aboutModal && this.closeModal) {
            this.aboutLink.addEventListener('click', (e) => {
                e.preventDefault();
                // Show modal with animation
                this.aboutModal.classList.remove('hidden');
                // Trigger reflow to make sure animation works
                void this.aboutModal.offsetWidth;
            });

            this.closeModal.addEventListener('click', () => {
                // Get modal content for animation
                const modalContent = this.aboutModal.querySelector('.modal-content');
                if (modalContent) {
                    // Animate out
                    modalContent.style.transform = 'translateY(20px) scale(0.95)';
                    modalContent.style.opacity = '0';

                    // Hide modal after animation completes
                    setTimeout(() => {
                        this.aboutModal.classList.add('hidden');
                        // Reset styles for next opening
                        modalContent.style.transform = '';
                        modalContent.style.opacity = '';
                    }, 300);
                } else {
                    this.aboutModal.classList.add('hidden');
                }
            });

            // Close modal when clicking outside
            this.aboutModal.addEventListener('click', (e) => {
                if (e.target === this.aboutModal) {
                    // Get modal content for animation
                    const modalContent = this.aboutModal.querySelector('.modal-content');
                    if (modalContent) {
                        // Animate out
                        modalContent.style.transform = 'translateY(20px) scale(0.95)';
                        modalContent.style.opacity = '0';

                        // Hide modal after animation completes
                        setTimeout(() => {
                            this.aboutModal.classList.add('hidden');
                            // Reset styles for next opening
                            modalContent.style.transform = '';
                            modalContent.style.opacity = '';
                        }, 300);
                    } else {
                        this.aboutModal.classList.add('hidden');
                    }
                }
            });
        }
    }

    /**
     * Setup API configuration modal and functionality
     * @param {SettingsManager} settingsManager - Settings manager instance
     */
    setupApiConfigModal(settingsManager) {
        if (!this.apiConfigModal || !this.openApiConfig) {
            return;
        }

        // Open API config modal
        this.openApiConfig.addEventListener('click', () => {
            this.apiConfigModal.classList.remove('hidden');
            this.configPanel.classList.add('hidden');
            this.updateProviderDescription();
        });

        // Close API config modal
        if (this.closeApiModal) {
            this.closeApiModal.addEventListener('click', () => {
                this.apiConfigModal.classList.add('hidden');
            });
        }

        // Close modal when clicking outside
        this.apiConfigModal.addEventListener('click', (e) => {
            if (e.target === this.apiConfigModal) {
                this.apiConfigModal.classList.add('hidden');
            }
        });

        // Refresh models button for GitHub provider
        // if (this.refreshModels) {
        //     this.refreshModels.addEventListener('click', async () => {
        //         if (this.apiProviderSelect && this.apiProviderSelect.value === 'github' &&
        //             this.apiTokenInput && this.apiTokenInput.value.trim()) {
        //             await this.loadDynamicGitHubModels(this.apiTokenInput.value.trim());
        //         } else {
        //             const notificationService = new NotificationService();
        //             notificationService.showNotification('Seleziona GitHub come provider e inserisci un token valido', 'warning');
        //         }
        //     });
        // }

        // Toggle token visibility
        if (this.toggleToken && this.apiTokenInput) {
            this.toggleToken.addEventListener('click', () => {
                const type = this.apiTokenInput.getAttribute('type');
                this.apiTokenInput.setAttribute('type', type === 'password' ? 'text' : 'password');
                this.toggleToken.innerHTML = type === 'password'
                    ? '<i class="fas fa-eye-slash"></i>'
                    : '<i class="fas fa-eye"></i>';
            });
        }

        // Provider selection
        if (this.apiProviderSelect) {
            this.apiProviderSelect.addEventListener('change', () => {
                this.updateProviderDescription();
                this.updateApiFormVisibility(settingsManager);

                // Se è selezionato GitHub, aggiungiamo un listener per il token
                if (this.apiProviderSelect.value === 'github' && this.apiTokenInput) {
                    // Rimuoviamo eventuali listener esistenti per evitare duplicati
                    this.apiTokenInput.removeEventListener('blur', this.loadGitHubModels);

                    // Aggiungiamo un nuovo listener
                    // this.loadGitHubModels = async () => {
                    //     if (this.apiTokenInput.value.trim()) {
                    //         await this.loadDynamicGitHubModels(this.apiTokenInput.value.trim());
                    //     }
                    // };

                    // this.apiTokenInput.addEventListener('blur', this.loadGitHubModels);
                }
            });
        }
        // Model selection
        if (this.apiModelSelect) {
            this.apiModelSelect.addEventListener('change', async () => {
                if (this.apiModelSelect.value === 'custom' && this.apiCustomModelField) {
                    this.apiCustomModelField.classList.remove('hidden');
                } else if (this.apiCustomModelField) {
                    this.apiCustomModelField.classList.add('hidden');
                }

                // Check model availability if Hugging Face is selected
                if (this.apiProviderSelect && this.apiProviderSelect.value === 'huggingface' &&
                    this.apiModelSelect.value !== 'custom' && this.apiTokenInput && this.apiTokenInput.value) {

                    const modelId = this.apiModelSelect.value;
                    const token = this.apiTokenInput.value;

                    // Show info message while checking
                    const notificationService = new NotificationService();
                    notificationService.showNotification(`Verificando la disponibilità del modello ${modelId}...`, 'info');

                    try {
                        const result = await LLMGateway.checkModelAvailability(modelId, token);

                        if (result.available) {
                            notificationService.showNotification(`Modello ${modelId} è disponibile!`, 'success');
                        } else {
                            notificationService.showNotification(`${result.error}`, 'warning');
                        }
                    } catch (error) {
                        console.error('Error checking model availability:', error);
                    }
                }

                // Check model availability if GitHub is selected
                if (this.apiProviderSelect && this.apiProviderSelect.value === 'github' &&
                    this.apiModelSelect.value !== 'custom' && this.apiTokenInput && this.apiTokenInput.value) {

                    const modelId = this.apiModelSelect.value;
                    const token = this.apiTokenInput.value;

                    // Show info message while checking
                    const notificationService = new NotificationService();
                    notificationService.showNotification(`Verificando la disponibilità del modello GitHub ${modelId}...`, 'info');

                    // try {
                    //     // Get all GitHub models to verify availability
                    //     const result = await LLMGateway.getGitHubModels(token);

                    //     if (result.success) {
                    //         notificationService.showNotification(`Connessione a GitHub Models riuscita!`, 'success');
                    //     } else {
                    //         notificationService.showNotification(`${result.error}`, 'warning');
                    //     }
                    // } catch (error) {
                    //     console.error('Error checking GitHub model availability:', error);
                    //     notificationService.showNotification(`Errore durante la verifica del modello: ${error.message}`, 'error');
                    // }
                }
            });
        }

        // Custom model input check
        if (this.apiCustomModelInput) {
            this.apiCustomModelInput.addEventListener('blur', async () => {
                if (this.apiProviderSelect && this.apiProviderSelect.value === 'huggingface' &&
                    this.apiModelSelect && this.apiModelSelect.value === 'custom' &&
                    this.apiTokenInput && this.apiTokenInput.value &&
                    this.apiCustomModelInput.value.trim()) {

                    const modelId = this.apiCustomModelInput.value.trim();
                    const token = this.apiTokenInput.value;

                    // Show info message while checking
                    const notificationService = new NotificationService();
                    notificationService.showNotification(`Verificando la disponibilità del modello personalizzato ${modelId}...`, 'info');

                    try {
                        const result = await LLMGateway.checkModelAvailability(modelId, token);

                        if (result.available) {
                            notificationService.showNotification(`Modello personalizzato ${modelId} è disponibile!`, 'success');
                        } else {
                            notificationService.showNotification(`${result.error}`, 'warning');
                        }
                    } catch (error) {
                        console.error('Error checking custom model availability:', error);
                    }
                }

                // Check custom model for GitHub
                if (this.apiProviderSelect && this.apiProviderSelect.value === 'github' &&
                    this.apiModelSelect && this.apiModelSelect.value === 'custom' &&
                    this.apiTokenInput && this.apiTokenInput.value &&
                    this.apiCustomModelInput.value.trim()) {

                    const modelId = this.apiCustomModelInput.value.trim();
                    const token = this.apiTokenInput.value;

                    // Show info message while checking
                    const notificationService = new NotificationService();
                    notificationService.showNotification(`Verificando la disponibilità del modello GitHub personalizzato ${modelId}...`, 'info');

                    try {
                        // Get all GitHub models to check if connection works
                        const result = await LLMGateway.getGitHubModels(token);

                        if (result.success) {
                            notificationService.showNotification(`Connessione a GitHub Models riuscita! Il modello personalizzato sarà utilizzato.`, 'success');
                        } else {
                            notificationService.showNotification(`${result.error}`, 'warning');
                        }
                    } catch (error) {
                        console.error('Error checking GitHub custom model:', error);
                        notificationService.showNotification(`Errore durante la verifica: ${error.message}`, 'error');
                    }
                }
            });
        }
        // Save API config
        if (this.saveApiConfig) {
            this.saveApiConfig.addEventListener('click', () => {
                if (!settingsManager) return;

                const provider = this.apiProviderSelect.value;
                const token = this.apiTokenInput.value;

                if (provider !== 'mock' && !token) {
                    const notificationService = new NotificationService();
                    notificationService.showNotification('API token is required for this provider', 'error');
                    return;
                }

                try {                // Create and save config
                    const newConfig = {
                        provider,
                        token: token.trim(), // Ensure token is trimmed
                        endpoint: this.apiEndpointInput ? this.apiEndpointInput.value.trim() : '',
                        model: this.apiModelSelect ? this.apiModelSelect.value : '',
                        customModel: this.apiCustomModelInput ? this.apiCustomModelInput.value.trim() : ''
                    };

                    settingsManager.saveApiConfig(newConfig);
                    this.updateApiInfoDisplay(newConfig);

                    // Close modal and show notification
                    this.apiConfigModal.classList.add('hidden');

                    const notificationService = new NotificationService();
                    notificationService.showNotification('API configuration saved successfully!', 'success');
                } catch (error) {
                    const notificationService = new NotificationService();
                    notificationService.showNotification(`Error saving configuration: ${error.message}`, 'error');
                }
            });
        }
    }
    /**
   * Update the API provider description based on the selected provider
   */
    updateProviderDescription() {
        if (!this.apiProviderSelect || !this.providerDescription) return;

        const provider = this.apiProviderSelect.value;
        const providerConfig = CONFIG.API.PROVIDERS[provider];

        if (providerConfig) {
            // Update provider description
            this.providerDescription.textContent = providerConfig.description;            // Update token help text if provider has token info
            const tokenHelpText = UtilityService.getElementById('tokenHelpText');
            if (tokenHelpText && providerConfig.tokenTip) {
                tokenHelpText.classList.remove('hidden');

                // Set token help text with a more prominent button if URL is available
                if (providerConfig.tokenUrl) {
                    tokenHelpText.innerHTML = `${providerConfig.tokenTip} 
                    <div class="token-button-container">
                        <a href="${providerConfig.tokenUrl}" target="_blank" rel="noopener noreferrer" class="token-btn">
                            <i class="fas fa-key"></i> Genera token ${providerConfig.name}
                        </a>
                    </div>`;
                } else {
                    tokenHelpText.innerHTML = providerConfig.tokenTip;
                }
            } else if (tokenHelpText) {
                tokenHelpText.classList.add('hidden');
            }
        }
    }

    /**
     * Update the visibility of API form fields based on the selected provider
     * @param {SettingsManager} settingsManager - Settings manager instance
     */
    updateApiFormVisibility(settingsManager) {
        if (!this.apiProviderSelect) return;

        const provider = this.apiProviderSelect.value;
        const providerConfig = CONFIG.API.PROVIDERS[provider];

        if (!providerConfig) return;

        // Show/hide token field
        if (this.apiTokenField) {
            if (providerConfig.tokenRequired) {
                this.apiTokenField.classList.remove('hidden');
            } else {
                this.apiTokenField.classList.add('hidden');
            }
        }

        // Show/hide endpoint field
        if (this.apiEndpointField) {
            if (providerConfig.endpointRequired) {
                this.apiEndpointField.classList.remove('hidden');
            } else {
                this.apiEndpointField.classList.add('hidden');
            }
        }

        // Update model options
        if (this.apiModelSelect) {
            // Clear current options
            this.apiModelSelect.innerHTML = '';

            // Add new options
            providerConfig.modelOptions.forEach(model => {
                const option = document.createElement('option');
                option.value = model.value;
                option.textContent = model.name;
                this.apiModelSelect.appendChild(option);
            });

            // Hide custom model field initially
            if (this.apiCustomModelField) {
                this.apiCustomModelField.classList.add('hidden');
            }
        }

        // Show/hide refresh models button for GitHub provider
        if (this.refreshModelsContainer) {
            if (provider === 'github') {
                this.refreshModelsContainer.classList.remove('hidden');
            } else {
                this.refreshModelsContainer.classList.add('hidden');
            }
        }
    }

    /**
     * Update the API info display in the settings panel
     * @param {Object} config - API configuration
     */
    updateApiInfoDisplay(config) {
        if (!config) return;

        if (this.apiStatusIndicator && this.apiStatusText) {
            if (config.provider === 'mock') {
                this.apiStatusIndicator.className = 'status-dot not-configured';
                this.apiStatusText.textContent = 'Demo Mode';
            } else if (!config.token) {
                this.apiStatusIndicator.className = 'status-dot not-configured';
                this.apiStatusText.textContent = 'Not Configured';
            } else {
                this.apiStatusIndicator.className = 'status-dot configured';
                this.apiStatusText.textContent = 'Configured';
            }
        }

        if (this.currentProviderName) {
            const providerConfig = CONFIG.API.PROVIDERS[config.provider];
            this.currentProviderName.textContent = providerConfig ? providerConfig.name : 'Unknown';
        }

        if (this.currentModelName) {
            if (config.provider === 'mock') {
                this.currentModelName.textContent = 'None';
            } else if (config.model === 'custom' && config.customModel) {
                this.currentModelName.textContent = config.customModel;
            } else if (config.model) {
                const providerConfig = CONFIG.API.PROVIDERS[config.provider];
                const modelOption = providerConfig?.modelOptions.find(m => m.value === config.model);
                this.currentModelName.textContent = modelOption ? modelOption.name : config.model;
            } else {
                this.currentModelName.textContent = 'Default';
            }
        }
    }

    /**
     * Load API configuration into the modal form
     * @param {Object} config - API configuration
     */
    loadApiConfigIntoForm(config) {
        if (!config) return;

        if (this.apiProviderSelect) {
            this.apiProviderSelect.value = config.provider || 'mock';
            this.updateProviderDescription();
        }

        if (this.apiTokenInput) {
            this.apiTokenInput.value = config.token || '';
        }

        if (this.apiEndpointInput) {
            this.apiEndpointInput.value = config.endpoint || '';
        }

        if (this.apiCustomModelInput) {
            this.apiCustomModelInput.value = config.customModel || '';
        }

        // Update model options based on provider
        if (this.apiModelSelect) {
            const providerConfig = CONFIG.API.PROVIDERS[config.provider || 'mock'];

            if (providerConfig) {
                // Clear current options
                this.apiModelSelect.innerHTML = '';

                // Add new options
                providerConfig.modelOptions.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model.value;
                    option.textContent = model.name;
                    this.apiModelSelect.appendChild(option);
                });

                // If GitHub provider is selected and token exists, try to load models dynamically
                //   if (config.provider === 'github' && config.token) {
                // Start async load of GitHub models
                //      setTimeout(() => {
                //          this.loadDynamicGitHubModels(config.token);
                //     }, 100);
                //   }

                // Select the current model
                if (config.model) {
                    this.apiModelSelect.value = config.model;
                }

                // Show/hide custom model field
                if (this.apiCustomModelField) {
                    if (config.model === 'custom') {
                        this.apiCustomModelField.classList.remove('hidden');
                    } else {
                        this.apiCustomModelField.classList.add('hidden');
                    }
                }
            }
        }

        // Update visibility of fields based on provider
        if (this.apiTokenField && this.apiEndpointField) {
            const providerConfig = CONFIG.API.PROVIDERS[config.provider || 'mock'];

            if (providerConfig) {
                if (providerConfig.tokenRequired) {
                    this.apiTokenField.classList.remove('hidden');
                } else {
                    this.apiTokenField.classList.add('hidden');
                }

                if (providerConfig.endpointRequired) {
                    this.apiEndpointField.classList.remove('hidden');
                } else {
                    this.apiEndpointField.classList.add('hidden');
                }
            }
        }
    }

    /**
     * Add animation to cards
     */    animateCards() {
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = 1;
                card.style.transform = 'translateY(0) rotateY(0)';
            }, index * 200);
        });
    }

    /**
     * Carica dinamicamente i modelli GitHub disponibili
     * @param {string} token - Token GitHub API
     */
    async loadDynamicGitHubModels(token) {
        if (!token || !this.apiModelSelect) return;

        try {
            // Mostra un messaggio informativo
            const notificationService = new NotificationService();
            notificationService.showNotification('Caricamento dei modelli GitHub disponibili...', 'info');

            // Recupera i modelli da GitHub
            const result = await LLMGateway.getGitHubModels(token);

            if (result.success && result.formattedModels && result.formattedModels.length > 0) {
                // Salva l'opzione custom
                const customOption = Array.from(this.apiModelSelect.options)
                    .find(option => option.value === 'custom');

                // Svuota il select box mantenendo solo l'opzione custom
                this.apiModelSelect.innerHTML = '';

                // Aggiungi i modelli dinamici
                result.formattedModels.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model.value;
                    option.textContent = model.name;
                    this.apiModelSelect.appendChild(option);
                });

                // Aggiungi nuovamente l'opzione custom
                if (customOption) {
                    this.apiModelSelect.appendChild(customOption);
                } else {
                    const option = document.createElement('option');
                    option.value = 'custom';
                    option.textContent = 'Custom Model';
                    this.apiModelSelect.appendChild(option);
                }

                notificationService.showNotification(`Caricati ${result.formattedModels.length} modelli GitHub`, 'success');
            } else if (result.error) {
                notificationService.showNotification(`Errore nel caricamento dei modelli: ${result.error}`, 'warning');
            } else {
                notificationService.showNotification('Nessun modello trovato o errore nel formato dei dati', 'warning');
            }
        } catch (error) {
            console.error('Error loading GitHub models:', error);
            const notificationService = new NotificationService();
            notificationService.showNotification(`Errore nel caricamento dei modelli: ${error.message}`, 'error');
        }
    }
}

export default UIController;