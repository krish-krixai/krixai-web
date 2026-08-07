import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Readiness check - 2s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const { error } = await supabase.from('workspaces').select('id').limit(1).abortSignal(controller.signal);
    clearTimeout(timeoutId);
    
    if (error) throw error;

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Readiness check failed");
    return NextResponse.json({ status: "error", message: "Service Unavailable" }, { status: 503 });
  }
}
