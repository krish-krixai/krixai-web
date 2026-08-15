import { AppContainer } from "@/components/layout/app-container";
import React from "react";
import { IntegrationsSetupClient } from "@/components/dashboard/integrations-setup-client";

export const metadata = {
  title: "Integrate",
  description: "Connect your AI application in just a few guided steps.",
};

export default function IntegrationsSetupPage() {
  return (
    <AppContainer className="py-8 min-h-[calc(100vh-64px)] flex flex-col">
      <IntegrationsSetupClient />
    </AppContainer>
  );
}
