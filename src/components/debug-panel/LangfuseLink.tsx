"use client";

import { useDebuggerStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { getLangfuseSessionUrl, getLangfuseTraceUrl } from "@/lib/api-client";
import { ExternalLink, Activity } from "lucide-react";

export function LangfuseLink() {
    const { currentResponse } = useDebuggerStore();

    if (!currentResponse) {
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Activity className="h-4 w-4" />
                    Observability
                </div>
                <p className="text-sm text-muted-foreground">
                    Send a message to see trace data
                </p>
            </div>
        );
    }

    const sessionUrl = getLangfuseSessionUrl(currentResponse.conversation_id);
    // Use trace_id from response, or fallback to reference_message_id
    const traceId = currentResponse.trace_id || currentResponse.reference_message_id;
    let traceUrl = getLangfuseTraceUrl(traceId);

    // Add timestamp if available to match user format
    if (currentResponse.timestamp) {
        // Enforce ISO format if needed, but response timestamp usually fits
        traceUrl += `?timestamp=${currentResponse.timestamp}`;
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Activity className="h-4 w-4" />
                Observability
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Conversation ID</span>
                    <span className="font-mono">{currentResponse.conversation_id}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Trace ID</span>
                    <span className="font-mono truncate max-w-[150px]" title={traceId}>{traceId}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => window.open(sessionUrl, "_blank")}
                >
                    <ExternalLink className="h-4 w-4" />
                    Session
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => window.open(traceUrl, "_blank")}
                >
                    <ExternalLink className="h-4 w-4" />
                    Trace
                </Button>
            </div>
        </div>
    );
}
