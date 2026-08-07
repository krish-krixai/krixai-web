"use client";

import React from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";
import { useAnalytics } from "../providers/analytics-provider";
import { PageHeader } from "@/components/layout/page-header";

export function OperationalStatus({ greeting, fullName }: { greeting: string, fullName: string }) {
  const { threatsBlocked, avgLatency, blockRate, prevBlockRate, totalScans, prevTotalScans } = useAnalytics();

  // Deterministic V1 Rules
  let statusMessage = "Everything is operating normally.";
  let statusColor = "green"; // green, yellow, red
  
  if (blockRate > (prevBlockRate * 1.5) && blockRate > 5) {
    statusMessage = "Elevated threat volume detected compared to previous period.";
    statusColor = "yellow";
  }
  
  if (threatsBlocked > 100 && blockRate > 20) {
    statusMessage = "High volume of threats requires immediate review.";
    statusColor = "red";
  }

  return (
    <PageHeader 
      title={`${greeting}, ${fullName}`}
      subtitle={
        <div className="flex flex-col mt-4">
          <div className="flex items-center space-x-2.5">
            <div className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-${statusColor}-400`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-${statusColor}-500 shadow-[0_0_8px_rgba(var(--tw-colors-${statusColor}-500),0.6)]`}></span>
            </div>
            <h2 className="text-sm font-medium text-neutral-300">{statusMessage}</h2>
          </div>
          
          <div className="flex items-center space-x-4 mt-3 text-[13px] text-muted font-medium">
            <span className="flex items-center text-muted">
              {statusColor === "green" ? <ShieldCheck className="w-4 h-4 mr-1.5 text-indigo-400" /> : <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-400" />}
              {threatsBlocked.toLocaleString()} threats blocked
            </span>
            <span className="w-1 h-1 rounded-full bg-white/[0.1]" />
            <span className="text-muted">Average latency {avgLatency} ms</span>
            <span className="w-1 h-1 rounded-full bg-white/[0.1]" />
            <span className="text-muted">{blockRate.toFixed(2)}% Block Rate</span>
          </div>
        </div>
      }
    />
  );
}
