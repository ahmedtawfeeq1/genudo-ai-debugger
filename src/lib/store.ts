import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message, ChatRequest, ChatResponse, PipelineConfig, StageConfig } from "./types";
import { createSamplePayload } from "./sample-payload";
import { PREDEFINED_STAGES, StageDefinition } from "./stages-data";

interface DebuggerState {
    // Config
    baseUrl: string;
    apiKey: string;
    isStreamingEnabled: boolean;
    setBaseUrl: (url: string) => void;
    setApiKey: (key: string) => void;
    setStreamingEnabled: (enabled: boolean) => void;

    // Payload
    payload: ChatRequest;
    setPayload: (payload: ChatRequest) => void;
    updatePipeline: (updates: Partial<PipelineConfig>) => void;
    updateStage: (updates: Partial<StageConfig>) => void;
    setStage: (stage: StageConfig) => void;
    updateUserMessage: (message: string) => void;

    // Chat
    messages: Message[];
    addMessage: (message: Message) => void;
    updateLastAssistantMessage: (content: string) => void;
    clearMessages: () => void;
    isStreaming: boolean;
    setIsStreaming: (streaming: boolean) => void;

    // Current response (for debug panel)
    currentResponse: ChatResponse | null;
    setCurrentResponse: (response: ChatResponse | null) => void;

    // Error state
    error: string | null;
    setError: (error: string | null) => void;

    // Stages Database
    stagesList: StageDefinition[];
    setStagesList: (stages: StageDefinition[]) => void;
}

export const useDebuggerStore = create<DebuggerState>()(
    persist(
        (set, get) => ({
            // Config
            baseUrl: process.env.NEXT_PUBLIC_DEFAULT_BASE_URL || "https://stagingaicore.loop-x.co",
            apiKey: "",
            isStreamingEnabled: true,
            setBaseUrl: (url) => set({ baseUrl: url }),
            setApiKey: (key) => set({ apiKey: key }),
            setStreamingEnabled: (enabled) => set({ isStreamingEnabled: enabled }),

            // Payload
            payload: createSamplePayload(),
            setPayload: (payload) => set({ payload }),
            updatePipeline: (updates) =>
                set((state) => ({
                    payload: {
                        ...state.payload,
                        pipeline: { ...state.payload.pipeline, ...updates },
                    },
                })),
            updateStage: (updates) =>
                set((state) => ({
                    payload: {
                        ...state.payload,
                        stage: { ...state.payload.stage, ...updates },
                    },
                })),
            setStage: (stage) =>
                set((state) => ({
                    payload: {
                        ...state.payload,
                        stage,
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

            // Chat
            messages: [],
            addMessage: (message) =>
                set((state) => ({ messages: [...state.messages, message] })),
            updateLastAssistantMessage: (content) =>
                set((state) => {
                    const messages = [...state.messages];
                    const lastIdx = messages.length - 1;
                    if (lastIdx >= 0 && messages[lastIdx].role === "assistant") {
                        messages[lastIdx] = { ...messages[lastIdx], content };
                    }
                    return { messages };
                }),
            clearMessages: () => set({ messages: [], currentResponse: null, error: null }),
            isStreaming: false,
            setIsStreaming: (streaming) => set({ isStreaming: streaming }),

            // Current response
            currentResponse: null,
            setCurrentResponse: (response) => set({ currentResponse: response }),

            // Error
            error: null,
            setError: (error) => set({ error }),

            // Stages Database
            stagesList: PREDEFINED_STAGES,
            setStagesList: (stages) => set({ stagesList: stages }),
        }),
        {
            name: "genudo-debugger-storage",
            partialize: (state) => ({
                baseUrl: state.baseUrl,
                apiKey: state.apiKey,
                isStreamingEnabled: state.isStreamingEnabled,
                stagesList: state.stagesList, // Persist custom stages
            }),
        }
    )
);
