"use client";

import { useState } from "react";
import { useDebuggerStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Editor from "@monaco-editor/react";
import { StagesEditor } from "./StagesEditor";
import { FilesEditor } from "./FilesEditor";
import { ServerConfig } from "@/components/config-panel/ServerConfig";
import { LLMConfig } from "@/components/config-panel/LLMConfig";
import { PipelineConfig } from "@/components/config-panel/PipelineConfig";
import { Code, Layers, FileText, Settings, Server, Cpu } from "lucide-react";

export function SettingsView() {
    const { payload, setPayload } = useDebuggerStore();
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState("stages");

    const handleJsonChange = (value: string | undefined) => {
        if (!value) return;
        try {
            const parsed = JSON.parse(value);
            setPayload(parsed);
            setJsonError(null);
        } catch (e) {
            setJsonError((e as Error).message);
        }
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <Tabs value={activeSection} onValueChange={setActiveSection} className="h-full flex flex-col">
                <div className="border-b px-4 flex-shrink-0">
                    <TabsList className="h-12">
                        <TabsTrigger value="stages" className="gap-2">
                            <Layers className="h-4 w-4" />
                            Stages
                        </TabsTrigger>
                        <TabsTrigger value="files" className="gap-2">
                            <FileText className="h-4 w-4" />
                            Files
                        </TabsTrigger>
                        <TabsTrigger value="pipeline" className="gap-2">
                            <Settings className="h-4 w-4" />
                            Pipeline
                        </TabsTrigger>
                        <TabsTrigger value="llm" className="gap-2">
                            <Cpu className="h-4 w-4" />
                            LLM
                        </TabsTrigger>
                        <TabsTrigger value="server" className="gap-2">
                            <Server className="h-4 w-4" />
                            Server
                        </TabsTrigger>
                        <TabsTrigger value="json" className="gap-2">
                            <Code className="h-4 w-4" />
                            JSON
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 min-h-0">
                    <TabsContent value="stages" className="h-full overflow-y-auto">
                        <div className="p-6">
                            <StagesEditor />
                        </div>
                    </TabsContent>

                    <TabsContent value="files" className="h-full overflow-y-auto">
                        <div className="p-6">
                            <FilesEditor />
                        </div>
                    </TabsContent>

                    <TabsContent value="pipeline" className="h-full overflow-hidden">
                        <div className="p-6 h-full flex flex-col">
                            <PipelineConfig />
                        </div>
                    </TabsContent>

                    <TabsContent value="llm" className="h-full overflow-y-auto">
                        <div className="p-6 max-w-2xl">
                            <LLMConfig />
                        </div>
                    </TabsContent>

                    <TabsContent value="server" className="h-full overflow-y-auto">
                        <div className="p-6 max-w-2xl">
                            <ServerConfig />
                        </div>
                    </TabsContent>

                    <TabsContent value="json" className="h-full flex flex-col">
                        <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
                            <div>
                                <h2 className="text-lg font-semibold">Payload JSON (Source of Truth)</h2>
                                <p className="text-sm text-muted-foreground">
                                    Edit the raw payload JSON. Changes sync to all settings.
                                </p>
                            </div>
                            {jsonError && (
                                <div className="text-sm text-destructive bg-destructive/10 px-3 py-1 rounded">
                                    {jsonError}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-h-0">
                            <Editor
                                height="100%"
                                defaultLanguage="json"
                                value={JSON.stringify(payload, null, 2)}
                                onChange={handleJsonChange}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 13,
                                    wordWrap: "on",
                                    formatOnPaste: true,
                                    automaticLayout: true,
                                    unusualLineTerminators: "off",
                                }}
                            />
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
