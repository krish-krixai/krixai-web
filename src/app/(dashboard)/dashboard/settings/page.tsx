import { AppContainer } from "@/components/layout/app-container";
import React from "react";
import { SettingsClient } from "@/components/dashboard/settings-client";

export const metadata = {
  title: "Settings",
  description: "Manage your workspace, members, security and integrations.",
};

export default function SettingsPage() {
  return (
    <AppContainer className="py-8 min-h-[calc(100vh-64px)] flex flex-col">
      <SettingsClient />
    </AppContainer>
  );
}
