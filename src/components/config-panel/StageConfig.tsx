"use client";

import { useDebuggerStore } from "@/lib/store";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Webhook, Settings } from "lucide-react";
import { getCurrentStage } from "@/lib/types";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function StageConfig() {
    const { payload, updateOpportunityStageId, setActiveTab } = useDebuggerStore();

    const currentStage = getCurrentStage(payload);
    const currentStageName = currentStage?.name || "";

    const handleStageSelect = (stageName: string) => {
        const stage = payload.stages.find(s => s.name === stageName);
        if (stage) {
            updateOpportunityStageId(stage.id);
        }
    };

    const getNatureBadgeVariant = (nature: string | undefined) => {
        switch (nature) {
            case "wining": return "success";
            case "lost": return "destructive";
            default: return "secondary";
        }
    };

    return (
        <div className="space-y-3 w-full overflow-hidden">

            <Select value={currentStageName} onValueChange={handleStageSelect}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a stage..." />
                </SelectTrigger>
                <SelectContent>
                    {payload.stages.map((stage) => (
                        <SelectItem key={stage.id} value={stage.name}>
                            <div className="flex items-center gap-2 max-w-[220px]">
                                <span className="truncate">{stage.name}</span>
                                <Badge variant={getNatureBadgeVariant(stage.nature)} className="text-xs">
                                    {stage.nature}
                                </Badge>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>


            {/* Current Stage Info */}
            {
                currentStage && (
                    <>
                        <div className="p-2 rounded-md bg-secondary/30 text-xs space-y-1 w-full overflow-hidden">
                            <div className="flex justify-between">
                                <span><strong>ID:</strong> {currentStage.id}</span>
                                <Badge variant={getNatureBadgeVariant(currentStage.nature)}>
                                    {currentStage.nature}
                                </Badge>
                            </div>
                            <div className="truncate"><strong>Name:</strong> {currentStage.name}</div>

                        </div>
                    </>
                )
            }
        </div >
    );
}
