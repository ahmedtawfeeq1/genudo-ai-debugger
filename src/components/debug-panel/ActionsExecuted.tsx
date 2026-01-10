"use client";

import { useDebuggerStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Zap, Check, X, ChevronRight } from "lucide-react";

export function ActionsExecuted() {
    const { currentResponse } = useDebuggerStore();

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
                    {actions_executed.map((action) => (
                        <div
                            key={action.action_id}
                            className="flex items-center justify-between p-2 rounded-md bg-secondary/50"
                        >
                            <div className="flex items-center gap-2">
                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm truncate max-w-[140px]">
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
                    ))}
                </div>
            )}
        </div>
    );
}
