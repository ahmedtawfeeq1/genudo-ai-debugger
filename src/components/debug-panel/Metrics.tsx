"use client";

import { useDebuggerStore } from "@/lib/store";
import { Separator } from "@/components/ui/separator";
import { BarChart3, Coins, Clock, Cpu } from "lucide-react";

// Rough pricing estimates per 1M tokens (as of 2024)
const TOKEN_PRICES: Record<string, { input: number; output: number }> = {
    gemini: { input: 0.075, output: 0.3 },
    openai: { input: 5.0, output: 15.0 },
    anthropic: { input: 3.0, output: 15.0 },
    groq: { input: 0.05, output: 0.1 },
    cohere: { input: 0.5, output: 1.5 },
};

export function Metrics() {
    const { currentResponse } = useDebuggerStore();

    if (!currentResponse) {
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <BarChart3 className="h-4 w-4" />
                    Metrics
                </div>
                <p className="text-sm text-muted-foreground">No metrics available</p>
            </div>
        );
    }

    const { usage, processing_time_ms } = currentResponse;
    const { prompt_tokens, completion_tokens, total_tokens, model_used, provider, grand_total_cost, total_cost } = usage;

    // Use provided cost or fallback to estimation
    let estimatedCost = grand_total_cost || total_cost;
    if (estimatedCost === undefined || estimatedCost === 0) {
        const prices = TOKEN_PRICES[provider.toLowerCase()] || TOKEN_PRICES.openai;
        const inputCost = (prompt_tokens / 1_000_000) * prices.input;
        const outputCost = (completion_tokens / 1_000_000) * prices.output;
        estimatedCost = inputCost + outputCost;
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <BarChart3 className="h-4 w-4" />
                Metrics
            </div>

            <div className="space-y-3 text-sm">
                {/* Model Info */}
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                        <Cpu className="h-3 w-3" />
                        Model
                    </span>
                    <span className="font-mono text-xs truncate max-w-[140px]">
                        {model_used}
                    </span>
                </div>

                <Separator />

                {/* Token Usage */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Prompt Tokens</span>
                        <span className="font-mono">{prompt_tokens.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Completion Tokens</span>
                        <span className="font-mono">{completion_tokens.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between font-medium">
                        <span>Total Tokens</span>
                        <span className="font-mono">{total_tokens.toLocaleString()}</span>
                    </div>
                </div>

                <Separator />

                {/* Cost Estimate */}
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                        <Coins className="h-3 w-3" />
                        Est. Cost
                    </span>
                    <span className="font-mono text-green-500">
                        ${estimatedCost.toFixed(6)}
                    </span>
                </div>

                {/* Processing Time */}
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Processing Time
                    </span>
                    <span className="font-mono">
                        {(processing_time_ms / 1000).toFixed(2)}s
                    </span>
                </div>
            </div>
        </div>
    );
}
