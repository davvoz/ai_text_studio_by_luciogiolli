import UtilityService  from './UtilityService.js';
import CONFIG from './CONFIG.js';
import NotificationService from './NotificationService.js';

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
        this.apiEndpointInput = UtilityService.getElementById('apiEndpointInput');
        this.testApiConnection = UtilityService.getElementById('testApiConnection');
        this.saveApiConfig = UtilityService.getElementById('saveApiConfig');
        this.apiStatusIndicator = UtilityService.getElementById('apiStatusIndicator');
        this.apiStatusText = UtilityService.getElementById('apiStatusText');
        this.currentProviderName = UtilityService.getElementById('currentProviderName');
        this.currentModelName = UtilityService.getElementById('currentModelName');
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
            });
        }
        
        // Model selection
        if (this.apiModelSelect) {
            this.apiModelSelect.addEventListener('change', () => {
                if (this.apiModelSelect.value === 'custom' && this.apiCustomModelField) {
                    this.apiCustomModelField.classList.remove('hidden');
                } else if (this.apiCustomModelField) {
                    this.apiCustomModelField.classList.add('hidden');
                }
            });
        }
        
        // Test connection
        if (this.testApiConnection) {
            this.testApiConnection.addEventListener('click', async () => {
                if (!settingsManager) return;
                
                const provider = this.apiProviderSelect.value;
                const token = this.apiTokenInput.value;
                
                if (provider !== 'mock' && !token) {
                    const notificationService = new NotificationService();
                    notificationService.showNotification('API token is required for this provider', 'error');
                    return;
                }
                
                this.testApiConnection.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
                this.testApiConnection.disabled = true;
                
                try {
                    // Create temporary config
                    const tempConfig = {
                        provider,
                        token,
                        endpoint: this.apiEndpointInput ? this.apiEndpointInput.value : '',
                        model: this.apiModelSelect ? this.apiModelSelect.value : '',
                        customModel: this.apiCustomModelInput ? this.apiCustomModelInput.value : ''
                    };                    // Test connection by having settingsManager test the config
                    const result = await settingsManager.testApiConnection(tempConfig);
                    
                    const notificationService = new NotificationService();
                    if (result.success) {
                        notificationService.showNotification('Connection successful!', 'success');
                    } else {
                        notificationService.showNotification(`Connection failed: ${result.error}`, 'error');
                    }
                } catch (error) {
                    const notificationService = new NotificationService();
                    notificationService.showNotification(`Error testing connection: ${error.message}`, 'error');
                } finally {
                    this.testApiConnection.innerHTML = '<i class="fas fa-vial"></i> Test Connection';
                    this.testApiConnection.disabled = false;
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
                
                try {
                    // Create and save config
                    const newConfig = {
                        provider,
                        token,
                        endpoint: this.apiEndpointInput ? this.apiEndpointInput.value : '',
                        model: this.apiModelSelect ? this.apiModelSelect.value : '',
                        customModel: this.apiCustomModelInput ? this.apiCustomModelInput.value : ''
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
            this.providerDescription.textContent = providerConfig.description;
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
                
                // Set selected model
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
}

export default UIController;