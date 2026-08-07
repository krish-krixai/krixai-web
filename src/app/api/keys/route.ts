import { NextRequest, NextResponse } from "next/server";
import { resolveWorkspace } from "@/utils/workspace";
import { z } from "zod";
import { checkRateLimit } from "@/utils/rate-limit";

const ENGINE_URL = process.env.KRIXAI_ENGINE_URL || "http://localhost:8000";
const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN || "";

export async function GET(req: NextRequest) {
  try {
    let workspaceId: string;
    let userId: string;
    try {
      const resolved = await resolveWorkspace(req, 'OWNER');
      workspaceId = resolved.workspaceId;
      userId = resolved.user?.id || 'unknown';
    } catch (authError: any) {
      if (authError.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.json({ error: authError.message }, { status: 403 });
    }
    
    const rateLimitResponse = await checkRateLimit('keys', `keys:${workspaceId}:${userId}`);
    if (rateLimitResponse) return rateLimitResponse;
    
    const res = await fetch(`${ENGINE_URL}/internal/api-keys/${workspaceId}`, {
      headers: {
        "X-Admin-Token": ADMIN_TOKEN,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Engine error: ${errorText}`);
      throw new Error(`Engine Error`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    if (error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("API Error in /keys GET:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

const createKeySchema = z.object({
  name: z.string().min(1).max(100).default("Production key"),
  environment: z.string().min(1).max(50).default("Production"),
  scopes: z.array(z.string()).default(["Scan"]),
  expires_at: z.string().datetime().nullable().optional().default(null)
});

export async function POST(req: NextRequest) {
  try {
    let workspaceId: string;
    let userId: string;
    try {
      const resolved = await resolveWorkspace(req, 'OWNER');
      workspaceId = resolved.workspaceId;
      userId = resolved.user?.id || 'unknown';
    } catch (authError: any) {
      if (authError.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.json({ error: authError.message }, { status: 403 });
    }
    
    const rateLimitResponse = await checkRateLimit('keys', `keys_create:${workspaceId}:${userId}`);
    if (rateLimitResponse) return rateLimitResponse;
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = createKeySchema.safeParse(rawBody);
    
    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid request payload", details: parseResult.error.format() }, { status: 400 });
    }
    
    const body = parseResult.data;
    
    const res = await fetch(`${ENGINE_URL}/internal/api-keys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Token": ADMIN_TOKEN,
      },
      body: JSON.stringify({
        workspace_id: workspaceId,
        name: body.name,
        environment: body.environment,
        scopes: body.scopes,
        expires_at: body.expires_at
      }),
    });

    if (!res.ok) {
      if (res.status === 429) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
      }
      const errorText = await res.text();
      console.error(`Engine error: ${errorText}`);
      throw new Error(`Engine Error`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    if (error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("API Error in /keys POST:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
