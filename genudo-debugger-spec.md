# Genudo Debugger - Complete Build Specification

## Project Overview
Build a standalone Next.js chat application that calls the Genudo AI Engine API. This debugger lets developers test the AI agent with different LLM providers, pipeline configs, stages, and view observability data.

---

## Quick Start Commands

```bash
# 1. Initialize Next.js with TypeScript + Tailwind
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --use-npm

# 2. Install shadcn/ui
npx shadcn@latest init

# 3. Add shadcn components
npx shadcn@latest add button input textarea card tabs select slider badge scroll-area separator

# 4. Install additional dependencies
npm install zustand eventsource-parser lucide-react @monaco-editor/react
```

---

## API Configuration

### Endpoints
```typescript
const GENUDO_API = {
  baseUrl: "https://stagingaicore.loop-x.co", // or http://localhost:8000
  endpoints: {
    chat: "/api/v1/chat",           // POST - non-streaming
    chatStream: "/api/v1/chat/stream", // POST - SSE streaming
    health: "/api/v1/health",       // GET - health check
  },
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "<your-api-key>",
  },
};
```

### Langfuse Dashboard URL
```typescript
// Construct Langfuse trace URL from conversation_id
const getLangfuseUrl = (conversationId: number) => 
  `https://cloud.langfuse.com/project/YOUR_PROJECT_ID/sessions/conversation_${conversationId}`;
```

---

## Complete TypeScript Types

Create `src/lib/types.ts`:

```typescript
// ============================================
// Message Types
// ============================================

export interface MediaAttachment {
  type: "image" | "audio" | "video" | "document";
  url: string;
  mime_type?: string;
  filename?: string;
  size?: number;
}

export interface IncomingMessage {
  id: string;
  external_channel_id: string;
  external_message_id: string;
  external_chat_id: string;
  sender_identifier: string;
  sender_external_id: string;
  sender_name?: string;
  sender_phone?: string;
  message: string;
  role: "user" | "assistant" | "system";
  status: string;
  media?: MediaAttachment | null;
  created_at: string;
  updated_at: string;
  channel_id: number;
  contact_id: number;
  conversation_id: number;
  opportunity_id: number;
  pipeline_id: number;
  stage_id: number;
  subscription_benefit_id?: number | null;
}

export interface HistoryMessage {
  id: string;
  role: "user" | "assistant" | "system";
  message: string;
  channel_id: number;
  contact_id: number;
  opportunity_id: number;
}

// ============================================
// Pipeline & Stage Types
// ============================================

export interface PipelineConfig {
  id: number;
  name: string;
  status: "active" | "inactive" | "draft";
  ai_provider: string;  // gemini, openai, anthropic, groq, cohere
  ai_model: string;
  model_temperature: number;
  rag_mode: "normal" | "strict" | "disabled";
  files_mode: "text" | "vision" | "hybrid";
  chat_history_mode: "user" | "assistant" | "both" | "none";
  no_of_relevant_points: number;
  agent_memory_window: number;
  ai_persona?: string | null;
  description?: string | null;
  instructions?: string | null;
  routing_model?: string | null;
  routing_provider?: string | null;
  rag_model?: string | null;
  rag_provider?: string | null;
}

export interface WebhookField {
  id: number;
  webhook_id?: number | null;
  name: string;
  is_required: boolean;
  notes?: string | null;
  example?: string | null;
}

export interface WebhookActionable {
  id: number;
  url: string;
  headers?: Record<string, string> | null;
  retries: number;
  default_payload?: Record<string, any> | null;
  fields: WebhookField[];
}

export interface StageActionConfig {
  id: number;
  name: string;
  description?: string | null;
  type: "webhook" | "email" | "calendar";
  fixed_trigger?: "stage_started" | "stage_ended" | "on_message" | "ai_decision" | null;
  trigger_id?: number | null;
  instructions?: string | null;
  is_active: boolean;
  stage_id: number;
  pipeline_id: number;
  actionable_type?: string | null;
  actionable_id?: number | null;
  actionable?: WebhookActionable | null;
}

export interface StageConfig {
  id: number;
  name: string;
  pipeline_id: number;
  parent_id?: number | null;
  order?: number | null;
  nature?: string | null;
  instructions?: string | null;
  enter_condition?: string | null;
  notes?: string | null;
  actions: StageActionConfig[];
}

export interface StageEnterCondition {
  id: number;
  name: string;
  pipeline_id: number;
  enter_condition?: string | null;
}

// ============================================
// Chat Request/Response Types
// ============================================

