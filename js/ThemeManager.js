import UtilityService from "./UtilityService.js";
import CONFIG from "./CONFIG.js";
/**
 * ThemeManager - Handles theme switching functionality
 */
class ThemeManager {
    constructor() {
        this.themeToggleBtn = UtilityService.getElementById('themeToggle');
        this.currentTheme = UtilityService.loadFromLocalStorage(CONFIG.THEME.STORAGE_KEY, 'light');
        this.initTheme();
    }

    /**
     * Initialize theme based on saved preference
     */
    initTheme() {
        if (this.currentTheme === 'dark') {
            document.body.classList.add('dark-theme');
            if (this.themeToggleBtn) {
                this.themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            }
        } else {
            document.body.classList.remove('dark-theme');
            if (this.themeToggleBtn) {
                this.themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            }
        }
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            this.currentTheme = 'light';
            if (this.themeToggleBtn) {
                this.themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            }
        } else {
            document.body.classList.add('dark-theme');
            this.currentTheme = 'dark';
            if (this.themeToggleBtn) {
                this.themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            }
        }        // Save preference
        UtilityService.saveToLocalStorage(CONFIG.THEME.STORAGE_KEY, this.currentTheme);
    }
}

export default ThemeManager;