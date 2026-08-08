import { NextRequest, NextResponse } from "next/server";
import { resolveWorkspace } from "@/utils/workspace";
import { z } from "zod";
import { checkRateLimit } from "@/utils/rate-limit";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Database error:`, error);
      throw new Error(`Database Error`);
    }

    return NextResponse.json({ keys: data });
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
    
    const rawToken = crypto.randomBytes(24).toString('hex');
    const prefix = body.environment === 'Production' ? 'kx-live-' : 'kx-test-';
    const plaintextKey = prefix + rawToken;
    const key_prefix = plaintextKey.substring(0, 12);
    const key_hash = crypto.createHash('sha256').update(plaintextKey).digest('hex');

    const { data, error } = await supabaseAdmin.from('api_keys').insert({
      workspace_id: workspaceId,
      name: body.name,
      environment: body.environment,
      scopes: body.scopes,
      expires_at: body.expires_at,
      key_prefix,
      key_hash,
      status: 'Active'
    }).select().single();

    if (error) {
      console.error(`Database error:`, error);
      throw new Error(`Database Error`);
    }

    return NextResponse.json({ ...data, plaintext_key: plaintextKey });
  } catch (error: any) {
    if (error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("API Error in /keys POST:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
