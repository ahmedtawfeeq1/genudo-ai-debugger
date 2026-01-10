export const LLM_PROVIDERS = {
    gemini: {
        name: "Google Gemini",
        models: [
            { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
            { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
            { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
        ],
    },
    openai: {
        name: "OpenAI",
        models: [
            { id: "gpt-4o", name: "GPT-4o" },
            { id: "gpt-4o-mini", name: "GPT-4o Mini" },
            { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
        ],
    },
    anthropic: {
        name: "Anthropic",
        models: [
            { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4" },
            { id: "claude-3-5-sonnet-20240620", name: "Claude 3.5 Sonnet" },
            { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku" },
        ],
    },
    groq: {
        name: "Groq",
        models: [
            { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B" },
            { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B" },
            { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" },
        ],
    },
    cohere: {
        name: "Cohere",
        models: [
            { id: "command-r7b-12-2024", name: "Command R7B" },
            { id: "command-r-plus", name: "Command R+" },
        ],
    },
} as const;

export type ProviderId = keyof typeof LLM_PROVIDERS;
