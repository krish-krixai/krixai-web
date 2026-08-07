import React from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopNav } from "@/components/dashboard/topnav";
import { WorkspaceProvider, WorkspaceMembership } from "@/components/providers/workspace-provider";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  // Fetch all active workspaces for this user
  const { data: membersData, error } = await supabase
    .from("workspace_members")
    .select(`
      role,
      workspaces (
        id,
        name,
        slug,
        logo_url
      )
    `)
    .eq("user_id", user.id)
    .eq("status", "ACTIVE");

  if (error) {
    console.error("Error fetching workspaces", error.message, error.details, error.hint, error);
  }

  const memberships = (membersData || []).map((m: any) => ({
    role: m.role,
    workspace: m.workspaces,
  })) as WorkspaceMembership[];

  // If user has no workspaces, force onboarding
  if (memberships.length === 0) {
    redirect("/onboarding");
  }

  const cookieStore = await cookies();
  const activeWorkspaceId = cookieStore.get("workspace_id")?.value || null;

  return (
    <WorkspaceProvider 
      initialMemberships={memberships} 
      initialActiveWorkspaceId={activeWorkspaceId}
    >
      <AnalyticsProvider>
        <div className="flex h-screen overflow-hidden bg-black text-white">
          <Sidebar user={{ full_name: user.user_metadata?.full_name, email: user.email || "" }} />
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <TopNav />
            <main className="flex-1 overflow-y-auto bg-black pb-12">
              {children}
            </main>
          </div>
        </div>
      </AnalyticsProvider>
    </WorkspaceProvider>
  );
}
