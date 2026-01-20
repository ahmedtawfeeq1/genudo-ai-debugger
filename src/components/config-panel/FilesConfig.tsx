"use client";

import { useState } from "react";
import { useDebuggerStore } from "@/lib/store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { FileConfig } from "@/lib/types";

export function FilesConfig() {
    const { payload, updateFileInList, updateFiles } = useDebuggerStore();
    const [isExpanded, setIsExpanded] = useState(false);
    const [editingFileId, setEditingFileId] = useState<number | null>(null);

    const files = payload.files || [];

    const handleAddFile = () => {
        const newFile: FileConfig = {
            id: Date.now(),
            title: null,
            usage_description: null,
            trained_at: new Date().toISOString(),
            size_formatted: null,
        };
        updateFiles([...files, newFile]);
        setEditingFileId(newFile.id);
    };

    const handleRemoveFile = (fileId: number) => {
        updateFiles(files.filter(f => f.id !== fileId));
    };

    const handleUpdateFile = (fileId: number, updates: Partial<FileConfig>) => {
        updateFileInList(fileId, updates);
    };

    return (
        <div className="space-y-3">
            <div className="border rounded-md">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between p-2 hover:bg-secondary/30"
                >
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                            Knowledge Sources ({files.length})
                        </span>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </button>

                {isExpanded && (
                    <div className="p-2 border-t space-y-2">
                        <p className="text-xs text-muted-foreground">
                            Configure file titles (source names) and when to use descriptions for RAG.
                        </p>

                        {files.length === 0 ? (
                            <p className="text-xs text-muted-foreground py-2">
                                No knowledge sources configured.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {files.map((file) => (
                                    <div
                                        key={file.id}
                                        className="p-2 rounded-md bg-secondary/50 space-y-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    ID: {file.id}
                                                </Badge>
                                                {file.trained_at && (
                                                    <span className="text-xs text-muted-foreground">
                                                        Trained: {new Date(file.trained_at).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-destructive"
                                                onClick={() => handleRemoveFile(file.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-xs">Title (Source Name)</Label>
                                            <Input
                                                value={file.title || ""}
                                                onChange={(e) => handleUpdateFile(file.id, { title: e.target.value || null })}
                                                placeholder="e.g., Product FAQ, Company Policies..."
                                                className="h-7 text-xs"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-xs">Usage Description (When to Use)</Label>
                                            <Textarea
                                                value={file.usage_description || ""}
                                                onChange={(e) => handleUpdateFile(file.id, { usage_description: e.target.value || null })}
                                                placeholder="e.g., Use when customer asks about product features or pricing..."
                                                className="min-h-[40px] text-xs"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={handleAddFile}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Knowledge Source
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
