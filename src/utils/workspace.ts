import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function resolveWorkspace(req: NextRequest, requireRole?: 'OWNER' | 'ADMIN') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Unauthorized");
  }

  const workspaceId = req.cookies.get("workspace_id")?.value;
  
  if (!workspaceId) {
    throw new Error("No active workspace found");
  }

  // Strictly verify that the user is an active member of the workspace
  const { data: member, error } = await supabase
    .from('workspace_members')
    .select('role, status')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single();

  if (error || !member) {
    throw new Error("Forbidden: Not a member of this workspace");
  }

  if (member.status !== 'ACTIVE') {
    throw new Error("Forbidden: Workspace membership is not active");
  }

  if (requireRole) {
    if (requireRole === 'OWNER' && member.role !== 'OWNER') {
      throw new Error("Forbidden: Requires OWNER role");
    }
    if (requireRole === 'ADMIN' && member.role !== 'OWNER' && member.role !== 'ADMIN') {
      throw new Error("Forbidden: Requires ADMIN or OWNER role");
    }
  }

  return { workspaceId, user, role: member.role };
}
