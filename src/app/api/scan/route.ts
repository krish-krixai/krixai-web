import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Securely call the Python Engine
    const engineUrl = process.env.KRIXAI_ENGINE_URL || "http://127.0.0.1:8000";
    const apiKey = process.env.KRIXAI_ENGINE_API_KEY;

    const response = await fetch(`${engineUrl}/internal/playground/scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        workspace_id: "wksp_test_123", // Hardcoded for now
        text: prompt,
        idempotency_key: crypto.randomUUID(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Python Engine Error:", errorText);
      return NextResponse.json({ error: "Engine evaluation failed" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Scan API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
