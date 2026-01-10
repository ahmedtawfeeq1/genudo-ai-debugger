import { StageConfig } from "./types";

export type StageDefinition = StageConfig;

export const PREDEFINED_STAGES: StageDefinition[] = [
    {
        id: 8,
        name: "Incoming",
        pipeline_id: 3,
        parent_id: null,
        order: 1,
        nature: "lead",
        instructions: "This is the initial stage for new leads. Your goals are:\n1. Qualify the lead by understanding their needs\n2. Collect their email address if they share it\n3. When email is collected, execute the 'Capture Email' webhook\n4. If they express interest, transition to 'Interested' stage\n5. If they want to book a meeting, transition to 'Meeting Booking' stage",
        enter_condition: null,
        notes: null,
        actions: []
    },
    {
        id: 9,
        name: "Interested",
        pipeline_id: 3,
        parent_id: null,
        order: 2,
        nature: "lead",
        instructions: "Really?",
        enter_condition: "User has expressed interest in learning more about the product or service",
        notes: null,
        actions: [
            {
                id: 3,
                name: "Capture Email",
                description: "Capture lead's email address for follow-up communications",
                type: "webhook",
                fixed_trigger: null,
                trigger_id: null,
                is_active: true,
                stage_id: 8,
                pipeline_id: 3,
                instructions: "When the user shares their email address in the conversation, extract it and fire this webhook to update their contact profile.",
                actionable_type: "App\\Models\\Webhook",
                actionable_id: 3,
                actionable: {
                    id: 3,
                    url: "https://automationv2.loop-x.co/webhook/c82f0e5c-c42a-4513-9416-676daf9e510b",
                    headers: {
                        "X-API-Key": "secret-key"
                    },
                    retries: 2,
                    default_payload: {
                        "source": "ai_agent",
                        "channel": "whatsapp"
                    },
                    fields: [
                        {
                            id: 3,
                            webhook_id: 3,
                            name: "email",
                            is_required: true,
                            notes: "Extract the email address from the conversation. Look for patterns like name@domain.com",
                            example: "ahmed@example.com"
                        },
                        {
                            id: 4,
                            webhook_id: 3,
                            name: "name",
                            is_required: false,
                            notes: "Extract the user's name if mentioned",
                            example: "Ahmed Tawfeeq"
                        }
                    ],
                    created_at: "2026-01-08T11:12:01.000000Z",
                    updated_at: "2026-01-08T12:01:24.000000Z"
                },
                created_at: "2026-01-08T11:12:01.000000Z",
                updated_at: "2026-01-08T12:01:24.000000Z"
            }
        ]
    },
    {
        id: 10,
        name: "Meeting Booking",
        pipeline_id: 3,
        parent_id: null,
        order: 3,
        nature: "lead",
        instructions: "The user is ready to book a meeting. Provide available slots or a booking link. If they confirm a time, transition to 'Meeting Booked' stage.",
        enter_condition: "User wants to schedule a meeting or demo call",
        notes: null,
        actions: [
            {
                id: 5,
                name: "Send Booking Link",
                description: "Send calendly link",
                type: "webhook",
                fixed_trigger: null,
                trigger_id: null,
                is_active: true,
                stage_id: 10,
                pipeline_id: 3,
                instructions: "Send the booking link to the user.",
                actionable_type: "App\\Models\\Webhook",
                actionable_id: 99,
                actionable: {
                    id: 99,
                    url: "https://api.cal.com/v1/availability",
                    headers: {},
                    retries: 1,
                    default_payload: {},
                    fields: [],
                    created_at: "2026-01-08T11:12:01.000000Z",
                    updated_at: "2026-01-08T12:01:24.000000Z"
                },
                created_at: "2026-01-08T11:12:01.000000Z",
                updated_at: "2026-01-08T12:01:24.000000Z"
            }
        ]
    },
    {
        id: 11,
        name: "Meeting Booked",
        pipeline_id: 3,
        parent_id: null,
        order: 4,
        nature: "lead",
        instructions: "Meeting is confirmed. Thank the user and provide any preparation details.",
        enter_condition: "A meeting has been successfully scheduled",
        notes: null,
        actions: []
    },
    {
        id: 12,
        name: "Won",
        pipeline_id: 3,
        parent_id: null,
        order: 5,
        nature: "lead",
        instructions: "Deal closed or user successfully converted. Wrap up the conversation.",
        enter_condition: "Deal has been closed successfully",
        notes: null,
        actions: []
    }
];
