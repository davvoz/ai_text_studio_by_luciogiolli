/**
 * Utility Service - Helper methods for common functionality
 */
class UtilityService {
    /**
     * Get DOM element by ID with error handling
     * @param {string} id - Element ID
     * @returns {HTMLElement|null} - DOM element or null
     */
    static getElementById(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Element with ID "${id}" not found`);
        }
        return element;
    }

    /**
     * Get DOM elements by selector with error handling
     * @param {string} selector - CSS selector
     * @returns {NodeList} - DOM elements
     */
    static querySelectorAll(selector) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
            console.warn(`No elements found with selector "${selector}"`);
            // Still return the empty NodeList instead of throwing an error
        }
        return elements;
    }

    /**
     * Get DOM element by selector with error handling
     * @param {string} selector - CSS selector
     * @returns {HTMLElement|null} - DOM element or null
     */
    static querySelector(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            console.error(`Element with selector "${selector}" not found`);
        }
        return element;
    }

    /**
     * Save data to localStorage
     * @param {string} key - Storage key
     * @param {any} data - Data to store (will be JSON stringified)
     */
    static saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    /**
     * Load data from localStorage
     * @param {string} key - Storage key
     * @param {any} defaultValue - Default value if data not found
     * @returns {any} - Parsed data or default value
     */
    static loadFromLocalStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return defaultValue;        }
    }
}

export default UtilityService;