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

export function PipelineConfig() {
    const { payload, setPayload, updatePipeline } = useDebuggerStore();
    const { rag_mode, files_mode, chat_history_mode, agent_memory_window, ai_persona } = payload.pipeline;

    // Helper to update IDs in both message and pipeline objects
    const updateId = (field: 'pipeline_id' | 'conversation_id' | 'opportunity_id', value: string) => {
        const numValue = parseInt(value) || 0;
        const newPayload = { ...payload };

        // Update first message metadata
        if (newPayload.messages.length > 0) {
            newPayload.messages[0] = { ...newPayload.messages[0], [field]: numValue };
        }

        // Sync pipeline ID specifically
        if (field === 'pipeline_id') {
            newPayload.pipeline = { ...newPayload.pipeline, id: numValue };
            // Also update main payload pipeline_id if it exists there (it does in sample-payload but maybe not actively used)
        }

        setPayload(newPayload);
    };

    const getMessageId = (field: 'pipeline_id' | 'conversation_id' | 'opportunity_id') => {
        return payload.messages[0]?.[field] || 0;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Settings2 className="h-4 w-4" />
                Pipeline Configuration
            </div>

            {/* IDs Section */}
            <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                    <Label className="text-xs">Pipeline ID</Label>
                    <Input
                        type="number"
                        value={getMessageId('pipeline_id')}
                        onChange={(e) => updateId('pipeline_id', e.target.value)}
                        className="h-8"
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Conv. ID</Label>
                    <Input
                        type="number"
                        value={getMessageId('conversation_id')}
                        onChange={(e) => updateId('conversation_id', e.target.value)}
                        className="h-8"
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Opp. ID</Label>
                    <Input
                        type="number"
                        value={getMessageId('opportunity_id')}
                        onChange={(e) => updateId('opportunity_id', e.target.value)}
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

                <div className="space-y-2">
                    <Label>AI Persona</Label>
                    <Textarea
                        value={ai_persona || ""}
                        onChange={(e) => updatePipeline({ ai_persona: e.target.value })}
                        placeholder="Describe the AI's persona..."
                        className="min-h-[80px] text-sm"
                    />
                </div>
            </div>
        </div>
    );
}
