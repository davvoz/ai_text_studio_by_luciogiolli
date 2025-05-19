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
        if (!this.markdownOutput) return;

        this.markdownOutput.style.opacity = 0;

        // Debug: Log original content for inspection
        console.log("Original Markdown content:", content);

        // Ensure marked is initialized with proper configuration
        if (typeof marked !== 'undefined') {
            // Configure marked with preferred options
            marked.setOptions({
                breaks: true,      // Convert \n to <br>
                gfm: true,         // GitHub Flavored Markdown
                headerIds: true,
                sanitize: false    // Allow HTML in markdown
            });

            try {
                // Parse markdown to HTML
                const parsedHtml = marked.parse(content);

                // Debug: Log parsed HTML for inspection
                console.log("Parsed HTML:", parsedHtml);

                this.markdownOutput.innerHTML = parsedHtml;
                console.log("Markdown parsed successfully");
            } catch (error) {
                console.error("Error parsing markdown:", error);
                // Fallback in case of parse error
                this.markdownOutput.innerHTML = `<pre>${content}</pre>`;
            }
        } else {
            console.error("Marked library not available!");
            // Basic formatting for code blocks if marked isn't available
            const basicFormatted = content
                .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n\n/g, '<br><br>');

            this.markdownOutput.innerHTML = basicFormatted;
        }

        // Animation
        setTimeout(() => {
            this.markdownOutput.style.opacity = 1;
            this.markdownOutput.style.transition = 'opacity 0.5s ease';
            this.markdownOutput.style.filter = 'none';
        }, 300);
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

                this.notificationService.showNotification('Contenuto scaricato come file markdown!', 'success');
            });
        }
    }
}

export default OutputManager;