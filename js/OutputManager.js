import UtilityService from "./UtilityService.js";
/**
 * OutputManager - Handles output display and actions
 */
class OutputManager {
    constructor(notificationService) {
        this.notificationService = notificationService;
        this.markdownOutput = UtilityService.getElementById('markdownOutput');
        this.copyOutput = UtilityService.getElementById('copyOutput');
        this.downloadOutput = UtilityService.getElementById('downloadOutput');
    }

    /**
     * Display output content with animation
     * @param {string} content - Content to display
     */
    displayOutput(content) {
        if (this.markdownOutput) {
            this.markdownOutput.style.opacity = 0;

            // Use marked library to parse Markdown
            if (window.marked) {
                this.markdownOutput.innerHTML = marked.parse(content);
            } else {
                // Fallback if marked library is not available
                this.markdownOutput.innerHTML = content;
            }

            // Animation
            setTimeout(() => {
                this.markdownOutput.style.opacity = 1;
                this.markdownOutput.style.transition = 'opacity 0.5s ease';
                this.markdownOutput.style.filter = 'none';
            }, 300);
        }
    }

    /**
     * Setup output action buttons (copy, download)
     */
    setupOutputActions() {
        // Copy output to clipboard
        if (this.copyOutput && this.markdownOutput) {
            this.copyOutput.addEventListener('click', () => {
                const outputText = this.markdownOutput.innerText;

                if (!outputText.trim()) {
                    this.notificationService.showNotification('Nessun contenuto da copiare!', 'error');
                    return;
                }

                navigator.clipboard.writeText(outputText)
                    .then(() => {
                        this.notificationService.showNotification('Contenuto copiato negli appunti!', 'success');
                    })
                    .catch(err => {
                        console.error('Could not copy text: ', err);
                        this.notificationService.showNotification('Impossibile copiare il contenuto', 'error');
                    });
            });
        }

        // Download output as markdown file
        if (this.downloadOutput && this.markdownOutput) {
            this.downloadOutput.addEventListener('click', () => {
                const outputText = this.markdownOutput.innerText;

                if (!outputText.trim()) {
                    this.notificationService.showNotification('Nessun contenuto da scaricare!', 'error');
                    return;
                }

                const blob = new Blob([outputText], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ai-text-studio-${Date.now()}.md`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                this.notificationService.showNotification('Contenuto scaricato come file markdown!', 'success');            });
        }
    }
}

export default OutputManager;