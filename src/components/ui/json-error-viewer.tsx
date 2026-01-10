"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface JsonErrorViewerProps {
    data: any;
    title?: string;
    className?: string;
    isError?: boolean;
}

export function JsonErrorViewer({ data, title = "Error Details", className, isError = true }: JsonErrorViewerProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={cn("border rounded-md overflow-hidden bg-background", isError ? "border-destructive/50" : "border-border", className)}>
            <div
                className={cn(
                    "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors",
                    isError ? "bg-destructive/10 text-destructive" : "bg-muted/30"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <div className="flex-1 font-medium text-sm flex items-center gap-2">
                    {isError && <AlertCircle className="h-4 w-4" />}
                    {title}
                </div>
                {/* Preview of the error message if usually available in 'message' or 'detail' */}
                {!isOpen && (
                    <span className="text-xs opacity-70 truncate max-w-[300px]">
                        {data?.message || data?.detail || "Click to expand"}
                    </span>
                )}
            </div>

            {isOpen && (
                <div className="border-t border-border/50 bg-slate-950">
                    <ScrollArea className="h-full max-h-[300px] w-full">
                        <div className="p-3 text-xs font-mono">
                            <pre className="text-slate-50">
                                {JSON.stringify(data, null, 2)}
                            </pre>
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}
