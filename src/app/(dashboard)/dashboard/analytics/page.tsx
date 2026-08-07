import { AppContainer } from "@/components/layout/app-container";
import React from "react";
import { AnalyticsClient } from "@/components/dashboard/analytics-client";

export const metadata = {
  title: "Analytics | krixai",
  description: "Monitor trends, threats and the security posture of your AI infrastructure.",
};

export default function AnalyticsPage() {
  return (
    <AppContainer className="py-8 min-h-[calc(100vh-64px)] flex flex-col">
      <AnalyticsClient />
    </AppContainer>
  );
}
