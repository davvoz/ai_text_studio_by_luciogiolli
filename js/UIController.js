import UtilityService  from './UtilityService.js';

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
    }

    /**
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

                        // Remove active class from all tab contents
                        this.tabContents.forEach(content => {
                            content.classList.remove('active');
                        });

                        // Add active class to clicked button
                        button.classList.add('active');

                        // Activate corresponding tab content
                        const tabId = `${button.dataset.tab}Tab`;
                        const targetTab = document.getElementById(tabId);
                        if (targetTab) {
                            targetTab.classList.add('active');
                        } else {
                            console.error(`Tab with ID ${tabId} not found!`);
                        }
                    }
                });
            });
        }
    }

    /**
     * Setup settings panel functionality
     * @param {SettingsManager} settingsManager - Settings manager instance
     */
    setupSettingsPanel(settingsManager) {
        // Toggle settings panel visibility
        if (this.configToggle && this.configPanel) {
            this.configToggle.addEventListener('click', () => {
                this.configPanel.classList.toggle('hidden');
            });
        }

        // Close settings panel
        if (this.closeSettings && this.configPanel) {
            this.closeSettings.addEventListener('click', () => {
                this.configPanel.classList.add('hidden');
            });
        }

        // Save settings
        const saveConfig = UtilityService.getElementById('saveConfig');
        if (saveConfig && settingsManager) {
            saveConfig.addEventListener('click', () => {
                if (settingsManager.saveSettings()) {
                    this.configPanel.classList.add('hidden');
                    const notificationService = new NotificationService();
                    notificationService.showNotification('Impostazioni salvate con successo!', 'success');
                }
            });
        }

        // Config tab navigation
        if (this.configTabButtons && this.configContents) {
            this.configTabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    this.configTabButtons.forEach(btn => btn.classList.remove('active'));
                    this.configContents.forEach(content => content.classList.remove('active'));

                    button.classList.add('active');
                    document.getElementById(button.dataset.tab).classList.add('active');
                });
            });
        }
    }

    /**
     * Setup about modal functionality
     */
    setupAboutModal() {
        if (this.aboutLink && this.aboutModal && this.closeModal) {
            this.aboutLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.aboutModal.classList.remove('hidden');
            });

            this.closeModal.addEventListener('click', () => {
                this.aboutModal.classList.add('hidden');
            });

            // Close modal when clicking outside
            this.aboutModal.addEventListener('click', (e) => {
                if (e.target === this.aboutModal) {
                    this.aboutModal.classList.add('hidden');
                }
            });
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