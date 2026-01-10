"use client";

import { useState } from "react";
import { useDebuggerStore } from "@/lib/store";
import { checkHealth } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Server, Key, RefreshCw, Check, X, Eye, EyeOff } from "lucide-react";

const URL_PRESETS = [
    { label: "Staging", value: "https://stagingaicore.loop-x.co" },
    { label: "Local", value: "http://localhost:8000" },
];

export function ServerConfig() {
    const { baseUrl, apiKey, isStreamingEnabled, setBaseUrl, setApiKey, setStreamingEnabled } = useDebuggerStore();
    const [healthStatus, setHealthStatus] = useState<"idle" | "checking" | "healthy" | "unhealthy">("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showApiKey, setShowApiKey] = useState(false);

    const handleHealthCheck = async () => {
        setHealthStatus("checking");
        setErrorMessage(null);
        const result = await checkHealth(baseUrl, apiKey);
        setHealthStatus(result.success ? "healthy" : "unhealthy");
        if (!result.success && result.error) {
            setErrorMessage(result.error);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Server className="h-4 w-4" />
                Server Configuration
            </div>

            <div className="space-y-3">
                <div className="space-y-2">
                    <Label htmlFor="baseUrl">Base URL</Label>
                    <Input
                        id="baseUrl"
                        value={baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                        placeholder="https://stagingaicore.loop-x.co"
                    />
                    <div className="flex gap-1">
                        {URL_PRESETS.map((preset) => (
                            <Button
                                key={preset.value}
                                variant={baseUrl === preset.value ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => setBaseUrl(preset.value)}
                                className="text-xs h-6"
                            >
                                {preset.label}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <div className="relative">
                        <Input
                            id="apiKey"
                            type={showApiKey ? "text" : "password"}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your API key"
                            className="pr-10"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowApiKey(!showApiKey)}
                        >
                            {showApiKey ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                        </Button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <Label htmlFor="streaming-mode" className="text-sm font-medium">
                        Enable Streaming
                    </Label>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                            {isStreamingEnabled ? "On" : "Off"}
                        </span>
                        <Switch
                            id="streaming-mode"
                            checked={isStreamingEnabled}
                            onCheckedChange={setStreamingEnabled}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleHealthCheck}
                        disabled={healthStatus === "checking"}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${healthStatus === "checking" ? "animate-spin" : ""}`} />
                        Health Check
                    </Button>
                    {healthStatus === "healthy" && (
                        <Badge variant="success" className="gap-1">
                            <Check className="h-3 w-3" /> Connected
                        </Badge>
                    )}
                    {healthStatus === "unhealthy" && (
                        <Badge variant="destructive" className="gap-1">
                            <X className="h-3 w-3" /> Failed
                        </Badge>
                    )}
                </div>
                {healthStatus === "unhealthy" && errorMessage && (
                    <div className="text-xs text-destructive bg-destructive/10 p-2 rounded border border-destructive/20 break-all">
                        Error: {errorMessage}
                    </div>
                )}
            </div>
        </div>
    );
}
