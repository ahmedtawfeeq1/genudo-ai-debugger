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

// Simplified IncomingMessage matching new payload structure
export interface IncomingMessage {
    id: string;
    message: string;
    conversation_id: number;
    media?: MediaAttachment | null;
}

// Simplified HistoryMessage matching new payload structure
export interface HistoryMessage {
    id: string;
    role: "user" | "assistant" | "system";
    message: string;
}

// ============================================
// Opportunity & Contact Types
// ============================================

export interface OpportunityConfig {
    id: number;
    name: string | null;
    notes: string | null;
    stage_id: number;
    created_at: string;
}

export interface ContactConfig {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    created_at: string;
}

// ============================================
// File/Knowledge Source Types
// ============================================

export interface FileConfig {
    id: number;
    title: string | null;
    usage_description: string | null;
    trained_at: string | null;
    size_formatted: string | null;
}

// ============================================
// Pipeline & Stage Types
// ============================================

export interface PipelineIntent {
    id: number;
    key: string;
    condition: string;
}

export interface PipelineSentiment {
    id: number;
    key: string;
    condition: string;
}

export interface PipelineConfig {
    id: number;
    name: string;
    status: "active" | "inactive" | "draft";
    ai_provider: string;
    ai_model: string;
    model_temperature: string; // Changed to string to match payload
    rag_mode: "normal" | "strict" | "disabled";
    files_mode: "text" | "vision" | "hybrid";
    chat_history_mode: "user" | "assistant" | "both" | "none";
    no_of_relevant_points: number;
    agent_memory_window: number;
    rag_score_threshold?: number;
    ai_persona?: string | null;
    description?: string | null;
    instructions?: string | null;
    input_price?: string;
    output_price?: string;
    routing_model?: string | null;
    routing_provider?: string | null;
    rag_model?: string | null;
    rag_provider?: string | null;
    intents?: PipelineIntent[];
    sentiments?: PipelineSentiment[];
}

export interface WebhookField {
    id: number;
    webhook_id?: number | null;
    name: string;
    is_required: boolean;
    notes?: string | null;
    example?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface WebhookActionable {
    id: number;
    url: string;
    headers?: Record<string, string> | null;
    retries: number;
    default_payload?: Record<string, unknown> | null;
    fields: WebhookField[];
    created_at?: string;
    updated_at?: string;
}

export interface StageActionConfig {
    id: number;
    name: string;
    description?: string | null;
    type: "webhook" | "email" | "calendar";
    actionable_type?: string | null;
    actionable_id?: number | null;
    stage_id: number;
    instructions?: string | null;
    actionable?: WebhookActionable | null;
}

export interface StageConfig {
    id: number;
    name: string;
    nature: "neutral" | "wining" | "lost" | string; // Allow string for flexibility
    ai_persona?: string | null;
    instructions?: string | null;
    description?: string | null;
    notes?: string | null;
    enter_condition?: string | null;
    actions: StageActionConfig[];
}

// ============================================
// Chat Request/Response Types
// ============================================

export interface ChatRequest {
    messages: IncomingMessage[];
    stages: StageConfig[];
    pipeline: PipelineConfig;
    opportunity: OpportunityConfig;
    contact: ContactConfig;
    files: FileConfig[];
    history: HistoryMessage[];
    opportunity_followup_id?: number | null;
}

export interface ExecutedAction {
    action_id: number;
    action_name: string;
    success: boolean;
    action_type?: string;
    payload?: Record<string, unknown>;
    response_body?: unknown;
    error_message?: string;
    executed_at?: string;
    duration_ms?: number;
    triggered_by?: string;
    url?: string;
    response_status?: number;
}

export interface StageTransition {
    from_stage_id: number;
    from_stage_name: string;
    to_stage_id: number;
    to_stage_name: string;
    reason?: string | null;
    condition_matched?: string | null;
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
    model_used: string;
    provider: string;
    prompt_cost?: number;
    completion_cost?: number;
    total_cost?: number;
    grand_total_cost?: number;
}

export interface ChatResponse {
    conversation_id: number;
    opportunity_id: number;
    contact_id: number;
    reference_message_id: string;
    trace_id?: string;
    ai_response: string;
    ai_responses?: string[];
    new_stage_name?: string | null;
    stage_transition?: StageTransition | null;
    flags: ResponseFlags;
    rag_context?: unknown;
    memory_update?: unknown;
    media_processing?: unknown;
    actions_executed: ExecutedAction[];
    usage: UsageMetrics;
    processing_time_ms: number;
    timestamp: string;
    debug?: unknown;
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
    response?: ChatResponse;
}

// ============================================
// Helper function to get current stage from payload
// ============================================

export function getCurrentStage(payload: ChatRequest): StageConfig | undefined {
    return payload.stages.find(s => s.id === payload.opportunity.stage_id);
}
