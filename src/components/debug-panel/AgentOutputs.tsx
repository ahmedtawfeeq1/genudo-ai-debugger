"use client";

import { useDebuggerStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Brain,
    Globe,
    MessageCircle,
    AlertTriangle,
    TrendingUp,
    Calendar,
} from "lucide-react";

export function AgentOutputs() {
    const { currentResponse } = useDebuggerStore();

    if (!currentResponse) {
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Brain className="h-4 w-4" />
                    Agent Outputs
                </div>
                <p className="text-sm text-muted-foreground">No response data yet</p>
            </div>
        );
    }

    const {
        confidence,
        detected_language,
        detected_intent,
        sentiment,
        escalation_needed,
        escalation_reason,
        urgent_request,
        followup_requested,
    } = currentResponse.flags;

    const new_stage = currentResponse.new_stage_name;

    const getSentimentColor = (s: string | null | undefined) => {
        switch (s) {
            case "positive":
                return "text-green-500";
            case "negative":
            case "frustrated":
                return "text-red-500";
            case "confused":
                return "text-yellow-500";
            default:
                return "text-muted-foreground";
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Brain className="h-4 w-4" />
                Agent Outputs
            </div>

            <div className="space-y-3 text-sm">
                {/* Confidence */}
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        Confidence
                    </span>
                    <Badge variant={confidence >= 0.8 ? "success" : confidence >= 0.5 ? "warning" : "destructive"}>
                        {(confidence * 100).toFixed(0)}%
                    </Badge>
                </div>

                {/* Language */}
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                        <Globe className="h-3 w-3" />
                        Language
                    </span>
                    <span className="font-mono text-xs bg-secondary px-2 py-0.5 rounded">
                        {detected_language || "—"}
                    </span>
                </div>

                {/* Intent */}
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                        <MessageCircle className="h-3 w-3" />
                        Intent
                    </span>
                    <span className="text-xs truncate max-w-[120px]">
                        {detected_intent || "—"}
                    </span>
                </div>

                {/* Sentiment */}
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sentiment</span>
                    <span className={`capitalize ${getSentimentColor(sentiment)}`}>
                        {sentiment || "—"}
                    </span>
                </div>

                <Separator />

                {/* Flags */}
                <div className="space-y-2">
                    {escalation_needed && (
                        <div className="flex items-start gap-2 p-2 rounded-md bg-destructive/10 text-destructive">
                            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-xs">Escalation Needed</p>
                                {escalation_reason && (
                                    <p className="text-xs opacity-80">{escalation_reason}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {urgent_request && (
                        <Badge variant="warning" className="w-full justify-center">
                            ⚡ Urgent Request
                        </Badge>
                    )}

                    {followup_requested && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span className="text-xs">Follow-up Requested</span>
                        </div>
                    )}

                    {new_stage && (
                        <div className="p-2 rounded-md bg-primary/10 border border-primary/20">
                            <p className="text-xs text-muted-foreground">Stage Transition</p>
                            <p className="font-medium text-sm">{new_stage}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
