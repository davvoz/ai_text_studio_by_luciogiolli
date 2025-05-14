class LLMAgnostic {
    static chat = {
        completions: {
            create: async ({ messages }) => {
                // Simulate an API call to a language model
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            role: "assistant",
                            content: messages[messages.length - 1].content.replace(/You are a (.+?)\./, "You are a $1. This is the formatted text:")
                        });
                    }, 2000);
                });
            }
        }
    };
}
// Assicuriamoci che il loader sia sempre nascosto all'avvio
// Utilizzando uno script all'inizio, prima dell'evento DOMContentLoaded
(function() {
    // Nasconde immediatamente il loader all'avvio
    document.addEventListener('DOMContentLoaded', function() {
        const loader = document.getElementById('loader');
        if (loader) {
            console.log('DOMContentLoaded - nascondo il loader');
            loader.classList.add('hidden');
            // Applica direttamente anche lo stile display:none per essere sicuri
            loader.style.display = 'none';
        }
    });
})();

// Assicuriamoci che le tab funzionino correttamente
document.addEventListener('DOMContentLoaded', () => {
    // Assicuriamoci che il loader sia nascosto all'avvio
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
    }
    
    // Verifica che gli elementi delle tab esistano
    console.log('Tab di generazione:', document.getElementById('generateTab'));
    console.log('Tab di formattazione:', document.getElementById('formatTab'));
    
    // Verifica che i pulsanti di navigazione abbiano gli attributi corretti
    document.querySelectorAll('.nav-btn').forEach(btn => {
        console.log('Pulsante di navigazione:', btn.dataset.tab, btn);
    });
    
    // Inizializza le classi active
    const activeTab = document.querySelector('.nav-btn.active');
    if (activeTab && !activeTab.classList.contains('settings-btn')) {
        const tabId = `${activeTab.dataset.tab}Tab`;
        const tabContent = document.getElementById(tabId);
        if (tabContent) {
            // Verifica che tutte le altre tab siano nascoste
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            // Attiva solo la tab corrente
            tabContent.classList.add('active');
        }
    }
});
    // DOM elements
    const userTextArea = document.getElementById('userText');
    const genKeywordsArea = document.getElementById('genKeywords');
    const styleButtons = document.querySelectorAll('.style-btn');
    const genStyleSelect = document.getElementById('genStyleSelect');
    const languageSelect = document.getElementById('languageSelect');
    const formatBtn = document.getElementById('formatBtn');
    const generateBtn = document.getElementById('generateBtn');
    const markdownOutput = document.getElementById('markdownOutput');
    const loader = document.getElementById('loader');
    const configToggle = document.getElementById('configToggle');
    const configPanel = document.getElementById('configPanel');
    const saveConfig = document.getElementById('saveConfig');
    const closeSettings = document.getElementById('closeSettings');
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const configTabButtons = document.querySelectorAll('.config-tab-btn');
    const configContents = document.querySelectorAll('.config-content');
    const themeToggle = document.getElementById('themeToggle');
    const copyOutput = document.getElementById('copyOutput');
    const downloadOutput = document.getElementById('downloadOutput');
    const aboutLink = document.getElementById('aboutLink');
    const aboutModal = document.getElementById('aboutModal');
    const closeModal = document.getElementById('closeModal');
    
    // Prompt configuration elements
    const socialPrompt = document.getElementById('socialPrompt');
    const blogPrompt = document.getElementById('blogPrompt');
    const minimalPrompt = document.getElementById('minimalPrompt');
    const newsPrompt = document.getElementById('newsPrompt');
    const blogGenPrompt = document.getElementById('blogGenPrompt');
    const essayPrompt = document.getElementById('essayPrompt');
    const diaryPrompt = document.getElementById('diaryPrompt');
    const storyPrompt = document.getElementById('storyPrompt');
    
    // Default prompts
    const defaultPrompts = {
        // Format prompts
        social: "You are a social media copywriter. Format the following text into an engaging social media post using markdown. Use emojis, hashtags, and make it attention-grabbing. Keep it concise and impactful. Split into paragraphs, use bullet points if necessary, and emphasize key points:",
        blog: "You are a professional blog writer. Format the following text into a well-structured blog post using markdown. Add a catchy title, headings, subheadings, and organize the content logically. Use formatting such as bold, italic, bullet points, and quotes to enhance readability. Make it engaging, informative, and SEO-friendly:",
        minimal: "You are a minimalist writer. Format the following text into a clean, elegant output using markdown. Remove any unnecessary words, use simple formatting, and organize the content in a clear, concise manner. Focus on essential information only:",
        
        // Generation prompts
        news: "You are a professional journalist. Create a detailed newspaper article based on the following topic or keywords. Use a formal journalistic style with a catchy headline, subheadings, and well-structured paragraphs. Include potential quotes or statistics. Write in an informative, factual manner with an objective tone:",
        blogGen: "You are a professional blog writer. Create a comprehensive blog post based on the following topic or keywords. Include a catchy title, engaging introduction, clearly structured body with headings and subheadings, and a conclusion with a call to action. Use a conversational tone that connects with readers while providing valuable information:",
        essay: "You are an academic writer. Create a well-structured essay based on the following topic or keywords. Include an introduction with a clear thesis statement, logically organized body paragraphs with topic sentences and supporting evidence, and a conclusion that synthesizes the main points. Use a formal academic tone and appropriate citations where needed:",
        diary: "You are writing a personal diary entry. Create an intimate, reflective diary entry based on the following topic or keywords. Use a first-person perspective with emotional depth, personal reflections, and sensory details. The tone should be authentic, vulnerable, and introspective, as if writing for yourself:",
        story: "You are a creative fiction writer. Create a short story based on the following topic or keywords. Develop a brief but engaging narrative with a clear beginning, middle, and end. Include vivid descriptions, character development, and dialogue where appropriate. The story should evoke emotion and create a memorable impression:"
    };
    
    // State variables
    let selectedStyle = 'social';
    let selectedGenStyle = 'news';
    let selectedLanguage = 'italian';
    let conversationHistory = [];
    let genConversationHistory = [];
    
    // Add animation class to cards on load
    document.querySelectorAll('.card').forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = 1;
            card.style.transform = 'translateY(0) rotateY(0)';
        }, index * 200);
    });
    
    // Tab navigation
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Non applicare la logica al pulsante delle impostazioni
            if (!button.classList.contains('settings-btn')) {
                // Rimuovi la classe active da tutti i pulsanti di navigazione eccetto settings
                navButtons.forEach(btn => {
                    if (!btn.classList.contains('settings-btn')) {
                        btn.classList.remove('active');
                    }
                });
                
                // Rimuovi la classe active da tutti i contenuti delle tab
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Aggiungi la classe active al pulsante cliccato
                button.classList.add('active');
                
                // Attiva il contenuto della tab corrispondente
                const tabId = `${button.dataset.tab}Tab`;
                const targetTab = document.getElementById(tabId);
                if (targetTab) {
                    targetTab.classList.add('active');
                } else {
                    console.error(`Tab con ID ${tabId} non trovata!`);
                }
            }
        });
    });
    
    // Config tab navigation
    configTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            configTabButtons.forEach(btn => btn.classList.remove('active'));
            configContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });
    
    // Load saved prompts from localStorage if available
    const loadSavedPrompts = () => {
        const savedPrompts = localStorage.getItem('textFormatterPrompts');
        const savedGenPrompts = localStorage.getItem('textGeneratorPrompts');
        
        if (savedPrompts) {
            const prompts = JSON.parse(savedPrompts);
            socialPrompt.value = prompts.social;
            blogPrompt.value = prompts.blog;
            minimalPrompt.value = prompts.minimal;
        } else {
            // Use default prompts
            socialPrompt.value = defaultPrompts.social;
            blogPrompt.value = defaultPrompts.blog;
            minimalPrompt.value = defaultPrompts.minimal;
        }
        
        if (savedGenPrompts) {
            const genPrompts = JSON.parse(savedGenPrompts);
            newsPrompt.value = genPrompts.news;
            blogGenPrompt.value = genPrompts.blogGen;
            essayPrompt.value = genPrompts.essay;
            diaryPrompt.value = genPrompts.diary;
            storyPrompt.value = genPrompts.story;
        } else {
            // Use default generation prompts
            newsPrompt.value = defaultPrompts.news;
            blogGenPrompt.value = defaultPrompts.blogGen;
            essayPrompt.value = defaultPrompts.essay;
            diaryPrompt.value = defaultPrompts.diary;
            storyPrompt.value = defaultPrompts.story;
        }
    };
    
    loadSavedPrompts();
    
    // Style button selection for formatting
    styleButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            styleButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Update selected style
            selectedStyle = button.dataset.style;
            
            // Add animation effect
            button.classList.add('pulse');
            setTimeout(() => {
                button.classList.remove('pulse');
            }, 300);
        });
    });
    
    // Generation style select
    genStyleSelect.addEventListener('change', () => {
        selectedGenStyle = genStyleSelect.value;
    });
    
    // Language select
    languageSelect.addEventListener('change', () => {
        selectedLanguage = languageSelect.value;
        
        // Show/hide custom language input based on selection
        const customLanguageWrapper = document.getElementById('customLanguageWrapper');
        if (selectedLanguage === 'custom') {
            customLanguageWrapper.classList.remove('hidden');
            // Focus the input field for better UX
            const customLanguageInput = document.getElementById('customLanguage');
            customLanguageInput.focus();
            // If there's already a value in the custom input, use it
            if (customLanguageInput.value.trim() !== '') {
                customLanguageInput.dataset.customValue = customLanguageInput.value.trim();
            }
        } else {
            customLanguageWrapper.classList.add('hidden');
        }
    });
    
    // Handle custom language input
    const customLanguageInput = document.getElementById('customLanguage');
    customLanguageInput.addEventListener('input', () => {
        if (customLanguageInput.value.trim() !== '') {
            // Store the custom value in a data attribute for persistence
            customLanguageInput.dataset.customValue = customLanguageInput.value.trim();
            console.log('Custom language set to:', customLanguageInput.dataset.customValue);
        }
    });
    
    // Make sure the custom language wrapper is initially hidden
    const customLanguageWrapper = document.getElementById('customLanguageWrapper');
    customLanguageWrapper.classList.add('hidden');
    
    // Set initial active style
    styleButtons[0].classList.add('active');
    
    // Theme toggle functionality
    const setTheme = (isDark) => {
        if (isDark) {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('darkTheme', 'true');
        } else {
            document.body.classList.remove('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('darkTheme', 'false');
        }
    };
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true' || (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setTheme(true);
    } else {
        setTheme(false);
    }
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', () => {
        const isDarkTheme = document.body.classList.contains('dark-theme');
        setTheme(!isDarkTheme);
    });
    
    // Toggle configuration panel
    configToggle.addEventListener('click', () => {
        configPanel.classList.toggle('hidden');
        
        // Evidenzia il pulsante delle impostazioni se il pannello è aperto
        if (!configPanel.classList.contains('hidden')) {
            configToggle.classList.add('active');
        } else {
            configToggle.classList.remove('active');
        }
    });
    
    // Close settings panel
    closeSettings.addEventListener('click', () => {
        configPanel.classList.add('hidden');
        configToggle.classList.remove('active');
    });
    
    // About modal
    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        aboutModal.classList.remove('hidden');
    });
    
    closeModal.addEventListener('click', () => {
        aboutModal.classList.add('hidden');
    });
    
    // Close modal when clicking outside
    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) {
            aboutModal.classList.add('hidden');
        }
    });
    
    // Save configuration
    saveConfig.addEventListener('click', () => {
        const formatPrompts = {
            social: socialPrompt.value,
            blog: blogPrompt.value,
            minimal: minimalPrompt.value
        };
        
        const genPrompts = {
            news: newsPrompt.value,
            blogGen: blogGenPrompt.value,
            essay: essayPrompt.value,
            diary: diaryPrompt.value,
            story: storyPrompt.value
        };
        
        localStorage.setItem('textFormatterPrompts', JSON.stringify(formatPrompts));
        localStorage.setItem('textGeneratorPrompts', JSON.stringify(genPrompts));
        
        // Show success message
        showNotification('Configurazione salvata!', 'success');
        
        configPanel.classList.add('hidden');
        configToggle.innerHTML = '<i class="fas fa-cog"></i> Impostazioni';
    });
    
    // Helper function to show notifications
    const showNotification = (message, type = 'success') => {
        const notificationContainer = document.getElementById('notification-container');
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = type === 'success' 
            ? '<i class="fas fa-check-circle"></i>' 
            : '<i class="fas fa-exclamation-circle"></i>';
        
        const title = type === 'success' ? 'Success' : 'Error';
        
        notification.innerHTML = `
            ${icon}
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;
        
        notificationContainer.appendChild(notification);
        
        // Force reflow for animation
        notification.offsetHeight;
        
        // Animation to slide in
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                notificationContainer.removeChild(notification);
            }, 300);
        }, 3000);
    };
    
    // Format text function
    formatBtn.addEventListener('click', async () => {
        const userText = userTextArea.value.trim();
        
        if (!userText) {
            showNotification('Please enter text to format.', 'error');
            return;
        }
        
        // Show loader and processing state
        showProcessingState();
        formatBtn.classList.add('processing');
        formatBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Formattazione...';
        formatBtn.disabled = true;
        
        try {
            // Get the appropriate prompt based on selected style
            let prompt;
            switch (selectedStyle) {
                case 'social':
                    prompt = socialPrompt.value;
                    break;
                case 'blog':
                    prompt = blogPrompt.value;
                    break;
                case 'minimal':
                    prompt = minimalPrompt.value;
                    break;
                default:
                    prompt = socialPrompt.value;
            }
            
            // Prepare the message for AI
            const newMessage = {
                role: "user",
                content: `${prompt}\n\n${userText}`
            };
            
            // Add the new message to conversation history
            conversationHistory.push(newMessage);
            
            // Only keep the last 5 messages to avoid token limits
            conversationHistory = conversationHistory.slice(-5);
            
            // Determina la lingua corrente per la risposta
            let languageInstruction;
            const languageMap = {
                'italian': 'Response should be in Italian.',
                'english': 'Response should be in English.',
                'spanish': 'Response should be in Spanish.',
                'french': 'Response should be in French.',
                'german': 'Response should be in German.',
                'portuguese': 'Response should be in Portuguese.',
                'chinese': 'Response should be in Chinese.',
                'japanese': 'Response should be in Japanese.',
                'korean': 'Response should be in Korean.'
            };
            
            // Handle custom language or use predefined language instruction
            if (selectedLanguage === 'custom') {
                const customLanguageInput = document.getElementById('customLanguage');
                const customLanguage = customLanguageInput.value.trim() || customLanguageInput.dataset.customValue || '';
                
                if (customLanguage) {
                    languageInstruction = `Response should be in ${customLanguage}.`;
                } else {
                    languageInstruction = languageMap['italian']; // Default to Italian if custom is empty
                }
            } else {
                languageInstruction = languageMap[selectedLanguage] || languageMap['italian'];
            }
            
            // Make the API call to the AI
            const completion = await LLMAgnostic.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are an expert text formatter who converts user's text into well-formatted markdown according to the specified style. ${languageInstruction}`
                    },
                    ...conversationHistory
                ]
            });
            
            // Add AI response to conversation history
            conversationHistory.push(completion);
            
            // Display the formatted markdown
            displayOutput(completion.content);
            
        } catch (error) {
            console.error('Error:', error);
            markdownOutput.innerHTML = `<p style="color: red;"><i class="fas fa-exclamation-triangle"></i> Errore: Impossibile formattare il testo. Riprova.</p>`;
            markdownOutput.style.filter = 'none';
        } finally {
            // Reset processing state
            resetProcessingState();
            formatBtn.classList.remove('processing');
            formatBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Formatta';
            formatBtn.disabled = false;
        }
    });
    
    // Generate text function
    generateBtn.addEventListener('click', async () => {
        const keywords = genKeywordsArea.value.trim();
        
        if (!keywords) {
            showNotification('Inserisci delle parole chiave o un argomento.', 'error');
            return;
        }
        
        // Show loader and processing state
        showProcessingState();
        generateBtn.classList.add('processing');
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generazione...';
        generateBtn.disabled = true;
        
        try {
            // Get the appropriate prompt based on selected generation style
            let prompt;
            switch (selectedGenStyle) {
                case 'news':
                    prompt = newsPrompt.value;
                    break;
                case 'blog':
                    prompt = blogGenPrompt.value;
                    break;
                case 'essay':
                    prompt = essayPrompt.value;
                    break;
                case 'diary':
                    prompt = diaryPrompt.value;
                    break;
                case 'story':
                    prompt = storyPrompt.value;
                    break;
                default:
                    prompt = newsPrompt.value;
            }
            
            // Prepare the message for AI with language instruction
            let languageInstruction;
            
            // Mappa le lingue con la relativa istruzione tradotta (mantenendo i prompt in inglese)
            const languageMap = {
                'italian': 'Response should be in Italian.',
                'english': 'Response should be in English.',
                'spanish': 'Response should be in Spanish.',
                'french': 'Response should be in French.',
                'german': 'Response should be in German.',
                'portuguese': 'Response should be in Portuguese.',
                'chinese': 'Response should be in Chinese.',
                'japanese': 'Response should be in Japanese.',
                'korean': 'Response should be in Korean.'
            };
            
            // Handle custom language or use predefined language instruction
            if (selectedLanguage === 'custom') {
                const customLanguageInput = document.getElementById('customLanguage');
                const customLanguage = customLanguageInput.value.trim() || customLanguageInput.dataset.customValue || '';
                
                if (customLanguage) {
                    languageInstruction = `Response should be in ${customLanguage}.`;
                } else {
                    languageInstruction = languageMap['italian']; // Default to Italian if custom is empty
                }
            } else {
                languageInstruction = languageMap[selectedLanguage] || languageMap['italian'];
            }
            
            const newMessage = {
                role: "user",
                content: `${prompt}\n\n${keywords}\n\n${languageInstruction}`
            };
            
            // Add the new message to generation conversation history
            genConversationHistory.push(newMessage);
            
            // Only keep the last 5 messages to avoid token limits
            genConversationHistory = genConversationHistory.slice(-5);
            
            // Make the API call to the AI
            const completion = await LLMAgnostic.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are an expert content creator who generates high-quality texts based on keywords or topics provided by the user. The instruction prompts are in English, and you should always respond in the language specified by the user at the end of the message. You support Italian, English, Spanish, French, and German perfectly, with correct grammar and style.`
                    },
                    ...genConversationHistory
                ]
            });
            
            // Add AI response to conversation history
            genConversationHistory.push(completion);
            
            // Display the generated text
            displayOutput(completion.content);
            
        } catch (error) {
            console.error('Error:', error);
            markdownOutput.innerHTML = `<p style="color: red;"><i class="fas fa-exclamation-triangle"></i> Errore: Impossibile generare il testo. Riprova.</p>`;
            markdownOutput.style.filter = 'none';
        } finally {
            // Reset processing state
            resetProcessingState();
            generateBtn.classList.remove('processing');
            generateBtn.innerHTML = '<i class="fas fa-robot"></i> Genera testo';
            generateBtn.disabled = false;
        }
    });
    
    // Helper function to display output
    const displayOutput = (content) => {
        markdownOutput.style.opacity = 0;
        markdownOutput.innerHTML = marked.parse(content);
        
        setTimeout(() => {
            markdownOutput.style.opacity = 1;
            markdownOutput.style.transition = 'opacity 0.5s ease';
            markdownOutput.style.filter = 'none';
        }, 300);
    };
    
    // Copy output to clipboard
    copyOutput.addEventListener('click', () => {
        const outputText = markdownOutput.innerText;
        
        if (!outputText.trim()) {
            showNotification('Nessun contenuto da copiare!', 'error');
            return;
        }
        
        navigator.clipboard.writeText(outputText)
            .then(() => {
                showNotification('Contenuto copiato negli appunti!', 'success');
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
                showNotification('Impossibile copiare il contenuto', 'error');
            });
    });
    
    // Download output as markdown file
    downloadOutput.addEventListener('click', () => {
        const outputText = markdownOutput.innerText;
        
        if (!outputText.trim()) {
            showNotification('Nessun contenuto da scaricare!', 'error');
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
        
        showNotification('Contenuto scaricato come file markdown!', 'success');
    });
    
    // Helper function to show processing state
    const showProcessingState = () => {
        console.log('Showing processing state - loader visible');
        loader.classList.remove('hidden');
        markdownOutput.style.filter = 'blur(3px)';
        markdownOutput.innerHTML = '';
    };
    
    // Ensure loader is hidden when the page is fully loaded
    window.addEventListener('load', () => {
        console.log('Window fully loaded - ensuring loader is hidden');
        if (loader) {
            loader.classList.add('hidden');
        }
    });
    
    // For better mobile display, update the processing state function
    const resetProcessingState = () => {
        loader.classList.add('hidden');
        
        // Reset format button if it was being used
        if (formatBtn.classList.contains('processing')) {
            formatBtn.classList.remove('processing');
            formatBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Formatta';
            formatBtn.disabled = false;
        }
        
        // Reset generate button if it was being used
        if (generateBtn.classList.contains('processing')) {
            generateBtn.classList.remove('processing');
            generateBtn.innerHTML = '<i class="fas fa-robot"></i> Genera testo';
            generateBtn.disabled = false;
        }
    };
    

