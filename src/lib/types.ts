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
    model_temperature: number;
    rag_mode: "normal" | "strict" | "disabled";
    files_mode: "text" | "vision" | "hybrid";
    chat_history_mode: "user" | "assistant" | "both" | "none";
    no_of_relevant_points: number;
    agent_memory_window: number;
    rag_score_threshold?: number;
    ai_persona?: string | null;
    description?: string | null;
    instructions?: string | null;
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
    fixed_trigger?: "stage_started" | "stage_ended" | "on_message" | "ai_decision" | null;
    trigger_id?: number | null;
    instructions?: string | null;
    is_active: boolean;
    stage_id: number;
    pipeline_id: number;
    actionable_type?: string | null;
    actionable_id?: number | null;
    actionable?: WebhookActionable | null;
    created_at?: string;
    updated_at?: string;
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
    stage_actions: unknown[];
    pipeline_triggers: unknown[];
    stage_triggers: unknown[];
    opportunity_followup_id?: number | null;
    source_names?: string[] | null;
    actions_data: unknown[];
}

export interface ExecutedAction {
    action_id: number;
    action_name: string;
    success: boolean;
    payload?: Record<string, unknown>;
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
    new_stage_name?: string | null;
    stage_transition?: unknown | null;
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
