"use client";

import { useState } from "react";
import { Message } from "@/lib/types";
import { useDebuggerStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { User, Bot, Code, X } from "lucide-react";
import { JsonErrorViewer } from "@/components/ui/json-error-viewer";
import { Badge } from "@/components/ui/badge";

interface MessageBubbleProps {
    message: Message;
}

// RTL languages
const RTL_LANGUAGES = ["ar", "he", "fa", "ur", "yi", "ps", "ku"];

export function MessageBubble({ message }: MessageBubbleProps) {
    const [showJson, setShowJson] = useState(false);
    const isUser = message.role === "user";
    const response = message.response;

    // Determine text direction based on detected_language for AI messages
    const { forceRTL } = useDebuggerStore();
    const detectedLanguage = response?.flags?.detected_language;
    const isRTL = forceRTL || (detectedLanguage && RTL_LANGUAGES.includes(detectedLanguage.toLowerCase()));

    return (
        <div className="space-y-1">
            <div
                className={cn(
                    "flex gap-3",
                    isUser ? "flex-row-reverse" : "flex-row"
                )}
            >
                <div
                    className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                        isUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                    )}
                >
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div
                    className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2",
                        isUser
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-secondary text-secondary-foreground rounded-tl-sm"
                    )}
                    dir={isRTL && !isUser ? "rtl" : "ltr"}
                >
                    <div className="whitespace-pre-wrap break-words text-sm">
                        {!isUser && !message.content ? (
                            <div className="flex gap-1 items-center h-5 px-1">
                                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></span>
                            </div>
                        ) : (
                            (() => {
                                try {
                                    const content = message.content.trim();
                                    if (content.startsWith("Error: {") || content.startsWith("{")) {
                                        const jsonStr = content.startsWith("Error: ") ? content.substring(7) : content;
                                        const json = JSON.parse(jsonStr);
                                        return <JsonErrorViewer data={json} isError title="Generation Error" />;
                                    }
                                    if (content.startsWith("Error:")) {
                                        return <div className="text-destructive whitespace-pre-wrap">{content}</div>;
                                    }
                                    return content;
                                } catch {
                                    return message.content;
                                }
                            })()
                        )}
                    </div>
                    <div
                        className={cn(
                            "text-xs mt-1 opacity-70",
                            isUser ? "text-right" : (isRTL ? "text-right" : "text-left")
                        )}
                    >
                        {message.timestamp.toLocaleTimeString()}
                    </div>
                </div>
            </div>

            {/* AI Message Metadata - Tags below message */}
            {!isUser && response && (
                <div className="flex flex-wrap items-center gap-1.5 pl-11">
                    {/* JSON Icon */}
                    <button
                        onClick={() => setShowJson(!showJson)}
                        className={cn(
                            "p-1 rounded hover:bg-secondary transition-colors",
                            showJson && "bg-secondary"
                        )}
                        title="View full response JSON"
                    >
                        <Code className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>

                    {/* Language */}
                    {response.flags?.detected_language && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                            {response.flags.detected_language.toUpperCase()}
                        </Badge>
                    )}

                    {/* Intent */}
                    {response.flags?.detected_intent && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                            {response.flags.detected_intent}
                        </Badge>
                    )}

                    {/* Sentiment */}
                    {response.flags?.sentiment && (
                        <Badge
                            variant={
                                response.flags.sentiment === "positive" ? "success" :
                                    response.flags.sentiment === "negative" ? "destructive" : "outline"
                            }
                            className="text-[10px] px-1.5 py-0 h-5"
                        >
                            {response.flags.sentiment}
                        </Badge>
                    )}

                    {/* Confidence */}
                    {response.flags?.confidence !== undefined && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                            {Math.round(response.flags.confidence * 100)}%
                        </Badge>
                    )}

                    {/* Cost */}
                    {response.usage?.grand_total_cost !== undefined && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 text-green-500">
                            ${response.usage.grand_total_cost.toFixed(4)}
                        </Badge>
                    )}

                    {/* Tokens */}
                    {response.usage?.total_tokens && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                            {response.usage.total_tokens.toLocaleString()} tok
                        </Badge>
                    )}

                    {/* Processing Time */}
                    {response.processing_time_ms && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                            {(response.processing_time_ms / 1000).toFixed(1)}s
                        </Badge>
                    )}

                    {/* Stage Transition */}
                    {response.stage_transition && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 gap-1">
                            <span className="opacity-70">{response.stage_transition.from_stage_name} ({response.stage_transition.from_stage_id})</span>
                            <span>→</span>
                            <span className="font-semibold">{response.stage_transition.to_stage_name} ({response.stage_transition.to_stage_id})</span>
                        </Badge>
                    )}

                    {/* Escalation */}
                    {response.flags?.escalation_needed && (
                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-5">
                            ⚠ Escalation
                        </Badge>
                    )}
                </div>
            )}

            {/* Full JSON Response Panel */}
            {!isUser && response && showJson && (
                <div className="ml-11 mt-2 p-2 bg-secondary/50 rounded-lg border max-w-[70%]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">Response JSON</span>
                        <button onClick={() => setShowJson(false)} className="p-0.5 hover:bg-secondary rounded">
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                    <pre className="text-xs whitespace-pre-wrap break-words max-h-[300px] overflow-y-auto">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
