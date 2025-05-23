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
     * @param {string} type - Type (success, error,info)
     */
    showNotification(message, type = 'success') {
        console.log(`Notification: ${message}, Type: ${type}`);
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        // Create content
        let icon, title;
        
        switch(type) {
            case 'success':
                icon = 'check-circle';
                title = 'Success';
                break;
            case 'error':
                icon = 'exclamation-triangle';
                title = 'Error';
                break;
            case 'info':
                icon = 'info-circle';
                title = 'Info';
                break;
            default:
                icon = 'check-circle';
                title = 'Success';
        }

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

        // No need to set style directly, animation is handled by CSS
        // Animation will run automatically based on the CSS in animations.css

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
            // Add removing class to trigger slide-out animation
            notification.classList.add('removing');

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
            }, 500); // Match with animation duration
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