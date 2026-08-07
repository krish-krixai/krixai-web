import { AppContainer } from "@/components/layout/app-container";
import React from "react";
import { UsageClient } from "@/components/dashboard/usage-client";

export const metadata = {
  title: "Usage | krixai",
  description: "Track prompt scans, usage trends and plan consumption across your AI infrastructure.",
};

export default function UsagePage() {
  return (
    <AppContainer className="py-8 min-h-[calc(100vh-64px)] flex flex-col">
      <UsageClient />
    </AppContainer>
  );
}
