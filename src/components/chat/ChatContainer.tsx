"use client";

import { useEffect, useRef } from "react";
import { useDebuggerStore } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";

export function ChatContainer() {
    const { messages } = useDebuggerStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Auto-scroll to bottom on new messages
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center space-y-2">
                    <p className="text-lg">No messages yet</p>
                    <p className="text-sm">Type a message below to start testing the agent</p>
                </div>
            </div>
        );
    }

    return (
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
            <div className="space-y-4 py-4">
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}
            </div>
        </ScrollArea>
    );
}
