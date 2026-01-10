"use client";

import { useDebuggerStore } from "@/lib/store";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Webhook } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { StagesDatabaseEditor } from "./StagesDatabaseEditor";

export function StageConfig() {
    const { payload, setStage, stagesList } = useDebuggerStore();
    const { name, actions } = payload.stage;

    const handleStageSelect = (stageName: string) => {
        const stage = stagesList.find(s => s.name === stageName);
        if (stage) {
            // Replace entire stage object including actions
            setStage(stage);
        }
    };

    return (
        <div className="space-y-3">
            <StagesDatabaseEditor />

            <div className="space-y-2">
                <Label>Select Stage</Label>
                <Select value={name} onValueChange={handleStageSelect}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a stage..." />
                    </SelectTrigger>
                    <SelectContent>
                        {stagesList.map((stage) => (
                            <SelectItem key={stage.id} value={stage.name}>
                                {stage.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Current Stage Info */}
            <div className="p-2 rounded-md bg-secondary/30 text-xs space-y-1">
                <div><strong>ID:</strong> {payload.stage.id}</div>
                <div><strong>Name:</strong> {payload.stage.name}</div>
                <div><strong>Condition:</strong> {payload.stage.enter_condition || "None"}</div>
            </div>

            {/* Actions from Stage */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Webhook className="h-4 w-4 text-muted-foreground" />
                    <Label>Actions ({actions?.length || 0})</Label>
                </div>
                {(!actions || actions.length === 0) ? (
                    <p className="text-xs text-muted-foreground">No actions for this stage</p>
                ) : (
                    <div className="space-y-1">
                        {actions.map((action) => (
                            <div
                                key={action.id}
                                className="flex items-center justify-between p-2 rounded-md bg-secondary/50"
                            >
                                <span className="text-xs">{action.name}</span>
                                <div className="flex items-center gap-1">
                                    <Badge variant="outline" className="text-xs">
                                        {action.type}
                                    </Badge>
                                    <Badge
                                        variant={action.is_active ? "success" : "secondary"}
                                        className="text-xs"
                                    >
                                        {action.is_active ? "On" : "Off"}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
