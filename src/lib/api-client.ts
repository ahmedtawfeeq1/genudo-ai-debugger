import { ChatRequest, ChatResponse } from "./types";

// Use proxy endpoints
const PROXY_URL = "/api/proxy";
const STREAM_PROXY_URL = "/api/proxy/stream";

export async function sendChatRequest(
    baseUrl: string,
    apiKey: string,
    payload: ChatRequest
): Promise<ChatResponse> {
    const response = await fetch(PROXY_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            targetUrl: `${baseUrl}/api/v1/chat`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": apiKey,
            },
            body: payload
        }),
    });

    if (!response.ok) {
        let errorMsg = `API Error: ${response.status} ${response.statusText}`;
        try {
            const errorData = await response.json();
            console.log("Error details:", errorData);

            if (errorData.details && Array.isArray(errorData.details)) {
                // Handle Pydantic validation errors
                const details = errorData.details.map((d: any) =>
                    `• Field: ${d.field}\n  Error: ${d.message}`
                ).join("\n");
                errorMsg = `Validation Error:\n${details}`;
            } else if (errorData.message) {
                errorMsg = `${errorData.message}`;
            } else if (errorData.detail) {
                // Fast API detail
                errorMsg = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
            }
        } catch {
            const text = await response.text();
            if (text) errorMsg += ` - ${text.slice(0, 100)}`;
        }
        throw new Error(errorMsg);
    }

    return response.json();
}

export async function* streamChatRequest(
    baseUrl: string,
    apiKey: string,
    payload: ChatRequest
): AsyncGenerator<{ content?: string; done?: boolean; response?: ChatResponse }> {
    // Use the streaming proxy
    const response = await fetch(STREAM_PROXY_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            targetUrl: `${baseUrl}/api/v1/chat/stream`,
            apiKey,
            body: payload
        }),
    });

    if (!response.ok) {
        let errorMsg = `API Error ${response.status}: ${response.statusText}`;
        try {
            const errorData = await response.json();

            if (errorData.details && Array.isArray(errorData.details)) {
                // Handle Pydantic validation errors
                const details = errorData.details.map((d: any) =>
                    `• Field: ${d.field}\n  Error: ${d.message}`
                ).join("\n");
                errorMsg = `Validation Error:\n${details}`;
            } else if (errorData.message) {
                errorMsg = `${errorData.message}`;
            } else if (errorData.detail) {
                errorMsg = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
            }
        } catch {
            const text = await response.text();
            if (text) errorMsg += ` - ${text.slice(0, 100)}`;
        }
        throw new Error(errorMsg);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
            if (line.startsWith("data: ")) {
                try {
                    const data = JSON.parse(line.slice(6));
                    yield data;
                } catch {
                    // Skip invalid JSON
                }
            }
        }
    }
}

export async function checkHealth(baseUrl: string, apiKey: string): Promise<{ success: boolean; error?: string }> {
    try {
        // Use the general proxy
        const response = await fetch(PROXY_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                targetUrl: `${baseUrl}/api/v1/health`,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": apiKey,
                }
            })
        });

        if (!response.ok) {
            // ... existing error handling logic depends on proxy forwarding status codes correctly
            // The proxy implemented returns status from target
            return { success: false, error: `${response.status} ${response.statusText}` };
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Network error" };
    }
}

export function getLangfuseSessionUrl(conversationId: string | number): string {
    const projectId = process.env.NEXT_PUBLIC_LANGFUSE_PROJECT_ID || "cm4zcqw7501opgv34az1apb7l";
    return `https://cloud.langfuse.com/project/${projectId}/sessions/conversation_${conversationId}`;
}

export function getLangfuseTraceUrl(traceId: string, timestamp?: string): string {
    const projectId = process.env.NEXT_PUBLIC_LANGFUSE_PROJECT_ID || "cm4zcqw7501opgv34az1apb7l";
    let url = `https://cloud.langfuse.com/project/${projectId}/traces/${traceId}`;
    if (timestamp) {
        url += `?timestamp=${encodeURIComponent(timestamp)}`;
    }
    return url;
}
