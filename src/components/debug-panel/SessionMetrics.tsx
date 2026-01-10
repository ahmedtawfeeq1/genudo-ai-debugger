"use client";

import { useDebuggerStore } from "@/lib/store";
import { Coins, Clock, MessageSquare, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function SessionMetrics() {
    const { messages } = useDebuggerStore();

    // Filter relevant messages (assistant responses with usage data)
    const assistantMessages = messages.filter(m => m.role === "assistant" && m.response?.usage);
    const totalMessages = messages.length;
    const assistantCount = assistantMessages.length;

    // Aggregate Tokens
    const totalPromptTokens = assistantMessages.reduce((acc, m) => acc + (m.response?.usage.prompt_tokens || 0), 0);
    const totalCompletionTokens = assistantMessages.reduce((acc, m) => acc + (m.response?.usage.completion_tokens || 0), 0);
    const grandTotalTokens = totalPromptTokens + totalCompletionTokens;

    // Aggregate Cost
    const totalCost = assistantMessages.reduce((acc, m) => {
        const usage = m.response?.usage;
        if (!usage) return acc;
        return acc + (usage.grand_total_cost || usage.total_cost || 0);
    }, 0);

    // Latency
    const totalTimeMs = assistantMessages.reduce((acc, m) => acc + (m.response?.processing_time_ms || 0), 0);
    const avgLatency = assistantCount > 0 ? totalTimeMs / assistantCount : 0;

    if (totalMessages === 0) {
        return <div className="text-sm text-muted-foreground">No session data yet.</div>;
    }

    return (
        <div className="space-y-4">
            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border rounded-md bg-card shadow-sm">
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <Coins className="h-3 w-3" /> Total Cost
                    </div>
                    <div className="font-mono text-xl font-bold text-green-500">${totalCost.toFixed(6)}</div>
                </div>
                <div className="p-3 border rounded-md bg-card shadow-sm">
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <Clock className="h-3 w-3" /> Avg Latency
                    </div>
                    <div className="font-mono text-xl font-bold">{(avgLatency / 1000).toFixed(2)}s</div>
                </div>
            </div>

            <Separator />

            {/* Token Stats */}
            <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        Session Messages
                    </span>
                    <span className="font-mono">{totalMessages} ({assistantCount} AI)</span>
                </div>

                <div className="space-y-2 pt-1">
                    <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-muted-foreground">
                            <Zap className="h-3 w-3" /> Total Tokens
                        </span>
                        <span className="font-mono font-medium">{grandTotalTokens.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground pl-5">
                        <span>Prompt</span>
                        <span className="font-mono">{totalPromptTokens.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground pl-5">
                        <span>Completion</span>
                        <span className="font-mono">{totalCompletionTokens.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
