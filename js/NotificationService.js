import  UtilityService  from './UtilityService.js';

/**
 * NotificationService - Handles all UI notifications
 */
class NotificationService {
    constructor() {
        this.container = UtilityService.getElementById('notification-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            document.body.appendChild(this.container);
        }
        this.activeNotifications = []; // Track active notifications
    }

    /**
     * Show notification with message and type
     * @param {string} message - Notification message
     * @param {string} type - Type (success, error)
     */
    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        // Create content
        const icon = type === 'success' ? 'check-circle' : 'exclamation-triangle';
        const title = type === 'success' ? 'Successo' : 'Errore';

        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <div class="notification-content">
                <h4 class="notification-title">${title}</h4>
                <p class="notification-message">${message}</p>
            </div>
        `;

        // Add to container
        this.container.appendChild(notification);
        this.activeNotifications.push(notification);

        // Animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
    }

    /**
     * Remove a specific notification
     * @param {HTMLElement} notification - The notification to remove
     */
    removeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';

            // Remove from DOM after animation completes
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                // Remove from active notifications array
                const index = this.activeNotifications.indexOf(notification);
                if (index > -1) {
                    this.activeNotifications.splice(index, 1);
                }
            }, 300);
        }
    }

    /**
     * Hide all active notifications
     */    hideNotification() {
        // Create a copy of the array to iterate over since we'll be modifying it
        const notifications = [...this.activeNotifications];
        notifications.forEach(notification => {
            this.removeNotification(notification);
        });
    }
}

export default NotificationService;