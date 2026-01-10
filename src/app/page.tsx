"use client";

import { useDebuggerStore } from "@/lib/store";
import { ServerConfig } from "@/components/config-panel/ServerConfig";
import { LLMConfig } from "@/components/config-panel/LLMConfig";
import { PipelineConfig } from "@/components/config-panel/PipelineConfig";
import { StageConfig } from "@/components/config-panel/StageConfig";
import { PayloadEditor } from "@/components/config-panel/PayloadEditor";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatInput } from "@/components/chat/ChatInput";
import { ObservabilityPanel } from "@/components/debug-panel/ObservabilityPanel";
import { ModeToggle } from "@/components/mode-toggle";
import { JsonErrorViewer } from "@/components/ui/json-error-viewer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Panel, Group, Separator } from "react-resizable-panels";
import { Wrench, Trash2, AlertCircle, Cpu, GitBranch, Layers, Code, GripVertical } from "lucide-react";

export default function Home() {
  const { clearMessages, error } = useDebuggerStore();

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b bg-card">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold">Genudo Debugger</h1>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="outline" size="sm" onClick={clearMessages}>
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </header>

      {/* Error Banner */}
      {error && (() => {
        try {
          const errorJson = JSON.parse(error);
          return (
            <div className="px-4 py-2 bg-destructive/10 border-b border-destructive/20">
              <JsonErrorViewer data={errorJson} title="API Error" />
            </div>
          );
        } catch {
          return (
            <div className="px-4 py-2 bg-destructive/10 border-b border-destructive/20 flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          );
        }
      })()}

      {/* Main Content - Resizable Panels */}
      <Group orientation="horizontal" className="flex-1">
        {/* Left Panel - Config */}
        <Panel defaultSize={20} minSize={15} maxSize={35}>
          <aside className="h-full border-r flex flex-col bg-card">
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-2">
                {/* Server Config - Always Visible */}
                <ServerConfig />

                {/* Collapsible Sections */}
                <Accordion type="multiple" defaultValue={["llm"]} className="w-full">
                  <AccordionItem value="llm">
                    <AccordionTrigger className="py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4" />
                        LLM Configuration
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <LLMConfig />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="pipeline">
                    <AccordionTrigger className="py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4" />
                        Pipeline Configuration
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <PipelineConfig />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="stage">
                    <AccordionTrigger className="py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        Stage Configuration
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <StageConfig />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="payload">
                    <AccordionTrigger className="py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Payload Editor
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <PayloadEditor />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </ScrollArea>
          </aside>
        </Panel>

        {/* Resize Handle */}
        <Separator className="w-1.5 bg-border hover:bg-primary/50 transition-colors flex items-center justify-center group">
          <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
        </Separator>

        {/* Center Panel - Chat */}
        <Panel defaultSize={45} minSize={25}>
          <main className="h-full flex flex-col bg-background">
            <ChatContainer />
            <ChatInput />
          </main>
        </Panel>

        {/* Resize Handle */}
        <Separator className="w-1.5 bg-border hover:bg-primary/50 transition-colors flex items-center justify-center group">
          <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
        </Separator>

        {/* Right Panel - Observability */}
        <Panel defaultSize={35} minSize={20} maxSize={50}>
          <aside className="h-full border-l flex flex-col bg-card">
            <ScrollArea className="flex-1">
              <div className="p-4">
                <ObservabilityPanel />
              </div>
            </ScrollArea>
          </aside>
        </Panel>
      </Group>
    </div>
  );
}


