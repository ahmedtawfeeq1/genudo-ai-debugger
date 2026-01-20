"use client";

import { useDebuggerStore } from "@/lib/store";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Settings2 } from "lucide-react";
import { EMBEDDING_PROVIDERS, EmbeddingProviderId } from "@/lib/providers";

const RAG_MODES = [
    { value: "normal", label: "Normal" },
    { value: "strict", label: "Strict" },
    { value: "disabled", label: "Disabled" },
];

const FILES_MODES = [
    { value: "text", label: "Text" },
    { value: "vision", label: "Vision" },
    { value: "hybrid", label: "Hybrid" },
];

const HISTORY_MODES = [
    { value: "both", label: "Both" },
    { value: "user", label: "User Only" },
    { value: "assistant", label: "Assistant Only" },
    { value: "none", label: "None" },
];

interface PipelineConfigProps {
    variant?: "sidebar" | "full";
}

export function PipelineConfig({ variant = "full" }: PipelineConfigProps) {
    const { payload, setPayload, updatePipeline } = useDebuggerStore();
    const {
        rag_mode,
        files_mode,
        chat_history_mode,
        agent_memory_window,
        ai_persona,
        rag_provider,
        rag_model,
        instructions,
        description,
        no_of_relevant_points,
        rag_score_threshold
    } = payload.pipeline;

    const embeddingProviderOptions = Object.entries(EMBEDDING_PROVIDERS).map(([id, provider]) => ({
        id: id as EmbeddingProviderId,
        name: provider.name,
    }));

    const embeddingModelOptions =
        EMBEDDING_PROVIDERS[rag_provider as EmbeddingProviderId]?.models || [];

    // Helper to update IDs in the new structure
    const updateId = (field: 'pipeline' | 'conversation' | 'opportunity' | 'contact', value: string) => {
        const numValue = parseInt(value) || 0;
        const newPayload = { ...payload };

        switch (field) {
            case 'pipeline':
                newPayload.pipeline = { ...newPayload.pipeline, id: numValue };
                break;
            case 'conversation':
                if (newPayload.messages.length > 0) {
                    newPayload.messages = newPayload.messages.map(m => ({ ...m, conversation_id: numValue }));
                }
                break;
            case 'opportunity':
                newPayload.opportunity = { ...newPayload.opportunity, id: numValue };
                break;
            case 'contact':
                newPayload.contact = { ...newPayload.contact, id: numValue };
                break;
        }

        setPayload(newPayload);
    };

    const getId = (field: 'pipeline' | 'conversation' | 'opportunity' | 'contact') => {
        switch (field) {
            case 'pipeline': return payload.pipeline.id;
            case 'conversation': return payload.messages[0]?.conversation_id || 0;
            case 'opportunity': return payload.opportunity.id;
            case 'contact': return payload.contact.id;
        }
    };

    return (
        <div className="h-full flex flex-col space-y-4">


            <div className={`flex ${variant === "full" ? "gap-6 h-full min-h-0" : "flex-col space-y-4"}`}>
                {/* Left Column - Settings (or Only Column in Sidebar) */}
                <div className={`space-y-4 ${variant === "full" ? "flex-1 overflow-y-auto pr-2" : ""}`}>
                    {/* IDs Section */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-xs">Pipeline ID</Label>
                            <Input
                                type="number"
                                value={getId('pipeline')}
                                onChange={(e) => updateId('pipeline', e.target.value)}
                                className="h-8"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Conv. ID</Label>
                            <Input
                                type="number"
                                value={getId('conversation')}
                                onChange={(e) => updateId('conversation', e.target.value)}
                                className="h-8"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Opportunity ID</Label>
                            <Input
                                type="number"
                                value={getId('opportunity')}
                                onChange={(e) => updateId('opportunity', e.target.value)}
                                className="h-8"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Contact ID</Label>
                            <Input
                                type="number"
                                value={getId('contact')}
                                onChange={(e) => updateId('contact', e.target.value)}
                                className="h-8"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label>RAG Mode</Label>
                            <Select
                                value={rag_mode}
                                onValueChange={(value: "normal" | "strict" | "disabled") =>
                                    updatePipeline({ rag_mode: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {RAG_MODES.map((mode) => (
                                        <SelectItem key={mode.value} value={mode.value}>
                                            {mode.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {rag_mode !== "disabled" && (
                            <>
                                {variant === "full" && (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Embedding Provider</Label>
                                            <Select
                                                value={rag_provider || ""}
                                                onValueChange={(value) => {
                                                    updatePipeline({ rag_provider: value });
                                                    // Reset model when provider changes
                                                    const firstModel = EMBEDDING_PROVIDERS[value as EmbeddingProviderId]?.models[0];
                                                    if (firstModel) {
                                                        updatePipeline({ rag_model: firstModel.id });
                                                    }
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select provider" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {embeddingProviderOptions.map((provider) => (
                                                        <SelectItem key={provider.id} value={provider.id}>
                                                            {provider.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Embedding Model</Label>
                                            <Select
                                                value={rag_model || ""}
                                                onValueChange={(value) => updatePipeline({ rag_model: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select model" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {embeddingModelOptions.map((model) => (
                                                        <SelectItem key={model.id} value={model.id}>
                                                            {model.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Relevant Chunks</Label>
                                        <span className="text-sm text-muted-foreground">{no_of_relevant_points || 5}</span>
                                    </div>
                                    <Slider
                                        value={[no_of_relevant_points || 5]}
                                        onValueChange={([value]) => updatePipeline({ no_of_relevant_points: value })}
                                        min={1}
                                        max={20}
                                        step={1}
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Score Threshold</Label>
                                        <span className="text-sm text-muted-foreground">{rag_score_threshold || 0}</span>
                                    </div>
                                    <Slider
                                        value={[rag_score_threshold || 0]}
                                        onValueChange={([value]) => updatePipeline({ rag_score_threshold: value })}
                                        min={0}
                                        max={1}
                                        step={0.05}
                                        className="w-full"
                                    />
                                </div>
                            </>
                        )}

                        {variant === "full" && (
                            <div className="space-y-2">
                                <Label>Files Mode</Label>
                                <Select
                                    value={files_mode}
                                    onValueChange={(value: "text" | "vision" | "hybrid") =>
                                        updatePipeline({ files_mode: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {FILES_MODES.map((mode) => (
                                            <SelectItem key={mode.value} value={mode.value}>
                                                {mode.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Chat History Mode</Label>
                            <Select
                                value={chat_history_mode}
                                onValueChange={(value: "user" | "assistant" | "both" | "none") =>
                                    updatePipeline({ chat_history_mode: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {HISTORY_MODES.map((mode) => (
                                        <SelectItem key={mode.value} value={mode.value}>
                                            {mode.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Memory Window</Label>
                                <span className="text-sm text-muted-foreground">{agent_memory_window}</span>
                            </div>
                            <Slider
                                value={[agent_memory_window]}
                                onValueChange={([value]) => updatePipeline({ agent_memory_window: value })}
                                min={1}
                                max={50}
                                step={1}
                                className="w-full"
                            />
                        </div>

                    </div>
                </div>

                {/* Right Column - Text Areas (Only in Full variant) */}
                {variant === "full" && (
                    <div className="flex-1 space-y-4 h-full flex flex-col">
                        <div className="space-y-2 flex flex-col flex-1 min-h-0">
                            <Label>AI Persona</Label>
                            <Textarea
                                value={ai_persona || ""}
                                onChange={(e) => updatePipeline({ ai_persona: e.target.value })}
                                placeholder="Describe the AI's persona..."
                                className="flex-1 text-sm p-3 leading-relaxed"
                            />
                        </div>

                        <div className="space-y-2 flex flex-col flex-1 min-h-0">
                            <Label>Pipeline Instructions</Label>
                            <Textarea
                                value={instructions || ""}
                                onChange={(e) => updatePipeline({ instructions: e.target.value })}
                                placeholder="Detailed instructions for the pipeline..."
                                className="flex-1 text-sm p-3 leading-relaxed"
                            />
                        </div>

                        <div className="space-y-2 flex flex-col flex-1 min-h-0">
                            <Label>Pipeline Description</Label>
                            <Textarea
                                value={description || ""}
                                onChange={(e) => updatePipeline({ description: e.target.value })}
                                placeholder="Description of what this pipeline does..."
                                className="flex-1 text-sm p-3 leading-relaxed"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
