// Base Configuration and Constants
const CONFIG = {
    THEME: {
        LIGHT: 'light-theme',
        DARK: 'dark-theme',
        STORAGE_KEY: 'textStudioTheme'
    },
    NOTIFICATION: {
        STORAGE_KEY: 'textStudioNotification'
    },
    SETTINGS: {
        STORAGE_KEY: 'textStudioSettingsOpen'
    },
    ABOUT: {
        STORAGE_KEY: 'textStudioAboutOpen'
    },
    API: {
        STORAGE_KEY: 'textStudioAPIConfig',
        PROVIDERS: {
            'mock': {
                name: 'Demo Mode (No API)',
                description: 'Uses pre-defined mock responses for demonstration purposes.',
                tokenRequired: false,
                endpointRequired: false,
                modelOptions: []
            },
            'huggingface': {
                name: 'Hugging Face',
                description: 'Connect to Hugging Face\'s Inference API with your token.',
                tokenRequired: true,
                endpointRequired: false,
                modelOptions: [
                    { value: 'mistralai/Mistral-7B-Instruct-v0.2', name: 'Mistral 7B Instruct' },
                    { value: 'meta-llama/Llama-2-7b-chat-hf', name: 'Meta Llama 2 7B Chat' },
                    { value: 'tiiuae/falcon-7b-instruct', name: 'Falcon 7B Instruct' },
                    { value: 'gpt2', name: 'GPT-2' },
                    { value: 'custom', name: 'Custom Model' }
                ]
            },
            'openai': {
                name: 'OpenAI',
                description: 'Access to OpenAI\'s models like GPT-3.5 and GPT-4.',
                tokenRequired: true,
                endpointRequired: false,
                modelOptions: [
                    { value: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
                    { value: 'gpt-4', name: 'GPT-4' },
                    { value: 'gpt-4-turbo', name: 'GPT-4 Turbo' }
                ]
            },
            'azure': {
                name: 'Azure OpenAI',
                description: 'Microsoft Azure\'s OpenAI service with your own deployment.',
                tokenRequired: true,
                endpointRequired: true,
                modelOptions: [
                    { value: 'your-deployment-name', name: 'Your Azure OpenAI Deployment' }
                ]
            },
            'anthropic': {
                name: 'Anthropic Claude',
                description: 'Anthropic\'s Claude models for text generation.',
                tokenRequired: true,
                endpointRequired: false,
                modelOptions: [
                    { value: 'claude-2', name: 'Claude 2' },
                    { value: 'claude-instant-1', name: 'Claude Instant' }
                ]
            }
        }
    },
    PROMPTS: {
        FORMAT: {
            STORAGE_KEY: 'textFormatterPrompts',
            DEFAULT: {
                social: "You are a social media copywriter. Format the following text into an engaging social media post using markdown. Use emojis, hashtags, and make it attention-grabbing. Keep it concise and impactful. Split into paragraphs, use bullet points if necessary, and emphasize key points:",
                blog: "You are a professional blog writer. Format the following text into a well-structured blog post using markdown. Add a catchy title, headings, subheadings, and organize the content logically. Use formatting such as bold, italic, bullet points, and quotes to enhance readability. Make it engaging, informative, and SEO-friendly:",
                minimal: "You are a minimalist writer. Format the following text into a clean, elegant output using markdown. Remove any unnecessary words, use simple formatting, and organize the content in a clear, concise manner. Focus on essential information only:"
            }
        },
        GENERATE: {
            STORAGE_KEY: 'textGeneratorPrompts',
            DEFAULT: {
                news: "You are a professional journalist. Create a detailed newspaper article based on the following topic or keywords. Use a formal journalistic style with a catchy headline, subheadings, and well-structured paragraphs. Include potential quotes or statistics. Write in an informative, factual manner with an objective tone:",
                blog: "You are a professional blog writer. Create a comprehensive blog post based on the following topic or keywords. Include a catchy title, engaging introduction, clearly structured body with headings and subheadings, and a conclusion with a call to action. Use a conversational tone that connects with readers while providing valuable information:",
                essay: "You are an academic writer. Create a well-structured essay based on the following topic or keywords. Include an introduction with a clear thesis statement, logically organized body paragraphs with topic sentences and supporting evidence, and a conclusion that synthesizes the main points. Use a formal academic tone and appropriate citations where needed:",
                diary: "You are writing a personal diary entry. Create an intimate, reflective diary entry based on the following topic or keywords. Use a first-person perspective with emotional depth, personal reflections, and sensory details. The tone should be authentic, vulnerable, and introspective, as if writing for yourself:",
                story: "You are a creative fiction writer. Create a short story based on the following topic or keywords. Develop a brief but engaging narrative with a clear beginning, middle, and end. Include vivid descriptions, character development, and dialogue where appropriate. The story should evoke emotion and create a memorable impression:"
            }
        }
    },
    LANGUAGES: {
        DEFAULT: 'italian',
        OPTIONS: {
            'italian': 'Response should be in Italian.',
            'english': 'Response should be in English.',
            'spanish': 'Response should be in Spanish.',
            'french': 'Response should be in French.',
            'german': 'Response should be in German.',
            'portuguese': 'Response should be in Portuguese.',
            'chinese': 'Response should be in Chinese.',
            'japanese': 'Response should be in Japanese.',
            'korean': 'Response should be in Korean.'
        }
    }
};

export default CONFIG;
 