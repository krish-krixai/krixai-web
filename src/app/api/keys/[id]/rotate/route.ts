import { NextRequest, NextResponse } from "next/server";
import { resolveWorkspace } from "@/utils/workspace";

const ENGINE_URL = process.env.KRIXAI_ENGINE_URL || "http://localhost:8000";
const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN || "";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { workspaceId } = await resolveWorkspace(req, 'OWNER');
    
    const res = await fetch(`${ENGINE_URL}/internal/api-keys/${id}/rotate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Token": ADMIN_TOKEN,
      },
      body: JSON.stringify({
        workspace_id: workspaceId,
      }),
    });

    if (!res.ok) {
      if (res.status === 429) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
      }
      const errorText = await res.text();
      throw new Error(`Engine error: ${errorText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message.includes("Forbidden") ? 403 : 500 });
  }
}
