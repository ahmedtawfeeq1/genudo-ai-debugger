export const LLM_PROVIDERS = {
    openai: {
        name: "OpenAI",
        models: [
            { id: "gpt-5.2-2025-12-11", name: "GPT-5.2 (Dec 2025)" },
            { id: "gpt-5.1-2025-11-13", name: "GPT-5.1 (Nov 2025)" },
            { id: "gpt-5-2025-08-07", name: "GPT-5 (Aug 2025)" },
            { id: "gpt-5-mini-2025-08-07", name: "GPT-5 Mini" },
            { id: "gpt-5-nano-2025-08-07", name: "GPT-5 Nano" },
            { id: "o4-mini-2025-04-16", name: "o4 Mini" },
            { id: "o3-mini-2025-01-31", name: "o3 Mini" },
            { id: "o3-2025-04-16", name: "o3" },
            { id: "gpt-4.1-2025-04-14", name: "GPT-4.1" },
            { id: "gpt-4.1-mini-2025-04-14", name: "GPT-4.1 Mini" },
            { id: "gpt-4.1-nano-2025-04-14", name: "GPT-4.1 Nano" },
            { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
            { id: "gpt-4o", name: "GPT-4o" },
            { id: "gpt-4o-mini", name: "GPT-4o Mini" },
            { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
        ],
    },
    gemini: {
        name: "Google Gemini",
        models: [
            { id: "gemini-3-pro-preview", name: "Gemini 3 Pro Preview" },
            { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
            { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
            { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
            { id: "gemini-2.0-flash-001", name: "Gemini 2.0 Flash" },
            { id: "gemini-2.0-flash-lite-001", name: "Gemini 2.0 Flash Lite" },
            { id: "gemini-1.5-pro-latest", name: "Gemini 1.5 Pro" },
        ],
    },
    anthropic: {
        name: "Anthropic",
        models: [
            { id: "claude-sonnet-4-5-20250929", name: "Claude Sonnet 4.5" },
            { id: "claude-haiku-4-5-20251001", name: "Claude Haiku 4.5" },
            { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4" },
            { id: "claude-3-7-sonnet-latest", name: "Claude 3.7 Sonnet" },
            { id: "claude-3-5-sonnet-latest", name: "Claude 3.5 Sonnet (Latest)" },
            { id: "claude-3-5-sonnet-20240620", name: "Claude 3.5 Sonnet (June 2024)" },
        ],
    },
    cohere: {
        name: "Cohere",
        models: [
            { id: "command-r-plus", name: "Command R+" },
            { id: "command-r", name: "Command R" },
            { id: "command-a-03-2025", name: "Command A (Mar 2025)" },
            { id: "command-r7b-12-2024", name: "Command R7B (Dec 2024)" },
        ],
    },
    meta: {
        name: "Meta Llama",
        models: [
            { id: "llama-3.3-70b-specdec", name: "Llama 3.3 70B SpecDec" },
        ],
    },
    qwen: {
        name: "Qwen",
        models: [
            { id: "qwen-plus", name: "Qwen Plus" },
            { id: "qwen-max", name: "Qwen Max" },
        ],
    },
} as const;

export const EMBEDDING_PROVIDERS = {
    openai: {
        name: "OpenAI",
        models: [
            { id: "text-embedding-3-small", name: "Text Embedding 3 Small" },
            { id: "text-embedding-3-large", name: "Text Embedding 3 Large" },
            { id: "text-embedding-ada-002", name: "Text Embedding Ada 002" },
        ],
    },
    cohere: {
        name: "Cohere",
        models: [
            { id: "embed-multilingual-v3.0", name: "Embed Multilingual v3.0" },
        ],
    },
} as const;

export type ProviderId = keyof typeof LLM_PROVIDERS;
export type EmbeddingProviderId = keyof typeof EMBEDDING_PROVIDERS;
