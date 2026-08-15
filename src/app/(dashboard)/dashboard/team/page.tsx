import { AppContainer } from "@/components/layout/app-container";
import React from "react";
import { TeamClient } from "@/components/dashboard/team-client";

export const metadata = {
  title: "Team",
  description: "Manage your workspace members, invitations and permissions.",
};

export default function TeamPage() {
  return (
    <AppContainer className="py-8 min-h-[calc(100vh-64px)] flex flex-col">
      <TeamClient />
    </AppContainer>
  );
}
