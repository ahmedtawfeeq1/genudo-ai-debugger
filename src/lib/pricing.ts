export const MODEL_PRICING: Record<string, number> = {
    // OpenAI
    "gpt-5.2-2025-12-11:input": 0.00175,
    "gpt-5.2-2025-12-11:output": 0.014,

    "gpt-5.1-2025-11-13:input": 0.00125,
    "gpt-5.1-2025-11-13:output": 0.01,

    "gpt-5-2025-08-07:input": 0.00125,
    "gpt-5-2025-08-07:output": 0.01,

    "gpt-5-mini-2025-08-07:input": 0.00025,
    "gpt-5-mini-2025-08-07:output": 0.002,

    "gpt-5-nano-2025-08-07:input": 0.00005,
    "gpt-5-nano-2025-08-07:output": 0.0004,

    "o4-mini-2025-04-16:input": 0.0011,
    "o4-mini-2025-04-16:output": 0.0044,

    "o3-mini-2025-01-31:input": 0.0011,
    "o3-mini-2025-01-31:output": 0.0044,

    "o3-2025-04-16:input": 0.01,
    "o3-2025-04-16:output": 0.04, // Corrected typo from user input '166' to '16' based on pattern

    "gpt-4.1-2025-04-14:input": 0.002,
    "gpt-4.1-2025-04-14:output": 0.008,

    "gpt-4.1-mini-2025-04-14:input": 0.0004,
    "gpt-4.1-mini-2025-04-14:output": 0.0016,

    "gpt-4.1-nano-2025-04-14:input": 0.0001,
    "gpt-4.1-nano-2025-04-14:output": 0.0004,

    "gpt-4-turbo:input": 0.01,
    "gpt-4-turbo:output": 0.03,

    "gpt-4o:input": 0.0025,
    "gpt-4o:output": 0.01,

    "gpt-4o-mini:input": 0.00015,
    "gpt-4o-mini:output": 0.0006,

    "gpt-3.5-turbo:input": 0.0005,
    "gpt-3.5-turbo:output": 0.0015,

    // Embeddings
    "text-embedding-3-small:input": 0.00002,
    "text-embedding-3-large:input": 0.00013,
    "text-embedding-ada-002:input": 0.0001,
    "embed-multilingual-v3.0:input": 0.00001,

    // Cohere
    "command-r-plus:input": 0.0025,
    "command-r-plus:output": 0.01,

    "command-r:input": 0.00015,
    "command-r:output": 0.0006,

    "command-a-03-2025:input": 0.0025,
    "command-a-03-2025:output": 0.01,

    "command-r7b-12-2024:input": 0.0000375,
    "command-r7b-12-2024:output": 0.00015,

    // Gemini
    "gemini-3-pro-preview:input": 0.002,
    "gemini-3-pro-preview:output": 0.012,

    "gemini-2.5-pro:input": 0.00125,
    "gemini-2.5-pro:output": 0.01,

    "gemini-2.5-flash:input": 0.0003,
    "gemini-2.5-flash:output": 0.0025,

    "gemini-2.5-flash-lite:input": 0.0001,
    "gemini-2.5-flash-lite:output": 0.0004,

    "gemini-2.0-flash-001:input": 0.0001,
    "gemini-2.0-flash-001:output": 0.0004,

    "gemini-2.0-flash-lite-001:input": 0.000075,
    "gemini-2.0-flash-lite-001:output": 0.0003,

    "gemini-1.5-pro-latest:input": 0.00125,
    "gemini-1.5-pro-latest:output": 0.005,

    // Anthropic
    "claude-sonnet-4-5-20250929:input": 0.003,
    "claude-sonnet-4-5-20250929:output": 0.015,

    "claude-haiku-4-5-20251001:input": 0.001,
    "claude-haiku-4-5-20251001:output": 0.005,

    "claude-sonnet-4-20250514:input": 0.003,
    "claude-sonnet-4-20250514:output": 0.015,

    "claude-3-7-sonnet-latest:input": 0.003,
    "claude-3-7-sonnet-latest:output": 0.015,

    "claude-3-5-sonnet-latest:input": 0.003,
    "claude-3-5-sonnet-latest:output": 0.015,

    "claude-3-5-sonnet-20240620:input": 0.003,
    "claude-3-5-sonnet-20240620:output": 0.015,

    // Llama
    "llama-3.3-70b-specdec:input": 0.00059,
    "llama-3.3-70b-specdec:output": 0.00099,

    // Qwen
    "qwen-plus:input": 0.0004,
    "qwen-plus:output": 0.0012,

    "qwen-max:input": 0.0016,
    "qwen-max:output": 0.0064,
};
