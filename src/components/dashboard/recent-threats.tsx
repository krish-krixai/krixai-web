"use client";
import React, { useState } from "react";
import { Filter, Search, ShieldAlert, ChevronDown, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAnalytics } from "../providers/analytics-provider";

function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} days ago`;
}

export function RecentThreats() {
  const { currentEvents } = useAnalytics();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const threats = currentEvents
    .filter(e => e.decision === "BLOCK" || e.decision === "WARN")
    .slice(0, 5)
    .map(e => ({
      id: e.id,
      time: timeAgo(e.created_at),
      provider: e.provider || "Unknown",
      type: e.threat_detections.length > 0 ? e.threat_detections[0].display_label : "Unknown",
      risk: e.risk_score,
      decision: e.decision === "BLOCK" ? "Blocked" : "Flagged",
      latency: e.processing_time_ms,
      source: e.source
    }));

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0A0A0A] flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
        <h3 className="text-[16px] font-semibold text-white flex items-center">
          <ShieldAlert className="w-4 h-4 mr-2 text-neutral-400" />
          Recent Threats
        </h3>
        <div className="flex items-center space-x-3">
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text"
              placeholder="Search threats..." 
              className="h-9 pl-9 pr-4 text-[14px] bg-white/[0.03] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-white/[0.15] w-64 transition-all" 
            />
          </div>
          <button className="h-9 px-4 text-[14px] font-medium bg-white/[0.03] border border-white/[0.08] rounded-lg text-white hover:bg-white/[0.06] transition-all flex items-center">
            <Filter className="w-4 h-4 mr-2 text-neutral-400" />
            Filter
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#0A0A0A] z-10 text-[14px] font-medium text-neutral-400 border-b border-white/[0.08]">
            <tr>
              <th className="px-6 py-4 font-medium">Timestamp</th>
              <th className="px-6 py-4 font-medium">Provider</th>
              <th className="px-6 py-4 font-medium">Attack Type</th>
              <th className="px-6 py-4 font-medium text-right">Risk Score</th>
              <th className="px-6 py-4 font-medium text-center">Decision</th>
              <th className="px-6 py-4 font-medium text-right">Latency</th>
              <th className="px-6 py-4 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-[14px]">
            {threats.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <ShieldAlert className="w-8 h-8 text-neutral-500 mb-3" />
                    <span className="text-neutral-300 font-medium text-[15px]">No threat history yet</span>
                    <span className="text-neutral-500 text-[14px] mt-1">Threats blocked by your policies will appear here.</span>
                  </div>
                </td>
              </tr>
            ) : threats.map(threat => {
              const isExpanded = expandedId === threat.id;
              return (
                <React.Fragment key={threat.id}>
                  <tr 
                    onClick={() => setExpandedId(isExpanded ? null : threat.id)}
                    className={`transition-colors cursor-pointer ${isExpanded ? "bg-white/[0.02]" : "hover:bg-white/[0.02]"}`}
                  >
                    <td className="px-6 py-4 text-neutral-300">{threat.time}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-neutral-200 font-medium">{threat.provider}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[13px] font-medium bg-white/[0.03] border border-white/[0.05] text-neutral-200">
                        {threat.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-[13px] font-medium ${
                        threat.risk >= 90 ? "bg-red-500/10 text-red-400" :
                        threat.risk >= 70 ? "bg-amber-500/10 text-amber-400" :
                        "bg-green-500/10 text-green-400"
                      }`}>
                        {threat.risk}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center text-[13px] font-medium ${
                        threat.decision === "Blocked" ? "text-red-400" : "text-amber-400"
                      }`}>
                        {threat.decision}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-neutral-400">
                      {threat.latency}ms
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-neutral-400 hover:text-white transition-colors">
                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown className="w-5 h-5" />
                        </motion.div>
                      </button>
                    </td>
                  </tr>
                  {/* Expanded Row */}
                  <AnimatePresence>
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="p-0 border-b-0 relative">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden bg-[#0A0A0A] border-t border-white/[0.04]"
                          >
                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8 pl-8 border-l-2 border-indigo-500/50">
                              <div className="space-y-4">
                                <p className="text-[14px] text-white font-medium">Request Details</p>
                                <div className="space-y-3 text-[14px]">
                                  <div className="flex justify-between items-center text-neutral-400">
                                    <span>Request ID</span>
                                    <span className="font-mono text-[13px] text-neutral-300">{threat.id}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-neutral-400">
                                    <span>Source</span>
                                    <span className="font-mono text-[13px] text-neutral-300">{threat.source}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-neutral-400">
                                    <span>Latency</span>
                                    <span className="text-neutral-300">{threat.latency}ms</span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-span-2 space-y-4">
                                <p className="text-[14px] text-white font-medium">Threat Analysis Log</p>
                                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[13px] text-neutral-300 font-mono leading-relaxed">
                                  &gt; System prompt bypass detected in user input.<br/>
                                  &gt; Vector similarity score exceeded threshold (0.94) for known jailbreak pattern.<br/>
                                  &gt; Injection payload neutralized at gateway level before LLM processing.<br/>
                                  &gt; Action taken: <span className="font-semibold text-red-400">BLOCK</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
