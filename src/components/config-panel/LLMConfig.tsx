"use client";

import { useDebuggerStore } from "@/lib/store";
import { LLM_PROVIDERS, ProviderId } from "@/lib/providers";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Cpu } from "lucide-react";

export function LLMConfig() {
    const { payload, updatePipeline } = useDebuggerStore();
    const { ai_provider, ai_model, model_temperature } = payload.pipeline;

    const providerOptions = Object.entries(LLM_PROVIDERS).map(([id, provider]) => ({
        id: id as ProviderId,
        name: provider.name,
    }));

    const modelOptions =
        LLM_PROVIDERS[ai_provider as ProviderId]?.models || [];

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Cpu className="h-4 w-4" />
                LLM Configuration
            </div>

            <div className="space-y-3">
                <div className="space-y-2">
                    <Label>Provider</Label>
                    <Select
                        value={ai_provider}
                        onValueChange={(value) => {
                            updatePipeline({ ai_provider: value });
                            // Reset model when provider changes
                            const firstModel = LLM_PROVIDERS[value as ProviderId]?.models[0];
                            if (firstModel) {
                                updatePipeline({ ai_model: firstModel.id });
                            }
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                            {providerOptions.map((provider) => (
                                <SelectItem key={provider.id} value={provider.id}>
                                    {provider.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Model</Label>
                    <Select
                        value={ai_model}
                        onValueChange={(value) => updatePipeline({ ai_model: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                            {modelOptions.map((model) => (
                                <SelectItem key={model.id} value={model.id}>
                                    {model.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Temperature</Label>
                        <span className="text-sm text-muted-foreground">
                            {model_temperature.toFixed(1)}
                        </span>
                    </div>
                    <Slider
                        value={[model_temperature]}
                        onValueChange={([value]) => updatePipeline({ model_temperature: value })}
                        min={0}
                        max={2}
                        step={0.1}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
}
