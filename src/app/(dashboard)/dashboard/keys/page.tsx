import React from "react";
import { AppContainer } from "@/components/layout/app-container";
import { ApiKeysClient } from "@/components/dashboard/api-keys-client";

export const metadata = {
  title: "API Keys",
  description: "Manage API credentials for securely integrating krixai into your applications.",
};

export default function ApiKeysPage() {
  return (
    <AppContainer className="py-8 min-h-[calc(100vh-64px)] flex flex-col">
      <ApiKeysClient />
    </AppContainer>
  );
}
