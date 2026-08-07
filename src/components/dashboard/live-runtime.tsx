"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Activity } from "lucide-react";
import { useAnalytics } from "../providers/analytics-provider";

type LogEntry = {
  id: string;
  type: "ALLOW" | "WARN" | "BLOCK";
  reason: string;
  risk: number;
  provider: string;
  latency: number;
};

export function LiveRuntime() {
  const { currentEvents, totalScans, threatsBlocked } = useAnalytics();

  const logs: LogEntry[] = currentEvents.slice(0, 50).map(e => ({
    id: e.id,
    type: e.decision,
    reason: e.threat_detections.length > 0 ? e.threat_detections[0].display_label : "Normal Request",
    risk: e.risk_score,
    provider: e.provider || "krixai",
    latency: e.processing_time_ms
  }));

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0A0A0A] flex flex-col lg:flex-row h-[420px] overflow-hidden">
      
      {/* Left: Security Shield & Stats */}
      <div className="flex-1 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.08] relative bg-[#080808]">
        
        {/* Top left status */}
        <div className="flex items-center justify-between w-full">
          <span className="text-[16px] font-semibold text-white">Runtime Protection</span>
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[13px] font-medium text-green-400">Active</span>
          </div>
        </div>

        {/* AI Shield Core */}
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-24 h-24 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-6 shadow-sm">
            <ShieldCheck className="w-12 h-12 text-white" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">All Policies Enforced</h2>
          <p className="text-[15px] text-neutral-400 text-center max-w-[250px]">Requests are being evaluated against your active workspace rules.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex flex-col p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
            <span className="text-[14px] text-neutral-400 font-medium mb-1">Live Scans</span>
            <span className="text-2xl font-semibold text-white">{totalScans.toLocaleString()}</span>
          </div>
          <div className="flex flex-col p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
            <span className="text-[14px] text-neutral-400 font-medium mb-1">Mitigated</span>
            <span className="text-2xl font-semibold text-white">{threatsBlocked.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Right: Live Threat Stream */}
      <div className="w-full lg:w-[480px] flex flex-col bg-[#0A0A0A]">
        <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-white flex items-center">
            <Activity className="w-4 h-4 mr-2 text-neutral-400" />
            Live Threat Stream
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ scrollbarWidth: "none" }}>
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 mt-16">
              <Activity className="w-8 h-8 text-neutral-600 mb-3" />
              <span className="text-neutral-400 font-medium text-[15px]">No recent requests</span>
              <span className="text-neutral-500 text-[14px] mt-1">Live requests will appear here as they are processed.</span>
            </div>
          ) : logs.map((log) => (
            <div 
              key={log.id} 
              className="flex items-center justify-between p-3.5 rounded-lg hover:bg-white/[0.03] transition-colors border border-transparent hover:border-white/[0.05] group cursor-default"
            >
              <div className="flex items-center space-x-3 w-32 shrink-0">
                {log.type === "ALLOW" && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
                {log.type === "WARN" && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                {log.type === "BLOCK" && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                <span className={`text-[13px] font-medium ${
                  log.type === "ALLOW" ? "text-green-400" :
                  log.type === "WARN" ? "text-amber-400" : "text-red-400"
                }`}>
                  {log.type === "ALLOW" ? "Allowed" : log.type === "WARN" ? "Warning" : "Blocked"}
                </span>
              </div>
              
              <div className="flex-1 truncate px-3">
                <p className="text-[14px] text-neutral-300 font-medium truncate">{log.reason}</p>
              </div>

              <div className="flex items-center space-x-4 shrink-0 text-right opacity-80 group-hover:opacity-100 transition-opacity">
                <span className="text-[13px] font-medium text-neutral-400">{log.latency}ms</span>
                <span className={`text-[13px] font-medium w-10 ${
                  log.risk > 80 ? "text-red-400" :
                  log.risk > 40 ? "text-amber-400" : "text-neutral-400"
                }`}>
                  {log.risk}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
