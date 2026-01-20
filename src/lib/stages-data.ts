import { StageConfig } from "./types";

export type StageDefinition = StageConfig;

export const PREDEFINED_STAGES: StageDefinition[] = [
    {
        id: 1,
        name: "Engaged",
        nature: "neutral",
        ai_persona: "**Identity:** Aaref – the helpful AI Customer Success agent, maintaining consistency throughout the sales journey.",
        instructions: "### **Continuity Rules**\n\n* **Arabic Language Recommendation:** If the client starts the conversation with any other language rather than Arabic, answer in EGYPTIAN ARABIC LANGUAGE.\n* **No Re-Introduction:** Do not re-state who you are or repeat the company/product overview once the conversation is underway.",
        description: "Active engagement stage where leads are being nurtured",
        notes: "## Opening Approach\nFIRST message ALWAYS in Egyptian Arabic with proper line break structure.",
        enter_condition: null,
        actions: [
            {
                id: 3,
                name: "Capture Email",
                description: "Capture lead's email address for follow-up communications",
                type: "webhook",
                actionable_type: "App\\Models\\Webhook",
                actionable_id: 3,
                stage_id: 1,
                instructions: "When the user shares their email address in the conversation, extract it and fire this webhook.",
                actionable: {
                    id: 3,
                    url: "https://automationv2.loop-x.co/webhook/capture-email",
                    retries: 2,
                    headers: null,
                    fields: [
                        {
                            id: 3,
                            name: "email",
                            is_required: true,
                            notes: "Extract the email address from the conversation",
                            example: "ahmed@example.com"
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 2,
        name: "Meeting Booked",
        nature: "wining",
        ai_persona: "**Identity:** Aaref – maintaining the helpful persona, now in a **waiting** phase before the meeting.",
        instructions: "### **Communication in this Stage**\n\n* **Confirmation Message:** Right after booking, send a concise confirmation and gratitude message.\n* **No New Sales Pitches:** The user has agreed to meet, so avoid introducing new selling points.",
        description: "Meeting has been successfully scheduled",
        notes: "### **Sample Flow After Booking**\n\n\"Perfect! Your meeting is confirmed.\"",
        enter_condition: "User confirms a specific time slot from options offered in the chat",
        actions: []
    },
    {
        id: 3,
        name: "Lost",
        nature: "lost",
        ai_persona: null,
        instructions: null,
        description: "Lead has been lost or disqualified",
        notes: null,
        enter_condition: null,
        actions: []
    },
    {
        id: 4,
        name: "Meeting Booking",
        nature: "neutral",
        ai_persona: "**Name:** Aaref (عارف) – *Scheduling Specialist* mode.\n**When This Stage Applies:** This stage begins when the prospect has agreed to schedule a meeting or demo.",
        instructions: "### **Transition into Scheduling**\n\n* When the user says \"yes\" to a meeting, respond with enthusiasm and clarity, but do not yet promise that the meeting is booked.\n\n### **Offering Time Slots**\n\n* Offer 2-3 available time slots, keeping them as soon as reasonably possible.",
        description: "User is in the process of booking a meeting",
        notes: "**CRITICAL RULES:**\n- NEVER say \"I'll arrange/book this\" until the time slot is confirmed by the user\n- NEVER mention \"arranging\", \"booking\", or \"setting up\" the meeting until you have confirmed time slot",
        enter_condition: "User shares their company field/industry OR explicitly agrees to schedule a meeting",
        actions: [
            {
                id: 7,
                name: "Get Available Slots",
                description: "Fetch available calendar slots",
                type: "webhook",
                actionable_type: "App\\Models\\Webhook",
                actionable_id: 7,
                stage_id: 4,
                instructions: "Fetch available slots to share with the user for booking",
                actionable: {
                    id: 7,
                    url: "https://automationv2.loop-x.co/webhook/slots",
                    retries: 1,
                    headers: null,
                    fields: []
                }
            }
        ]
    },
    {
        id: 27,
        name: "Won",
        nature: "neutral",
        ai_persona: "## **Persona & Role**\n\n* **Name:** Aaref (عارف) – Onboarding Advocate.\n* **When This Stage Applies:** The prospect has completed the discovery call and indicated they want to move forward.",
        instructions: "## Welcome Message Overview\n\n* *Opening:* Start with a warm reference to the recent call and express excitement.\n* *Next Steps Roadmap:* Immediately outline what will happen next.",
        description: "Deal has been won, moving to onboarding",
        notes: "- DON'T OVER RESPECT - Only say حضرتك or يا فندم ONE TIME per conversation.",
        enter_condition: null,
        actions: []
    }
];
