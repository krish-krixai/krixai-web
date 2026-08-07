"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
};

export type WorkspaceMembership = {
  role: string;
  workspace: Workspace;
};

type WorkspaceContextType = {
  activeWorkspace: Workspace | null;
  activeRole: string | null;
  memberships: WorkspaceMembership[];
  switchWorkspace: (workspaceId: string) => Promise<void>;
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({
  children,
  initialMemberships,
  initialActiveWorkspaceId,
}: {
  children: React.ReactNode;
  initialMemberships: WorkspaceMembership[];
  initialActiveWorkspaceId: string | null;
}) {
  const router = useRouter();

  // Find the active membership based on the ID, or fallback to the first one if not found but others exist
  const getInitialActiveMembership = () => {
    if (initialMemberships.length === 0) return null;
    
    if (initialActiveWorkspaceId) {
      const found = initialMemberships.find(m => m.workspace.id === initialActiveWorkspaceId);
      if (found) return found;
    }
    
    return initialMemberships[0];
  };

  const activeMembership = getInitialActiveMembership();
  const activeWorkspace = activeMembership ? activeMembership.workspace : null;
  const activeRole = activeMembership ? activeMembership.role : null;

  const switchWorkspace = async (workspaceId: string) => {
    // Set the cookie via a quick API call or document.cookie
    document.cookie = `workspace_id=${workspaceId}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Refresh the router to trigger server-side re-fetching of all scoped data
    router.refresh();
  };

  // If we have an active workspace but it wasn't the one in the cookie, set it to ensure consistency
  useEffect(() => {
    if (activeWorkspace && activeWorkspace.id !== initialActiveWorkspaceId) {
      document.cookie = `workspace_id=${activeWorkspace.id}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [activeWorkspace, initialActiveWorkspaceId]);

  return (
    <WorkspaceContext.Provider
      value={{
        activeWorkspace,
        activeRole,
        memberships: initialMemberships,
        switchWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
