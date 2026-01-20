"use client";

import { useState } from "react";
import { useDebuggerStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChevronDown,
    ChevronRight,
    Plus,
    Trash2,
    Webhook,
    Edit2,
    Save,
    X
} from "lucide-react";
import { StageConfig, StageActionConfig, WebhookField } from "@/lib/types";

export function StagesEditor() {
    const { payload, updateStageInList, setPayload } = useDebuggerStore();
    const [expandedStage, setExpandedStage] = useState<number | null>(null);
    const [expandedAction, setExpandedAction] = useState<number | null>(null);

    const stages = payload.stages;

    const getNatureBadgeVariant = (nature: string | undefined) => {
        switch (nature) {
            case "wining": return "success";
            case "lost": return "destructive";
            default: return "secondary";
        }
    };

    const handleAddStage = () => {
        const newStage: StageConfig = {
            id: Date.now(),
            name: "New Stage",
            nature: "neutral",
            ai_persona: null,
            instructions: null,
            description: null,
            notes: null,
            enter_condition: null,
            actions: []
        };
        setPayload({
            ...payload,
            stages: [...stages, newStage]
        });
        setExpandedStage(newStage.id);
    };

    const handleRemoveStage = (stageId: number) => {
        setPayload({
            ...payload,
            stages: stages.filter(s => s.id !== stageId)
        });
    };

    const handleAddAction = (stageId: number) => {
        const stage = stages.find(s => s.id === stageId);
        if (!stage) return;

        const newAction: StageActionConfig = {
            id: Date.now(),
            name: "New Action",
            description: null,
            type: "webhook",
            actionable_type: "App\\Models\\Webhook",
            actionable_id: null,
            stage_id: stageId,
            instructions: "",
            actionable: {
                id: Date.now(),
                url: "https://example.com/webhook",
                retries: 1,
                headers: null,
                fields: []
            }
        };

        updateStageInList(stageId, {
            actions: [...(stage.actions || []), newAction]
        });
        setExpandedAction(newAction.id);
    };

    const handleRemoveAction = (stageId: number, actionId: number) => {
        const stage = stages.find(s => s.id === stageId);
        if (!stage) return;

        updateStageInList(stageId, {
            actions: stage.actions.filter(a => a.id !== actionId)
        });
    };

    const handleUpdateAction = (stageId: number, actionId: number, updates: Partial<StageActionConfig>) => {
        const stage = stages.find(s => s.id === stageId);
        if (!stage) return;

        updateStageInList(stageId, {
            actions: stage.actions.map(a =>
                a.id === actionId ? { ...a, ...updates } : a
            )
        });
    };

    const handleAddField = (stageId: number, actionId: number) => {
        const stage = stages.find(s => s.id === stageId);
        if (!stage) return;

        const action = stage.actions.find(a => a.id === actionId);
        if (!action || !action.actionable) return;

        const newField: WebhookField = {
            id: Date.now(),
            name: "new_field",
            is_required: false,
            notes: null,
            example: null
        };

        handleUpdateAction(stageId, actionId, {
            actionable: {
                ...action.actionable,
                fields: [...action.actionable.fields, newField]
            }
        });
    };

    const handleRemoveField = (stageId: number, actionId: number, fieldId: number) => {
        const stage = stages.find(s => s.id === stageId);
        if (!stage) return;

        const action = stage.actions.find(a => a.id === actionId);
        if (!action || !action.actionable) return;

        handleUpdateAction(stageId, actionId, {
            actionable: {
                ...action.actionable,
                fields: action.actionable.fields.filter(f => f.id !== fieldId)
            }
        });
    };

    const handleUpdateField = (stageId: number, actionId: number, fieldId: number, updates: Partial<WebhookField>) => {
        const stage = stages.find(s => s.id === stageId);
        if (!stage) return;

        const action = stage.actions.find(a => a.id === actionId);
        if (!action || !action.actionable) return;

        handleUpdateAction(stageId, actionId, {
            actionable: {
                ...action.actionable,
                fields: action.actionable.fields.map(f =>
                    f.id === fieldId ? { ...f, ...updates } : f
                )
            }
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Stages ({stages.length})</h2>
                <Button onClick={handleAddStage} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stage
                </Button>
            </div>

            <div className="space-y-2">
                {stages.map((stage) => (
                    <Card key={stage.id} className="overflow-hidden">
                        <CardHeader
                            className="py-3 px-4 cursor-pointer hover:bg-secondary/30"
                            onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {expandedStage === stage.id ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                    <CardTitle className="text-base">{stage.name}</CardTitle>
                                    <Badge variant={getNatureBadgeVariant(stage.nature)} className="text-xs">
                                        {stage.nature}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        ID: {stage.id}
                                    </Badge>
                                    {stage.actions?.length > 0 && (
                                        <Badge variant="secondary" className="text-xs">
                                            {stage.actions.length} action{stage.actions.length > 1 ? 's' : ''}
                                        </Badge>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={(e) => { e.stopPropagation(); handleRemoveStage(stage.id); }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>

                        {expandedStage === stage.id && (
                            <CardContent className="pt-0 pb-4 px-4 space-y-4">
                                {/* Basic Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Stage Name</Label>
                                        <Input
                                            value={stage.name}
                                            onChange={(e) => updateStageInList(stage.id, { name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Nature</Label>
                                        <Input
                                            value={stage.nature || "neutral"}
                                            onChange={(e) => updateStageInList(stage.id, { nature: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Enter Condition */}
                                <div className="space-y-2">
                                    <Label>Enter Condition</Label>
                                    <Textarea
                                        value={stage.enter_condition || ""}
                                        onChange={(e) => updateStageInList(stage.id, { enter_condition: e.target.value || null })}
                                        placeholder="When should the agent transition to this stage?"
                                        className="min-h-[80px]"
                                    />
                                </div>

                                {/* AI Persona */}
                                <div className="space-y-2">
                                    <Label>AI Persona</Label>
                                    <Textarea
                                        value={stage.ai_persona || ""}
                                        onChange={(e) => updateStageInList(stage.id, { ai_persona: e.target.value || null })}
                                        placeholder="AI persona for this stage..."
                                        className="min-h-[80px]"
                                    />
                                </div>

                                {/* Instructions */}
                                <div className="space-y-2">
                                    <Label>Instructions</Label>
                                    <Textarea
                                        value={stage.instructions || ""}
                                        onChange={(e) => updateStageInList(stage.id, { instructions: e.target.value || null })}
                                        placeholder="Stage-specific instructions..."
                                        className="min-h-[100px]"
                                    />
                                </div>

                                {/* Notes */}
                                <div className="space-y-2">
                                    <Label>Notes</Label>
                                    <Textarea
                                        value={stage.notes || ""}
                                        onChange={(e) => updateStageInList(stage.id, { notes: e.target.value || null })}
                                        placeholder="Additional notes..."
                                        className="min-h-[60px]"
                                    />
                                </div>

                                {/* Actions Section */}
                                <div className="border rounded-lg p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Webhook className="h-4 w-4" />
                                            <Label className="text-base font-medium">Actions ({stage.actions?.length || 0})</Label>
                                        </div>
                                        <Button size="sm" variant="outline" onClick={() => handleAddAction(stage.id)}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Action
                                        </Button>
                                    </div>

                                    {stage.actions?.length === 0 && (
                                        <p className="text-sm text-muted-foreground">No actions configured for this stage.</p>
                                    )}

                                    {stage.actions?.map((action) => (
                                        <Card key={action.id} className="bg-secondary/20">
                                            <CardHeader
                                                className="py-2 px-3 cursor-pointer"
                                                onClick={() => setExpandedAction(expandedAction === action.id ? null : action.id)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {expandedAction === action.id ? (
                                                            <ChevronDown className="h-3 w-3" />
                                                        ) : (
                                                            <ChevronRight className="h-3 w-3" />
                                                        )}
                                                        <span className="text-sm font-medium">{action.name}</span>
                                                        <Badge variant="outline" className="text-xs">{action.type}</Badge>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-destructive"
                                                        onClick={(e) => { e.stopPropagation(); handleRemoveAction(stage.id, action.id); }}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </CardHeader>

                                            {expandedAction === action.id && (
                                                <CardContent className="pt-0 pb-3 px-3 space-y-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <Label className="text-xs">Action Name</Label>
                                                            <Input
                                                                value={action.name}
                                                                onChange={(e) => handleUpdateAction(stage.id, action.id, { name: e.target.value })}
                                                                className="h-8"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Label className="text-xs">Type</Label>
                                                            <Input
                                                                value={action.type}
                                                                onChange={(e) => handleUpdateAction(stage.id, action.id, { type: e.target.value as "webhook" | "email" | "calendar" })}
                                                                className="h-8"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <Label className="text-xs">Webhook URL</Label>
                                                        <Input
                                                            value={action.actionable?.url || ""}
                                                            onChange={(e) => handleUpdateAction(stage.id, action.id, {
                                                                actionable: { ...action.actionable!, url: e.target.value }
                                                            })}
                                                            className="h-8"
                                                        />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <Label className="text-xs">Instructions</Label>
                                                        <Textarea
                                                            value={action.instructions || ""}
                                                            onChange={(e) => handleUpdateAction(stage.id, action.id, { instructions: e.target.value })}
                                                            className="min-h-[60px] text-sm"
                                                        />
                                                    </div>

                                                    {/* Webhook Fields */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label className="text-xs">Fields ({action.actionable?.fields?.length || 0})</Label>
                                                            <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => handleAddField(stage.id, action.id)}>
                                                                <Plus className="h-3 w-3 mr-1" />
                                                                Add Field
                                                            </Button>
                                                        </div>

                                                        {action.actionable?.fields?.map((field) => (
                                                            <div key={field.id} className="flex items-center gap-2 p-2 bg-background rounded">
                                                                <Input
                                                                    value={field.name}
                                                                    onChange={(e) => handleUpdateField(stage.id, action.id, field.id, { name: e.target.value })}
                                                                    placeholder="Field name"
                                                                    className="h-7 text-xs flex-1"
                                                                />
                                                                <Input
                                                                    value={field.example || ""}
                                                                    onChange={(e) => handleUpdateField(stage.id, action.id, field.id, { example: e.target.value })}
                                                                    placeholder="Example"
                                                                    className="h-7 text-xs flex-1"
                                                                />
                                                                <label className="flex items-center gap-1 text-xs">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={field.is_required}
                                                                        onChange={(e) => handleUpdateField(stage.id, action.id, field.id, { is_required: e.target.checked })}
                                                                    />
                                                                    Req
                                                                </label>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-6 w-6 text-destructive"
                                                                    onClick={() => handleRemoveField(stage.id, action.id, field.id)}
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
