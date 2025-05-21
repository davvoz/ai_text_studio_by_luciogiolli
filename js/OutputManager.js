import UtilityService from "./UtilityService.js";
/**
 * OutputManager - Handles output display and actions
 */
class OutputManager {    constructor(notificationService) {
        this.notificationService = notificationService;
        this.markdownOutput = UtilityService.getElementById('markdownOutput');
        this.copyOutput = UtilityService.getElementById('copyOutput');
        this.downloadOutput = UtilityService.getElementById('downloadOutput');
        this.shareButton = UtilityService.getElementById('shareButton');
        this.shareMenu = UtilityService.getElementById('shareMenu');
        this.shareTwitter = UtilityService.getElementById('shareTwitter');
        this.shareFacebook = UtilityService.getElementById('shareFacebook');
        this.shareLinkedIn = UtilityService.getElementById('shareLinkedIn');
        this.shareWhatsApp = UtilityService.getElementById('shareWhatsApp');
        this.shareTelegram = UtilityService.getElementById('shareTelegram');
        this.shareEmail = UtilityService.getElementById('shareEmail');
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
    }    /**
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

        // Setup share button dropdown
        if (this.shareButton && this.shareMenu) {
            // Toggle share menu visibility
            this.shareButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.shareMenu.classList.toggle('active');
                
                if (this.shareMenu.classList.contains('active')) {
                    // Close menu when clicking elsewhere
                    document.addEventListener('click', this.closeShareMenu);
                } else {
                    document.removeEventListener('click', this.closeShareMenu);
                }
            });
            
            // Method to close share menu
            this.closeShareMenu = (e) => {
                if (!this.shareMenu.contains(e.target) && e.target !== this.shareButton) {
                    this.shareMenu.classList.remove('active');
                    document.removeEventListener('click', this.closeShareMenu);
                }
            };
            
            // Setup share platforms
            this.setupSharePlatforms();
        }
    }
    
    /**
     * Setup social sharing buttons
     */
    setupSharePlatforms() {
        // Helper function to check if content exists
        const checkContent = () => {
            const outputText = this.markdownOutput.innerText.trim();
            
            if (!outputText) {
                this.notificationService.showNotification('Nessun contenuto da condividere!', 'error');
                return false;
            }
            
            return outputText;
        };
        
        // Share on Twitter
        if (this.shareTwitter) {
            this.shareTwitter.addEventListener('click', () => {
                const text = checkContent();
                if (!text) return;
                
                // Twitter has a character limit, so truncate if needed
                const truncatedText = text.length > 280 ? text.substring(0, 277) + '...' : text;
                const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(truncatedText)}`;
                window.open(shareUrl, '_blank');
                
                this.notificationService.showNotification('Condiviso su Twitter!', 'success');
                this.shareMenu.classList.remove('active');
            });
        }
        
        // Share on Facebook
        if (this.shareFacebook) {
            this.shareFacebook.addEventListener('click', () => {
                if (!checkContent()) return;
                
                const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                window.open(shareUrl, '_blank');
                
                this.notificationService.showNotification('Condiviso su Facebook!', 'success');
                this.shareMenu.classList.remove('active');
            });
        }
        
        // Share on LinkedIn
        if (this.shareLinkedIn) {
            this.shareLinkedIn.addEventListener('click', () => {
                const text = checkContent();
                if (!text) return;
                
                const shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('AI Text Studio - Generated Content')}&summary=${encodeURIComponent(text)}`;
                window.open(shareUrl, '_blank');
                
                this.notificationService.showNotification('Condiviso su LinkedIn!', 'success');
                this.shareMenu.classList.remove('active');
            });
        }
        
        // Share on WhatsApp
        if (this.shareWhatsApp) {
            this.shareWhatsApp.addEventListener('click', () => {
                const text = checkContent();
                if (!text) return;
                
                const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                window.open(shareUrl, '_blank');
                
                this.notificationService.showNotification('Condiviso su WhatsApp!', 'success');
                this.shareMenu.classList.remove('active');
            });
        }
        
        // Share on Telegram
        if (this.shareTelegram) {
            this.shareTelegram.addEventListener('click', () => {
                const text = checkContent();
                if (!text) return;
                
                const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
                window.open(shareUrl, '_blank');
                
                this.notificationService.showNotification('Condiviso su Telegram!', 'success');
                this.shareMenu.classList.remove('active');
            });
        }
        
        // Share via Email
        if (this.shareEmail) {
            this.shareEmail.addEventListener('click', () => {
                const text = checkContent();
                if (!text) return;
                
                const subject = encodeURIComponent('AI Text Studio - Generated Content');
                const body = encodeURIComponent(text);
                const shareUrl = `mailto:?subject=${subject}&body=${body}`;
                window.location.href = shareUrl;
                
                this.notificationService.showNotification('Preparando email...', 'info');
                this.shareMenu.classList.remove('active');
            });
        }
    }
}

export default OutputManager;