"use client";

import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";
import { JsonErrorViewer } from "@/components/ui/json-error-viewer";

interface MessageBubbleProps {
    message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === "user";

    return (
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
                        isUser ? "text-right" : "text-left"
                    )}
                >
                    {message.timestamp.toLocaleTimeString()}
                </div>
            </div>
        </div>
    );
}
