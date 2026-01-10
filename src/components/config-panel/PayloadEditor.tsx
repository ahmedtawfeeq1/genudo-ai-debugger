"use client";

import { useState } from "react";
import { useDebuggerStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Code, Copy, RotateCcw, Check } from "lucide-react";
import Editor from "@monaco-editor/react";
import { createSamplePayload } from "@/lib/sample-payload";

export function PayloadEditor() {
    const { payload, setPayload } = useDebuggerStore();
    const [isOpen, setIsOpen] = useState(false);
    const [editorValue, setEditorValue] = useState("");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOpen = () => {
        setEditorValue(JSON.stringify(payload, null, 2));
        setError(null);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setError(null);
    };

    const handleSave = () => {
        try {
            const parsed = JSON.parse(editorValue);
            setPayload(parsed);
            setError(null);
            setIsOpen(false);
        } catch (e) {
            setError("Invalid JSON: " + (e as Error).message);
        }
    };

    const handleReset = () => {
        const defaultPayload = createSamplePayload();
        setEditorValue(JSON.stringify(defaultPayload, null, 2));
        setError(null);
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(editorValue);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) {
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Code className="h-4 w-4" />
                    Payload Editor
                </div>
                <Button variant="outline" size="sm" onClick={handleOpen} className="w-full">
                    <Code className="h-4 w-4 mr-2" />
                    Edit Raw JSON
                </Button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="w-full max-w-4xl h-[80vh] bg-card rounded-lg border shadow-lg flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        <h2 className="font-semibold">Payload Editor</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={handleCopy}>
                            {copied ? (
                                <Check className="h-4 w-4 text-green-500" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleReset}>
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <Editor
                        height="100%"
                        defaultLanguage="json"
                        value={editorValue}
                        onChange={(value) => setEditorValue(value || "")}
                        theme="vs-dark"
                        options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            wordWrap: "on",
                            formatOnPaste: true,
                            automaticLayout: true,
                        }}
                    />
                </div>

                {error && (
                    <div className="p-2 bg-destructive/10 text-destructive text-sm border-t">
                        {error}
                    </div>
                )}

                <div className="flex items-center justify-end gap-2 p-4 border-t">
                    <Button variant="ghost" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </div>
            </div>
        </div>
    );
}
