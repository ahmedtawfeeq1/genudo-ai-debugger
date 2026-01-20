"use client";

import { useState, useCallback } from "react";
import { useDebuggerStore } from "@/lib/store";
import { streamChatRequest, sendChatRequest } from "@/lib/api-client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

export function ChatInput() {
    const [input, setInput] = useState("");
    const {
        baseUrl,
        apiKey,
        payload,
        addMessage,
        updateLastAssistantMessage,
        setIsStreaming,
        isStreaming,
        setCurrentResponse,
        setPayload,
        setError,
        isStreamingEnabled,
    } = useDebuggerStore();

    const handleSend = useCallback(async () => {
        if (!input.trim() || isStreaming) return;

        const userMessage = input.trim();
        setInput("");

        // Add user message to chat
        const userMsgId = "user_" + Date.now();
        addMessage({
            id: userMsgId,
            role: "user",
            content: userMessage,
            timestamp: new Date(),
        });

        // Update payload with new message
        const updatedPayload = {
            ...payload,
            messages: payload.messages.map((m, i) =>
                i === payload.messages.length - 1
                    ? { ...m, message: userMessage, id: "msg_" + Date.now() }
                    : m
            ),
        };

        // Add placeholder assistant message
        const assistantMsgId = "assistant_" + Date.now();
        addMessage({
            id: assistantMsgId,
            role: "assistant",
            content: "",
            timestamp: new Date(),
        });

        setIsStreaming(true);
        setError(null);

        try {
            if (isStreamingEnabled) {
                let streamedContent = "";
                for await (const chunk of streamChatRequest(baseUrl, apiKey, updatedPayload)) {
                    if (chunk.content) {
                        streamedContent += chunk.content;
                        updateLastAssistantMessage(streamedContent);
                    }

                    if (chunk.done && chunk.response) {
                        // Update with final response (handle multiple messages)
                        setCurrentResponse(chunk.response);

                        const responseMessages = chunk.response.ai_responses && chunk.response.ai_responses.length > 0
                            ? chunk.response.ai_responses
                            : [chunk.response.ai_response];

                        responseMessages.forEach((msg, index) => {
                            const isLast = index === responseMessages.length - 1;
                            if (index === 0) {
                                updateLastAssistantMessage(msg, isLast ? chunk.response : undefined);
                            } else {
                                addMessage({
                                    id: "assistant_" + Date.now() + "_" + index,
                                    role: "assistant",
                                    content: msg,
                                    timestamp: new Date(),
                                    response: isLast ? chunk.response : undefined
                                });
                            }
                        });


                        // Update history for next request
                        const aiHistoryMessages = responseMessages.map((msg, i) => ({
                            id: assistantMsgId + "_" + i,
                            role: "assistant" as const,
                            message: msg,
                        }));

                        const newHistory = [
                            ...payload.history,
                            {
                                id: userMsgId,
                                role: "user" as const,
                                message: userMessage,
                            },
                            ...aiHistoryMessages,
                        ];
                        const nextStageId = chunk.response.stage_transition?.to_stage_id;
                        const newOpportunity = nextStageId ? { ...updatedPayload.opportunity, stage_id: nextStageId } : updatedPayload.opportunity;

                        setPayload({ ...updatedPayload, history: newHistory, opportunity: newOpportunity });
                    }
                }
            } else {
                // Non-streaming request
                const response = await sendChatRequest(baseUrl, apiKey, updatedPayload);

                setCurrentResponse(response);

                // Show response (handle multiple messages)
                const responseMessages = response.ai_responses && response.ai_responses.length > 0
                    ? response.ai_responses
                    : [response.ai_response];

                responseMessages.forEach((msg, index) => {
                    const isLast = index === responseMessages.length - 1;
                    if (index === 0) {
                        updateLastAssistantMessage(msg, isLast ? response : undefined);
                    } else {
                        addMessage({
                            id: "assistant_" + Date.now() + "_" + index,
                            role: "assistant",
                            content: msg,
                            timestamp: new Date(),
                            response: isLast ? response : undefined
                        });
                    }
                });

                // Update history for next request
                const aiHistoryMessages = responseMessages.map((msg, i) => ({
                    id: assistantMsgId + "_" + i,
                    role: "assistant" as const,
                    message: msg,
                }));

                const newHistory = [
                    ...payload.history,
                    {
                        id: userMsgId,
                        role: "user" as const,
                        message: userMessage,
                    },
                    ...aiHistoryMessages,
                ];
                const nextStageId = response.stage_transition?.to_stage_id;
                const newOpportunity = nextStageId ? { ...updatedPayload.opportunity, stage_id: nextStageId } : updatedPayload.opportunity;

                setPayload({ ...updatedPayload, history: newHistory, opportunity: newOpportunity });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            setError(errorMessage);
            updateLastAssistantMessage(`Error: ${errorMessage}`);
        } finally {
            setIsStreaming(false);
        }
    }, [
        input,
        isStreaming,
        baseUrl,
        apiKey,
        payload,
        addMessage,
        updateLastAssistantMessage,
        setIsStreaming,
        setCurrentResponse,
        setPayload,
        setError,
    ]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="p-4 border-t">
            <div className="flex gap-2">
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
                    className="min-h-[60px] max-h-[120px] resize-none"
                />
                <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isStreaming}
                    size="icon"
                    className="h-[60px] w-[60px]"
                >
                    {isStreaming ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <Send className="h-5 w-5" />
                    )}
                </Button>
            </div>
        </div>
    );
}
