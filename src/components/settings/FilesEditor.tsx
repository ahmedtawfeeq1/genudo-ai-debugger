"use client";

import { useDebuggerStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, FileText } from "lucide-react";
import { FileConfig } from "@/lib/types";

export function FilesEditor() {
    const { payload, updateFileInList, updateFiles } = useDebuggerStore();
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
    };

    const handleRemoveFile = (fileId: number) => {
        updateFiles(files.filter(f => f.id !== fileId));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <h2 className="text-lg font-semibold">Knowledge Sources ({files.length})</h2>
                </div>
                <Button onClick={handleAddFile} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add File
                </Button>
            </div>

            <p className="text-sm text-muted-foreground">
                Configure file titles (source names) and usage descriptions for RAG context.
            </p>

            {files.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                    No knowledge sources configured. Click "Add File" to add one.
                </Card>
            ) : (
                <div className="grid gap-4">
                    {files.map((file) => (
                        <Card key={file.id}>
                            <CardHeader className="py-3 px-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-sm">File ID: {file.id}</CardTitle>
                                        {file.trained_at && (
                                            <Badge variant="outline" className="text-xs">
                                                Trained: {new Date(file.trained_at).toLocaleDateString()}
                                            </Badge>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive"
                                        onClick={() => handleRemoveFile(file.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="py-0 pb-4 px-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Title (Source Name)</Label>
                                        <Input
                                            value={file.title || ""}
                                            onChange={(e) => updateFileInList(file.id, { title: e.target.value || null })}
                                            placeholder="e.g., Product FAQ, Company Policies..."
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Name shown to AI as knowledge source
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Usage Description (When to Use)</Label>
                                        <Textarea
                                            value={file.usage_description || ""}
                                            onChange={(e) => updateFileInList(file.id, { usage_description: e.target.value || null })}
                                            placeholder="e.g., Use when customer asks about product features..."
                                            className="min-h-[80px]"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
