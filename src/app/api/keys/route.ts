import { NextRequest, NextResponse } from "next/server";
import { resolveWorkspace } from "@/utils/workspace";
import { z } from "zod";
import { checkRateLimit } from "@/utils/rate-limit";
import { createClient } from "@/utils/supabase/server";
import crypto from "crypto";

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
    
    const supabase = await createClient();
    
    const { data, error } = await supabase
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

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (!user || authError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rateLimitResponse = await checkRateLimit('keys', `keys_post:${user.id}`);
  if (rateLimitResponse) return rateLimitResponse;
  
  const body = await request.json();
  const { workspace_id, name, environment } = body;

  // Workspace ownership check
  const { data: membership } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspace_id)
    .eq('user_id', user.id)
    .single();

  if (!membership || membership.role !== 'OWNER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Check key limit for plan
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('plan')
    .eq('id', workspace_id)
    .single();
    
  const limits = { free: 1, starter: 3, pro: 10 };
  const limit = limits[workspace?.plan as keyof typeof limits] || 1;
  
  const { count } = await supabase
    .from('api_keys')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspace_id);
    
  if ((count || 0) >= limit) {
    return NextResponse.json(
      { error: `Key limit reached for ${workspace?.plan} plan` },
      { status: 403 }
    );
  }
  
  // Generate key
  const rawKey = `kx-live-${crypto.randomBytes(24).toString('hex')}`;
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
  const keyPrefix = rawKey.substring(0, 8);
  const keySuffix = rawKey.substring(rawKey.length - 4);
  
  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      workspace_id,
      key_hash: keyHash,
      key_prefix: keyPrefix,
      key_suffix: keySuffix,
      name: name || 'Default Key',
      environment: environment || 'production',
    })
    .select()
    .single();
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  // Return the raw key ONCE - it's never stored in plaintext
  return NextResponse.json({
    ...data,
    raw_key: rawKey, // Only shown once, never retrievable again
  });
}
