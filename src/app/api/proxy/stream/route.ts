import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { targetUrl, apiKey, body } = await req.json();

        if (!targetUrl) {
            return NextResponse.json({ error: "Missing targetUrl" }, { status: 400 });
        }

        const response = await fetch(targetUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": apiKey,
                "Accept": "text/event-stream",
            },
            body: JSON.stringify(body),
        });

        if (!response.body) {
            return NextResponse.json({ error: "No response body" }, { status: 500 });
        }

        // Forward the stream
        return new NextResponse(response.body, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Proxy error" },
            { status: 500 }
        );
    }
}
