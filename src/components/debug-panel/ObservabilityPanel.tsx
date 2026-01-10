"use client";

import { useState } from "react";
import { useDebuggerStore } from "@/lib/store";
import { Separator } from "@/components/ui/separator";
import { SessionMetrics } from "./SessionMetrics";
import { AgentOutputs } from "./AgentOutputs";
import { Metrics } from "./Metrics";
import { ActionsExecuted } from "./ActionsExecuted";
import { getLangfuseTraceUrl, getLangfuseSessionUrl } from "@/lib/api-client";
import { ExternalLink, Activity, History, Link2, AlertCircle } from "lucide-react";
import { JsonErrorViewer } from "@/components/ui/json-error-viewer";
import { cn } from "@/lib/utils";

export function ObservabilityPanel() {
    const [activeTab, setActiveTab] = useState<"response" | "session">("response");
    const { currentResponse, payload, error } = useDebuggerStore();

    const traceId = currentResponse?.trace_id || currentResponse?.reference_message_id;
    const isTempTraceId = traceId?.startsWith("msg_");

    // Only show trace ID if it's a valid ID (not starting with msg_) OR if we have no error
    // If we have an error and a temp ID, it means the run failed before generating a trace
    const showTraceLink = traceId && !isTempTraceId;

    const sessionId = payload.messages[0]?.conversation_id?.toString() ||
        currentResponse?.conversation_id?.toString();

    return (
        <div className="space-y-4">
            {/* Tabs Header */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab("response")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-all",
                        activeTab === "response"
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground hover:bg-background/50"
                    )}
                >
                    <Activity className="h-4 w-4" />
                    Response
                </button>
                <button
                    onClick={() => setActiveTab("session")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-all",
                        activeTab === "session"
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground hover:bg-background/50"
                    )}
                >
                    <History className="h-4 w-4" />
                    Session
                </button>
            </div>

            {/* Content Switcher */}
            {activeTab === "response" ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">

                    {/* Error Display */}
                    {error && (
                        <div className="p-3 rounded-lg border border-destructive/20 bg-destructive/10">
                            <div className="flex items-center gap-2 text-sm font-medium text-destructive mb-2">
                                <AlertCircle className="h-4 w-4" />
                                Run Error
                            </div>
                            <div className="max-h-[200px] overflow-y-auto">
                                {(() => {
                                    try {
                                        const errorJson = JSON.parse(error);
                                        return <JsonErrorViewer data={errorJson} title="Error Details" isError />;
                                    } catch {
                                        return <p className="text-xs text-destructive/90 whitespace-pre-wrap">{error}</p>;
                                    }
                                })()}
                            </div>
                        </div>
                    )}

                    {/* Trace Link - Primary */}
                    <div className="p-3 rounded-lg border bg-card">
                        <div className="flex items-center gap-2 text-sm font-medium mb-2">
                            <Link2 className="h-4 w-4 text-primary" />
                            Langfuse Trace
                        </div>
                        {showTraceLink ? (
                            <a
                                href={getLangfuseTraceUrl(traceId, currentResponse?.timestamp)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-primary hover:underline"
                            >
                                <span className="font-mono text-xs truncate max-w-[200px]">{traceId}</span>
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                {error ? "Trace unavailable (Run Failed)" : "Send a message to see trace"}
                            </p>
                        )}
                    </div>

                    <Separator />
                    <AgentOutputs />
                    <Separator />
                    <Metrics />
                    <Separator />
                    <ActionsExecuted />
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Session Link - Primary */}
                    <div className="p-3 rounded-lg border bg-card">
                        <div className="flex items-center gap-2 text-sm font-medium mb-2">
                            <Link2 className="h-4 w-4 text-primary" />
                            Langfuse Session
                        </div>
                        {sessionId ? (
                            <a
                                href={getLangfuseSessionUrl(sessionId)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-primary hover:underline"
                            >
                                <span className="font-mono text-xs">Session: {sessionId}</span>
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        ) : (
                            <p className="text-sm text-muted-foreground">No session data</p>
                        )}
                    </div>

                    <Separator />
                    <SessionMetrics />
                </div>
            )}
        </div>
    );
}
