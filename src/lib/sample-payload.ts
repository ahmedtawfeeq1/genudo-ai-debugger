import { ChatRequest } from "./types";

export const createSamplePayload = (overrides?: Partial<ChatRequest>): ChatRequest => ({
    "messages": [
        {
            "id": "694bbd185b856e282c246ed3",
            "external_channel_id": "waha-10",
            "external_message_id": "false_status@broadcast_3A7BAA77F770324B49A6_201278794514@c.us",
            "external_chat_id": "status@broadcast",
            "sender_identifier": "201278794514@c.us",
            "sender_external_id": "201278794514@c.us",
            "sender_name": "Ahmed Tawfeeq",
            "sender_phone": "201278794514",
            "message": "Hi, I'm interested in your product. My email is ahmed@example.com",
            "media": null,
            "role": "user",
            "status": "delivered",
            "created_at": "2026-01-10T10:14:48.122000Z",
            "updated_at": "2026-01-10T10:14:55.262000Z",
            "channel_id": 10,
            "contact_id": 22,
            "opportunity_id": 300,
            "pipeline_id": 3,
            "stage_id": 8,
            "conversation_id": 8,
            "subscription_benefit_id": null
        }
    ],
    "history": [],
    "pipeline": {
        "id": 3,
        "name": "GenuDo Waha Sales",
        "status": "active",
        "ai_provider": "gemini",
        "ai_model": "gemini-2.0-flash",
        "model_temperature": 0.1,
        "rag_mode": "normal",
        "files_mode": "text",
        "chat_history_mode": "both",
        "no_of_relevant_points": 3,
        "agent_memory_window": 10,
        "rag_score_threshold": 0.5,
        "ai_persona": "You are Alex, a friendly and professional sales consultant for GenuDo CRM. Your goal is to qualify leads, understand their needs, collect contact information (especially email), and guide them to book a meeting.",
        "description": "Sales pipeline for WhatsApp leads via Waha",
        "instructions": "1. Greet warmly and ask how you can help\n2. Understand their product/service needs\n3. Collect their email address when mentioned in conversation\n4. Qualify the lead by understanding budget and timeline\n5. If qualified, guide them to book a meeting\n6. Always be helpful and professional",
        "routing_model": null,
        "routing_provider": null,
        "rag_model": null,
        "rag_provider": null,
        "intents": [
            { "id": 1, "key": "inquiry", "condition": "User is asking general questions about the product or service" },
            { "id": 2, "key": "pricing", "condition": "User is asking about prices, costs, or packages" },
            { "id": 3, "key": "demo_request", "condition": "User wants to see a demo or book a meeting" },
            { "id": 4, "key": "support", "condition": "User has issues with an existing product or needs help" },
            { "id": 5, "key": "complaint", "condition": "User is expressing dissatisfaction or making a complaint" },
            { "id": 6, "key": "purchase", "condition": "User is ready to buy or subscribe" }
        ],
        "sentiments": [
            { "id": 1, "key": "positive", "condition": "User expresses satisfaction, excitement, or gratitude" },
            { "id": 2, "key": "neutral", "condition": "User is matter-of-fact, neither positive nor negative" },
            { "id": 3, "key": "curious", "condition": "User is exploring options and asking questions" },
            { "id": 4, "key": "hesitant", "condition": "User seems unsure or needs more convincing" },
            { "id": 5, "key": "frustrated", "condition": "User expresses annoyance or impatience" },
            { "id": 6, "key": "confused", "condition": "User doesn't understand something or needs clarification" }
        ]
    },
    "stage": {
        "id": 8,
        "name": "Incoming",
        "pipeline_id": 3,
        "parent_id": null,
        "order": 1,
        "nature": "lead",
        "instructions": "This is the initial stage for new leads. Your goals are:\n1. Qualify the lead by understanding their needs\n2. Collect their email address if they share it\n3. When email is collected, execute the 'Capture Email' webhook\n4. If they express interest, transition to 'Interested' stage\n5. If they want to book a meeting, transition to 'Meeting Booking' stage",
        "enter_condition": null,
        "notes": null,
        "actions": [
            {
                "id": 3,
                "name": "Capture Email",
                "description": "Capture lead's email address for follow-up communications",
                "type": "webhook",
                "fixed_trigger": null,
                "trigger_id": null,
                "is_active": true,
                "stage_id": 8,
                "pipeline_id": 3,
                "instructions": "When the user shares their email address in the conversation, extract it and fire this webhook to update their contact profile.",
                "actionable_type": "App\\Models\\Webhook",
                "actionable_id": 3,
                "actionable": {
                    "id": 3,
                    "url": "https://automationv2.loop-x.co/webhook/c82f0e5c-c42a-4513-9416-676daf9e510b",
                    "headers": {
                        "X-API-Key": "secret-key"
                    },
                    "retries": 2,
                    "default_payload": {
                        "source": "ai_agent",
                        "channel": "whatsapp"
                    },
                    "fields": [
                        {
                            "id": 3,
                            "webhook_id": 3,
                            "name": "email",
                            "is_required": true,
                            "notes": "Extract the email address from the conversation. Look for patterns like name@domain.com",
                            "example": "ahmed@example.com"
                        },
                        {
                            "id": 4,
                            "webhook_id": 3,
                            "name": "name",
                            "is_required": false,
                            "notes": "Extract the user's name if mentioned",
                            "example": "Ahmed Tawfeeq"
                        }
                    ],
                },
                "created_at": "2026-01-08T11:12:01.000000Z",
                "updated_at": "2026-01-08T12:01:24.000000Z"
            }
        ]
    },
    "stages_enter_conditions": [
        {
            "id": 8,
            "name": "Incoming",
            "enter_condition": null,
            "pipeline_id": 3
        },
        {
            "id": 9,
            "name": "Interested",
            "enter_condition": "User has expressed interest in learning more about the product or service",
            "pipeline_id": 3
        },
        {
            "id": 10,
            "name": "Meeting Booking",
            "enter_condition": "User wants to schedule a meeting or demo call",
            "pipeline_id": 3
        },
        {
            "id": 11,
            "name": "Meeting Booked",
            "enter_condition": "A meeting has been successfully scheduled",
            "pipeline_id": 3
        },
        {
            "id": 12,
            "name": "Won",
            "enter_condition": "Deal has been closed successfully",
            "pipeline_id": 3
        }
    ],
    "stage_actions": [],
    "pipeline_triggers": [],
    "stage_triggers": [],
    "opportunity_followup_id": null,
    "source_names": null,
    "actions_data": [],
    ...overrides,
});
