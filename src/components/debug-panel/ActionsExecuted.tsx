"use client";

import { useState } from "react";
import { useDebuggerStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Zap, Check, X, ChevronRight, ChevronDown, ExternalLink, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function ActionsExecuted() {
    const { currentResponse } = useDebuggerStore();
    const [expandedActions, setExpandedActions] = useState<number[]>([]);

    const toggleAction = (actionId: number) => {
        setExpandedActions(prev =>
            prev.includes(actionId)
                ? prev.filter(id => id !== actionId)
                : [...prev, actionId]
        );
    };

    if (!currentResponse) {
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Zap className="h-4 w-4" />
                    Actions Executed
                </div>
                <p className="text-sm text-muted-foreground">No actions executed</p>
            </div>
        );
    }

    const { actions_executed } = currentResponse;

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Zap className="h-4 w-4" />
                Actions Executed ({actions_executed.length})
            </div>

            {actions_executed.length === 0 ? (
                <p className="text-sm text-muted-foreground">No actions were executed</p>
            ) : (
                <div className="space-y-2">
                    {actions_executed.map((action) => {
                        const isExpanded = expandedActions.includes(action.action_id);
                        return (
                            <div
                                key={action.action_id}
                                className="rounded-md bg-secondary/50 overflow-hidden"
                            >
                                {/* Header - Clickable */}
                                <div
                                    className="flex items-center justify-between p-2 cursor-pointer hover:bg-secondary/70"
                                    onClick={() => toggleAction(action.action_id)}
                                >
                                    <div className="flex items-center gap-2">
                                        {isExpanded ? (
                                            <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                        ) : (
                                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                        )}
                                        <span className="text-sm truncate max-w-[180px]">
                                            {action.action_name}
                                        </span>
                                    </div>
                                    <Badge
                                        variant={action.success ? "success" : "destructive"}
                                        className="gap-1 text-xs"
                                    >
                                        {action.success ? (
                                            <Check className="h-3 w-3" />
                                        ) : (
                                            <X className="h-3 w-3" />
                                        )}
                                        {action.success ? "OK" : "Failed"}
                                    </Badge>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="px-3 pb-3 pt-1 space-y-2 text-xs border-t border-border/50">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <span className="text-muted-foreground">Type:</span>
                                                <span className="ml-1 font-mono">{action.action_type}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">ID:</span>
                                                <span className="ml-1 font-mono">{action.action_id}</span>
                                            </div>
                                        </div>

                                        {action.triggered_by && (
                                            <div>
                                                <span className="text-muted-foreground">Triggered by:</span>
                                                <span className="ml-1">{action.triggered_by}</span>
                                            </div>
                                        )}

                                        {action.url && (
                                            <div className="flex items-center gap-1">
                                                <span className="text-muted-foreground">URL:</span>
                                                <a
                                                    href={action.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline font-mono truncate max-w-[200px] inline-flex items-center gap-1"
                                                >
                                                    {action.url}
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </div>
                                        )}

                                        {action.duration_ms && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                <span>{action.duration_ms}ms</span>
                                            </div>
                                        )}

                                        {action.response_status && (
                                            <div>
                                                <span className="text-muted-foreground">Response Status:</span>
                                                <Badge variant="outline" className="ml-1 text-xs">
                                                    {action.response_status}
                                                </Badge>
                                            </div>
                                        )}

                                        {action.payload && (
                                            <div>
                                                <span className="text-muted-foreground block mb-1">Payload:</span>
                                                <pre className="bg-background p-2 rounded text-xs overflow-x-auto max-h-[100px]">
                                                    {JSON.stringify(action.payload, null, 2)}
                                                </pre>
                                            </div>
                                        )}

                                        {!!action.response_body && (
                                            <div>
                                                <span className="text-muted-foreground block mb-1">Response:</span>
                                                <pre className="bg-background p-2 rounded text-xs overflow-x-auto max-h-[100px]">
                                                    {typeof action.response_body === 'string'
                                                        ? action.response_body
                                                        : JSON.stringify(action.response_body, null, 2)}
                                                </pre>
                                            </div>
                                        )}

                                        {action.error_message && (
                                            <div className="text-destructive">
                                                <span className="font-medium">Error:</span>
                                                <span className="ml-1">{action.error_message}</span>
                                            </div>
                                        )}

                                        {action.executed_at && (
                                            <div className="text-muted-foreground">
                                                Executed: {new Date(action.executed_at).toLocaleTimeString()}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
