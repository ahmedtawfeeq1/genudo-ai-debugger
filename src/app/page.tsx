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
import { SettingsView } from "@/components/settings/SettingsView";
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
import { Wrench, Trash2, AlertCircle, Cpu, GitBranch, Layers, MessageCircle, Settings, PanelRightClose, PanelRightOpen, AlignRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";

export default function Home() {
  const { clearMessages, error, activeTab, setActiveTab, isObservabilityVisible, toggleObservability, isConfigPanelVisible, toggleConfigPanel, forceRTL, setForceRTL } = useDebuggerStore();

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b bg-card">
        <div className="flex items-center gap-2">
          {/* Left Panel Toggle - Only visible in Chat tab */}
          {activeTab === "chat" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleConfigPanel}
              className="h-8 w-8 p-0 mr-2"
              title={isConfigPanelVisible ? "Hide Config Panel" : "Show Config Panel"}
            >
              {isConfigPanelVisible ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </Button>
          )}
          <Wrench className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold">Genudo Debugger</h1>
        </div>

        {/* Tab Navigation - Centered */}
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">


          <Button
            variant={activeTab === "chat" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("chat")}
            className="gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Chat
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("settings")}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "chat" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleObservability}
              title={isObservabilityVisible ? "Hide Observability Panel" : "Show Observability Panel"}
            >
              {isObservabilityVisible ? (
                <PanelRightOpen className="h-5 w-5" />
              ) : (
                <PanelRightClose className="h-5 w-5" />
              )}
            </Button>
          )}
          <ModeToggle />
          {activeTab === "chat" && (
            <>
              <Button
                variant={forceRTL ? "default" : "outline"}
                size="icon"
                onClick={() => setForceRTL(!forceRTL)}
                title="Force RTL Output"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={clearMessages}>
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </>
          )}
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

      {/* Main Content */}
      {activeTab === "chat" ? (
        /* Chat View */
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Config (Fixed 300px) */}
          {isConfigPanelVisible && (
            <aside className="w-[300px] min-w-[300px] max-w-[300px] border-r flex flex-col bg-card flex-shrink-0 overflow-hidden animate-in slide-in-from-left-5 duration-300">
              <ScrollArea className="flex-1 w-full">
                <div className="p-3 space-y-2 w-full overflow-hidden">
                  {/* Reordered Accordion: Stages (Top), Pipeline (Middle), LLM (Bottom) */}
                  <Accordion type="multiple" defaultValue={["stage", "pipeline"]} className="w-full">

                    {/* 1. Current Stage (Top, Always Open requested) */}
                    <AccordionItem value="stage" className="overflow-hidden">
                      <AccordionTrigger className="py-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 flex-shrink-0" />
                          Current Stage
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="overflow-hidden">
                        <StageConfig />
                      </AccordionContent>
                    </AccordionItem>

                    {/* 2. Pipeline Config (Middle, Always Open requested) */}
                    <AccordionItem value="pipeline">
                      <AccordionTrigger className="py-2 text-sm">
                        <div className="flex items-center gap-2">
                          <GitBranch className="h-4 w-4" />
                          Pipeline Configuration
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <PipelineConfig variant="sidebar" />
                      </AccordionContent>
                    </AccordionItem>

                    {/* 3. LLM Configuration (Bottom, Collapsed default) */}
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
                  </Accordion>
                </div>
              </ScrollArea>
            </aside>
          )}

          {/* Center Panel - Chat */}
          <main className="flex-1 min-w-[280px] flex flex-col bg-background border-r">
            <ChatContainer />
            <ChatInput />
          </main>

          {/* Right Panel - Observability */}
          {isObservabilityVisible && (
            <aside className="w-1/3 min-w-[400px] flex flex-col bg-card border-l animate-in slide-in-from-right-5 duration-300">
              <ScrollArea className="flex-1">
                <div className="p-4">
                  <ObservabilityPanel />
                </div>
              </ScrollArea>
            </aside>
          )}
        </div>
      ) : (
        /* Settings View - Full Page */
        <div className="flex-1 overflow-hidden bg-card">
          <SettingsView />
        </div>
      )}
    </div>
  );
}