export interface ChatRequest {
  messages: IncomingMessage[];
  history: HistoryMessage[];
  pipeline: PipelineConfig;
  stage: StageConfig;
  stages_enter_conditions: StageEnterCondition[];
  stage_actions: any[];
  pipeline_triggers: any[];
  stage_triggers: any[];
  opportunity_followup_id?: number | null;
  source_names?: string[] | null;
  actions_data: any[];
}

export interface ExecutedAction {
  action_id: number;
  action_name: string;
  success: boolean;
  payload?: Record<string, any>;
}

export interface ResponseFlags {
  confidence: number;
  escalation_needed: boolean;
  escalation_reason?: string | null;
  urgent_request: boolean;
  followup_requested: boolean;
  detected_intent?: string | null;
  sentiment?: "positive" | "neutral" | "negative" | "frustrated" | "confused" | null;
  detected_language?: string | null;
}

export interface UsageMetrics {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  model: string;
  provider: string;
}

export interface ChatResponse {
  conversation_id: number;
  opportunity_id: number;
  contact_id: number;
  reference_message_id: string;
  ai_response: string;
  new_stage?: string | null;
  confidence: number;
  escalation_needed: boolean;
  escalation_reason?: string | null;
  urgent_request: boolean;
  followup_requested: boolean;
  sentiment?: string | null;
  detected_intent?: string | null;
  detected_language?: string | null;
  actions_executed: ExecutedAction[];
  usage: UsageMetrics;
  processing_time_ms: number;
  timestamp: string;
}

// ============================================
// Debugger State Types
// ============================================

