import { AppContainer } from "@/components/layout/app-container";
import React from "react";
import { ThreatLogsClient } from "@/components/dashboard/threat-logs-client";

export const metadata = {
  title: "Threat Logs",
  description: "Investigate AI security events and detected threats.",
};

export default function ThreatLogsPage() {
  return (
    <AppContainer className="py-8 min-h-[calc(100vh-64px)] flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">Threat Logs</h1>
        <p className="text-[14px] text-neutral-400 font-medium">Review every scanned prompt, investigate detections and understand why security decisions were made.</p>
      </div>
      
      <div className="flex-1 flex flex-col">
        <ThreatLogsClient />
      </div>
    </AppContainer>
  );
}
