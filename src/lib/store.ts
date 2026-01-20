import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message, ChatRequest, ChatResponse, PipelineConfig, StageConfig, FileConfig, getCurrentStage } from "./types";
import { createSamplePayload } from "./sample-payload";

// Active tab type
export type ActiveTab = "chat" | "settings";

interface DebuggerState {
    // Active tab
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;

    // Config
    baseUrl: string;
    apiKey: string;
    isStreamingEnabled: boolean;
    setBaseUrl: (url: string) => void;
    setApiKey: (key: string) => void;
    setStreamingEnabled: (enabled: boolean) => void;
    forceRTL: boolean;
    setForceRTL: (enabled: boolean) => void;

    // Payload (single source of truth)
    payload: ChatRequest;
    setPayload: (payload: ChatRequest) => void;
    updatePipeline: (updates: Partial<PipelineConfig>) => void;
    updateOpportunityStageId: (stageId: number) => void;
    updateStageInList: (stageId: number, updates: Partial<StageConfig>) => void;
    updateUserMessage: (message: string) => void;
    updateFiles: (files: FileConfig[]) => void;
    updateFileInList: (fileId: number, updates: Partial<FileConfig>) => void;

    // Chat
    messages: Message[];
    addMessage: (message: Message) => void;
    updateLastAssistantMessage: (content: string, response?: ChatResponse) => void;
    clearMessages: () => void;
    isStreaming: boolean;
    setIsStreaming: (streaming: boolean) => void;

    // Current response (for debug panel)
    currentResponse: ChatResponse | null;
    setCurrentResponse: (response: ChatResponse | null) => void;

    // UI State
    isObservabilityVisible: boolean;
    toggleObservability: () => void;
    isConfigPanelVisible: boolean;
    toggleConfigPanel: () => void;

    // Error state
    error: string | null;
    setError: (error: string | null) => void;

    // Helper to get current stage
    getCurrentStage: () => StageConfig | undefined;
}

export const useDebuggerStore = create<DebuggerState>()(
    persist(
        (set, get) => ({
            // Active tab
            activeTab: "chat",
            setActiveTab: (tab) => set({ activeTab: tab }),

            // Config
            baseUrl: process.env.NEXT_PUBLIC_DEFAULT_BASE_URL || "https://stagingaicore.loop-x.co",
            apiKey: "",
            isStreamingEnabled: true,
            setBaseUrl: (url) => set({ baseUrl: url }),
            setApiKey: (key) => set({ apiKey: key }),
            setStreamingEnabled: (enabled) => set({ isStreamingEnabled: enabled }),
            forceRTL: false,
            setForceRTL: (enabled) => set({ forceRTL: enabled }),

            // Payload (single source of truth)
            payload: createSamplePayload(),
            setPayload: (payload) => set({ payload }),
            updatePipeline: (updates) =>
                set((state) => ({
                    payload: {
                        ...state.payload,
                        pipeline: { ...state.payload.pipeline, ...updates },
                    },
                })),
            updateOpportunityStageId: (stageId) =>
                set((state) => ({
                    payload: {
                        ...state.payload,
                        opportunity: { ...state.payload.opportunity, stage_id: stageId },
                    },
                })),
            updateStageInList: (stageId, updates) =>
                set((state) => ({
                    payload: {
                        ...state.payload,
                        stages: state.payload.stages.map((s) =>
                            s.id === stageId ? { ...s, ...updates } : s
                        ),
                    },
                })),
            updateUserMessage: (message) =>
                set((state) => ({
                    payload: {
                        ...state.payload,
                        messages: state.payload.messages.map((m, i) =>
                            i === state.payload.messages.length - 1
                                ? { ...m, message, id: "msg_" + Date.now() }
                                : m
                        ),
                    },
                })),
            updateFiles: (files) =>
                set((state) => ({
                    payload: {
                        ...state.payload,
                        files,
                    },
                })),
            updateFileInList: (fileId, updates) =>
                set((state) => ({
                    payload: {
                        ...state.payload,
                        files: state.payload.files.map((f) =>
                            f.id === fileId ? { ...f, ...updates } : f
                        ),
                    },
                })),

            // Chat
            messages: [],
            addMessage: (message) =>
                set((state) => ({ messages: [...state.messages, message] })),
            updateLastAssistantMessage: (content, response) =>
                set((state) => {
                    const messages = [...state.messages];
                    const lastIdx = messages.length - 1;
                    if (lastIdx >= 0 && messages[lastIdx].role === "assistant") {
                        messages[lastIdx] = {
                            ...messages[lastIdx],
                            content,
                            ...(response && { response })
                        };
                    }
                    return { messages };
                }),
            clearMessages: () =>
                set((state) => ({
                    messages: [],
                    currentResponse: null,
                    error: null,
                    payload: {
                        ...state.payload,
                        history: [],
                    },
                })),
            isStreaming: false,
            setIsStreaming: (streaming) => set({ isStreaming: streaming }),

            // Current response
            currentResponse: null,
            setCurrentResponse: (response) => set({ currentResponse: response }),

            // UI State
            isObservabilityVisible: true,
            toggleObservability: () =>
                set((state) => ({ isObservabilityVisible: !state.isObservabilityVisible })),
            isConfigPanelVisible: true,
            toggleConfigPanel: () =>
                set((state) => ({ isConfigPanelVisible: !state.isConfigPanelVisible })),

            // Error
            error: null,
            setError: (error) => set({ error }),

            // Helper to get current stage
            getCurrentStage: () => {
                const state = get();
                return getCurrentStage(state.payload);
            },
        }),
        {
            name: "genudo-debugger-storage",
            partialize: (state) => ({
                baseUrl: state.baseUrl,
                apiKey: state.apiKey,
                isStreamingEnabled: state.isStreamingEnabled,
                forceRTL: state.forceRTL,
                // Persist the full payload as session data
                payload: state.payload,
            }),
        }
    )
);