export interface DebuggerConfig {
  baseUrl: string;
  apiKey: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  response?: ChatResponse;  // Attached for assistant messages
}
```

---

## LLM Providers & Models

Create `src/lib/providers.ts`:

```typescript
export const LLM_PROVIDERS = {
  gemini: {
    name: "Google Gemini",
    models: [
      { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
    ],
  },
  openai: {
    name: "OpenAI",
    models: [
      { id: "gpt-4o", name: "GPT-4o" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
    ],
  },
  anthropic: {
    name: "Anthropic",
    models: [
      { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4" },
      { id: "claude-3-5-sonnet-20240620", name: "Claude 3.5 Sonnet" },
      { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku" },
    ],
  },
  groq: {
    name: "Groq",
    models: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B" },
      { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B" },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" },
    ],
  },
  cohere: {
    name: "Cohere",
    models: [
      { id: "command-r7b-12-2024", name: "Command R7B" },
      { id: "command-r-plus", name: "Command R+" },
    ],
  },
};
```

---

## Sample Payload Template

Create `src/lib/sample-payload.ts`:

```typescript
import { ChatRequest } from "./types";

export const createSamplePayload = (overrides?: Partial<ChatRequest>): ChatRequest => ({
  messages: [
    {
      id: "msg_" + Date.now(),
      external_channel_id: "debugger-1",
      external_message_id: "debug_" + Date.now(),
      external_chat_id: "debug_chat",
      sender_identifier: "debugger@local",
      sender_external_id: "debugger@local",
      sender_name: "Debug User",
      sender_phone: "1234567890",
      message: "Hello, I'm testing the agent.",
      role: "user",
      status: "delivered",
      media: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      channel_id: 1,
      contact_id: 1,
      conversation_id: 1,
      opportunity_id: 1,
      pipeline_id: 1,
      stage_id: 1,
      subscription_benefit_id: null,
    },
  ],
  history: [],
  pipeline: {
    id: 1,
    name: "Debug Pipeline",
    status: "active",
    ai_provider: "gemini",
    ai_model: "gemini-2.5-pro",
    model_temperature: 0.1,
    rag_mode: "disabled",
    files_mode: "text",
    chat_history_mode: "both",
    no_of_relevant_points: 3,
    agent_memory_window: 10,
    ai_persona: "You are a helpful AI assistant for testing and debugging.",
    description: "Debug pipeline for testing",
    instructions: "Respond helpfully to all queries.",
  },
  stage: {
    id: 1,
    name: "Default Stage",
    pipeline_id: 1,
    instructions: "Help the user with their request.",
    enter_condition: null,
    actions: [],
  },
  stages_enter_conditions: [
    { id: 1, name: "Default Stage", pipeline_id: 1, enter_condition: null },
  ],
  stage_actions: [],
  pipeline_triggers: [],
  stage_triggers: [],
  opportunity_followup_id: null,
  source_names: null,
  actions_data: [],
  ...overrides,
});
```

---

## Zustand Store

Create `src/lib/store.ts`:

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message, ChatRequest, ChatResponse, PipelineConfig, StageConfig } from "./types";
import { createSamplePayload } from "./sample-payload";

interface DebuggerState {
  // Config
  baseUrl: string;
  apiKey: string;
  setBaseUrl: (url: string) => void;
  setApiKey: (key: string) => void;

  // Payload
  payload: ChatRequest;
  setPayload: (payload: ChatRequest) => void;
  updatePipeline: (updates: Partial<PipelineConfig>) => void;
  updateStage: (updates: Partial<StageConfig>) => void;
  updateUserMessage: (message: string) => void;

  // Chat
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;

  // Current response (for debug panel)
  currentResponse: ChatResponse | null;
  setCurrentResponse: (response: ChatResponse | null) => void;
}

export const useDebuggerStore = create<DebuggerState>()(
  persist(
    (set, get) => ({
      // Config
      baseUrl: "https://stagingaicore.loop-x.co",
      apiKey: "",
      setBaseUrl: (url) => set({ baseUrl: url }),
      setApiKey: (key) => set({ apiKey: key }),

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
      clearMessages: () => set({ messages: [] }),
      isStreaming: false,
      setIsStreaming: (streaming) => set({ isStreaming: streaming }),

      // Current response
      currentResponse: null,
      setCurrentResponse: (response) => set({ currentResponse: response }),
    }),
    {
      name: "genudo-debugger-storage",
      partialize: (state) => ({
        baseUrl: state.baseUrl,
        apiKey: state.apiKey,
      }),
    }
  )
);
```

---

## API Client

Create `src/lib/api-client.ts`:

```typescript
import { ChatRequest, ChatResponse } from "./types";

export async function sendChatRequest(
  baseUrl: string,
  apiKey: string,
  payload: ChatRequest
): Promise<ChatResponse> {
  const response = await fetch(`${baseUrl}/api/v1/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error ${response.status}: ${error}`);
  }

  return response.json();
}

export async function* streamChatRequest(
  baseUrl: string,
  apiKey: string,
  payload: ChatRequest
): AsyncGenerator<{ content?: string; done?: boolean; response?: ChatResponse }> {
  const response = await fetch(`${baseUrl}/api/v1/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error ${response.status}: ${error}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          yield data;
        } catch {
          // Skip invalid JSON
        }
      }
    }
  }
}
```

---

## UI Layout

The app should have a 3-column layout:

```
┌─────────────────────────────────────────────────────────────────┐
│ 🔧 Genudo Debugger              [Clear Chat]  [Health Check]   │
├─────────────┬────────────────────────┬──────────────────────────┤
│ LEFT PANEL  │   CENTER PANEL         │  RIGHT PANEL            │
│ (Config)    │   (Chat)               │  (Debug Info)           │
│ ~280px      │   flex-1               │  ~320px                 │
├─────────────┼────────────────────────┼──────────────────────────┤
│             │                        │                          │
│ ▼ Server    │  Message bubbles       │  ▼ Agent Outputs         │
│   URL input │  scrollable            │    confidence: 0.95      │
│   API Key   │                        │    language: ar          │
│             │                        │    intent: inquiry       │
│ ▼ LLM       │                        │    sentiment: positive   │
│   Provider  │                        │    escalation: false     │
│   Model     │                        │                          │
│   Temp      │                        │  ▼ Metrics               │
│             │                        │    tokens: 1733 → 461    │
│ ▼ Pipeline  │                        │    cost: $0.007          │
│   RAG Mode  │                        │    time: 5.8s            │
│   Memory    │                        │                          │
│             │  ┌──────────────────┐  │  ▼ Actions               │
│ ▼ Stage     │  │ Type message... │  │    (executed webhooks)   │
│   Select    │  │        [Send]   │  │                          │
│   Actions   │  └──────────────────┘  │  🔗 Open in Langfuse     │
│             │                        │                          │
│ [Edit JSON] │                        │                          │
└─────────────┴────────────────────────┴──────────────────────────┘
```

---

## Key Components to Build

### 1. `src/app/page.tsx` - Main Layout
Three-column responsive layout with the config panel, chat area, and debug panel.

### 2. `src/components/config-panel/ServerConfig.tsx`
- Base URL input (with presets for localhost/staging)
- API Key input (password field)
- Health check button

### 3. `src/components/config-panel/LLMConfig.tsx`
- Provider dropdown (gemini, openai, anthropic, groq, cohere)
- Model dropdown (filtered by provider)
- Temperature slider (0.0 - 2.0)

### 4. `src/components/config-panel/PipelineConfig.tsx`
- RAG Mode toggle (normal/strict/disabled)
- Memory window slider
- AI Persona textarea

### 5. `src/components/config-panel/StageConfig.tsx`
- Stage name input
- Stage instructions textarea
- Actions list (expandable)

### 6. `src/components/config-panel/PayloadEditor.tsx`
- Button to open full JSON editor modal
- Monaco editor for raw payload editing
- Load/save templates

### 7. `src/components/chat/ChatContainer.tsx`
- Scrollable message list
- Auto-scroll on new messages

### 8. `src/components/chat/MessageBubble.tsx`
- User messages (right aligned, blue)
- Assistant messages (left aligned, gray)
- Markdown rendering for assistant

### 9. `src/components/chat/ChatInput.tsx`
- Textarea for message input
- Send button (or Enter to send)
- Loading state during streaming

### 10. `src/components/debug-panel/AgentOutputs.tsx`
- Display confidence, language, intent, sentiment
- Escalation status with reason

### 11. `src/components/debug-panel/Metrics.tsx`
- Token counts (prompt → completion)
- Cost estimate
- Processing time

### 12. `src/components/debug-panel/ActionsExecuted.tsx`
- List of webhooks fired
- Success/failure status

### 13. `src/components/debug-panel/LangfuseLink.tsx`
- Button to open Langfuse trace
- Shows session ID

---

## Chat Flow Implementation

```typescript
// In ChatInput.tsx or main page
async function handleSendMessage(userMessage: string) {
  const store = useDebuggerStore.getState();
  
  // 1. Add user message to chat
  store.addMessage({
    id: "user_" + Date.now(),
    role: "user",
    content: userMessage,
    timestamp: new Date(),
  });
  
  // 2. Update payload with new message
  store.updateUserMessage(userMessage);
  
  // 3. Start streaming
  store.setIsStreaming(true);
  
  let assistantMessage = "";
  const messageId = "assistant_" + Date.now();
  
  try {
    // 4. Stream response
    for await (const chunk of streamChatRequest(
      store.baseUrl,
      store.apiKey,
      store.payload
    )) {
      if (chunk.content) {
        assistantMessage += chunk.content;
        // Update UI with streaming content
      }
      
      if (chunk.done && chunk.response) {
        // 5. Final response received
        store.setCurrentResponse(chunk.response);
        store.addMessage({
          id: messageId,
          role: "assistant",
          content: chunk.response.ai_response,
          timestamp: new Date(),
          response: chunk.response,
        });
        
        // 6. Add to history for next request
        const newHistory = [
          ...store.payload.history,
          { id: messageId, role: "user", message: userMessage, ... },
          { id: messageId, role: "assistant", message: chunk.response.ai_response, ... },
        ];
        store.setPayload({ ...store.payload, history: newHistory });
      }
    }
  } catch (error) {
    console.error("Chat error:", error);
    // Show error in UI
  } finally {
    store.setIsStreaming(false);
  }
}
```

---

## Styling Notes

- Use shadcn/ui components for consistency
- Dark mode support (use `dark:` Tailwind classes)
- Responsive: collapse side panels on mobile
- Use `lucide-react` for icons

---

## Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_DEFAULT_BASE_URL=https://stagingaicore.loop-x.co
NEXT_PUBLIC_LANGFUSE_PROJECT_ID=your-project-id
```

---

## Summary of Files to Create

```
src/
├── app/
│   ├── page.tsx              # Main 3-column layout
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Tailwind + custom styles
├── components/
│   ├── config-panel/
│   │   ├── ServerConfig.tsx
│   │   ├── LLMConfig.tsx
│   │   ├── PipelineConfig.tsx
│   │   ├── StageConfig.tsx
│   │   └── PayloadEditor.tsx
│   ├── chat/
│   │   ├── ChatContainer.tsx
│   │   ├── MessageBubble.tsx
│   │   └── ChatInput.tsx
│   └── debug-panel/
│       ├── AgentOutputs.tsx
│       ├── Metrics.tsx
│       ├── ActionsExecuted.tsx
│       └── LangfuseLink.tsx
├── lib/
│   ├── types.ts              # TypeScript types
│   ├── providers.ts          # LLM providers/models
│   ├── sample-payload.ts     # Default payload
│   ├── store.ts              # Zustand store
│   └── api-client.ts         # API client
└── components/ui/            # shadcn components (auto-generated)
```
