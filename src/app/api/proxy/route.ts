import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { targetUrl, method, headers, body: requestBody } = body;

        if (!targetUrl) {
            return NextResponse.json({ error: "Missing targetUrl" }, { status: 400 });
        }

        const response = await fetch(targetUrl, {
            method: method || "GET",
            headers: headers || {},
            body: requestBody ? JSON.stringify(requestBody) : undefined,
        });

        const responseData = await response.text();

        try {
            // Try parsing JSON if possible
            const jsonData = JSON.parse(responseData);
            return NextResponse.json(jsonData, { status: response.status });
        } catch {
            // Return text if not JSON
            return new NextResponse(responseData, { status: response.status });
        }

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Proxy error" },
            { status: 500 }
        );
    }
}
