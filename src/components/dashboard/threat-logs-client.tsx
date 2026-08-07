"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Search, Filter, Calendar, Shield, ShieldAlert, Cpu, Activity, Download, X, 
  ChevronRight, ChevronLeft, ChevronDown, CheckCircle2, AlertTriangle, 
  XCircle, Copy, Clock, Lock, FileText, FileJson, Check,
  Orbit, Box, Sparkles, Zap, Server
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { createClient } from "@/utils/supabase/client";
import { useWorkspace } from "@/components/providers/workspace-provider";

// Data Types
type LogDecision = "ALLOW" | "WARN" | "BLOCK";
type RiskLevel = "Low" | "Medium" | "High" | "Critical";

interface Threat {
  type: string;
  description: string;
  severity: "High" | "Critical" | "Medium";
}

interface ThreatLog {
  id: string;
  timestamp: string;
  provider: string;
  prompt: string;
  attackCategory: string;
  riskScore: number;
  decision: LogDecision;
  latency: number;
  status: "Passed" | "Flagged" | "Blocked";
  source: "API" | "PLAYGROUND" | "SDK";
  threats: Threat[];
  reason: string;
  sanitizedPrompt: string | null;
  matchedPolicyName: string | null;
  coreDecision: LogDecision | null;
}

const getDecisionBadge = (decision: LogDecision) => {
  switch (decision) {
    case "ALLOW": return "text-green-400 bg-green-500/10";
    case "WARN": return "text-amber-400 bg-amber-500/10";
    case "BLOCK": return "text-red-400 bg-red-500/10";
  }
};

const getRiskLevel = (score: number): RiskLevel => {
  if (score < 30) return "Low";
  if (score < 60) return "Medium";
  if (score < 85) return "High";
  return "Critical";
};

const getRiskColors = (score: number) => {
  if (score < 30) return { text: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" };
  if (score < 60) return { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" };
  if (score < 85) return { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" };
  return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" };
};

const ProviderLogo = ({ provider, className }: { provider: string, className?: string }) => {
  const Icon = provider === "OpenAI" ? Orbit : 
               provider === "Anthropic" ? Box : 
               provider === "Gemini" ? Sparkles : 
               provider === "Groq" ? Zap : Server;
  return (
    <div className={cn("flex items-center justify-center w-6 h-6 rounded bg-white/[0.03] border border-white/[0.08]", className)}>
      <Icon className="w-3.5 h-3.5 text-neutral-400" />
    </div>
  );
};

export function ThreatLogsClient() {
  const { activeWorkspace } = useWorkspace();
  const [logs, setLogs] = useState<ThreatLog[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"ALL" | "API" | "PLAYGROUND">("ALL");
  const [selectedLog, setSelectedLog] = useState<ThreatLog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  
  const rowsPerPage = 12;
  async function fetchLogs() {
    if (!activeWorkspace) return;
    setIsLoading(true);
    
    try {
      const res = await fetch(`/api/logs?page=${currentPage}&limit=${rowsPerPage}&search=${encodeURIComponent(search)}&source=${sourceFilter}`);
      if (!res.ok) throw new Error("Failed to fetch logs");
      
      const data = await res.json();
      setLogs(data.logs || []);
      setTotalLogs(data.total || 0);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, [currentPage, search, sourceFilter, activeWorkspace]);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const metrics = useMemo(() => {
    const recent = logs.slice(0, 20); // most recent 20 for quick stats
    if (recent.length === 0) return { total: 0, blocked: 0, warnings: 0, allowed: 0, avgRisk: 0, avgTime: 0 };
    return {
      total: recent.length,
      blocked: recent.filter(l => l.decision === "BLOCK").length,
      warnings: recent.filter(l => l.decision === "WARN").length,
      allowed: recent.filter(l => l.decision === "ALLOW").length,
      avgRisk: Math.round(recent.reduce((acc, curr) => acc + curr.riskScore, 0) / recent.length),
      avgTime: Math.round(recent.reduce((acc, curr) => acc + curr.latency, 0) / recent.length),
    };
  }, [logs]);

  const totalPages = Math.ceil(totalLogs / rowsPerPage);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [id]: true });
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [id]: false })), 2000);
  };

  if (!isMounted || isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 font-mono text-[14px] h-full">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
        Loading real-time logs...
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full relative overflow-hidden">
      
      {/* SUMMARY METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6 mb-8 shrink-0">
        {[
          { label: "Threats Today", value: metrics.blocked + metrics.warnings, icon: ShieldAlert, color: "text-indigo-400" },
          { label: "Blocked", value: metrics.blocked, icon: XCircle, color: "text-red-400" },
          { label: "Warnings", value: metrics.warnings, icon: AlertTriangle, color: "text-amber-400" },
          { label: "Allowed", value: metrics.allowed, icon: CheckCircle2, color: "text-green-400" },
          { label: "Avg Risk", value: metrics.avgRisk, icon: Activity, color: "text-white", suffix: "/ 100" },
          { label: "Avg Latency", value: metrics.avgTime, icon: Clock, color: "text-white", suffix: "ms" },
        ].map(m => (
          <div key={m.label} className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-5 flex flex-col justify-between hover:border-white/[0.15] transition-colors group h-32">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-[14px] font-medium">{m.label}</span>
              <m.icon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className={cn("text-3xl font-semibold tracking-tight", m.color)}>{m.value}</span>
              {m.suffix && <span className="text-[13px] font-medium text-neutral-500">{m.suffix}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-t-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 relative z-20">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="relative group w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search prompts, users, providers..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full h-10 bg-white/[0.03] border border-white/[0.08] rounded-lg pl-9 pr-4 text-[14px] text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-white/[0.2] transition-colors"
            />
          </div>
          
          <div className="hidden lg:flex items-center space-x-2">
            <div className="bg-white/[0.03] p-1 rounded-lg border border-white/[0.05] flex items-center">
              {(["ALL", "API", "PLAYGROUND"] as const).map(filter => (
                <button 
                  key={filter} 
                  onClick={() => { setSourceFilter(filter); setCurrentPage(1); }}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors",
                    sourceFilter === filter 
                      ? "bg-white/[0.08] text-white" 
                      : "text-neutral-500 hover:text-neutral-300 transparent"
                  )}
                >
                  {filter === "ALL" ? "All" : filter === "API" ? "API" : "Playground"}
                </button>
              ))}
            </div>
            {["Date Range", "Provider", "Risk Level"].map(filter => (
              <button key={filter} className="h-10 px-4 bg-white/[0.03] border border-white/[0.08] rounded-lg text-[13px] font-medium text-neutral-400 hover:text-white hover:bg-white/[0.06] flex items-center transition-colors">
                {filter} <ChevronDown className="w-4 h-4 ml-2 opacity-60" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
          <button className="text-[13px] font-medium text-neutral-500 hover:text-neutral-300 transition-colors px-2">Clear Filters</button>
          <div className="w-px h-5 bg-white/[0.1]" />
          <div className="relative" ref={exportRef}>
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="h-10 px-4 bg-white/[0.03] border border-white/[0.08] rounded-lg text-[13px] font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] flex items-center transition-colors"
            >
              <Download className="w-4 h-4 mr-2 text-neutral-400" /> Export
              <ChevronDown className="w-4 h-4 ml-2 opacity-60" />
            </button>
            
            <AnimatePresence>
              {showExportMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-[#1A1A1A] border border-white/[0.08] rounded-lg shadow-xl overflow-hidden py-1 z-50"
                >
                  <button className="w-full px-4 py-2.5 text-left text-[13px] font-medium text-neutral-400 cursor-not-allowed flex items-center justify-between">
                    Export as CSV <span className="text-[10px] bg-white/[0.05] px-1.5 py-0.5 rounded">Soon</span>
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-[13px] font-medium text-neutral-400 cursor-not-allowed flex items-center justify-between">
                    Export as JSON <span className="text-[10px] bg-white/[0.05] px-1.5 py-0.5 rounded">Soon</span>
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-[13px] font-medium text-neutral-400 cursor-not-allowed flex items-center justify-between">
                    Export as PDF <span className="text-[10px] bg-white/[0.05] px-1.5 py-0.5 rounded">Soon</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="flex-1 bg-transparent border-x border-white/[0.08] overflow-auto custom-scrollbar relative z-0">
        {logs.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
              <ShieldAlert className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-[16px] font-medium text-white mb-2">No threat history yet</h3>
            <p className="text-[14px] text-neutral-500 max-w-sm mb-6 leading-relaxed">Start scanning prompts in the playground or adjust your filters to view forensic history.</p>
            <button className="h-9 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[13px] font-medium transition-colors">
              Open Playground
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead className="sticky top-0 bg-[#0A0A0A] border-b border-white/[0.08] z-20">
              <tr>
                {["Timestamp", "Source", "Provider", "Prompt Preview", "Category", "Risk Score", "Decision", "Latency"].map(th => (
                  <th key={th} className="px-6 py-4 text-[14px] font-medium text-neutral-400 whitespace-nowrap">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {logs.map((log) => {
                const riskColors = getRiskColors(log.riskScore);
                const riskLevel = getRiskLevel(log.riskScore);
                
                return (
                  <tr 
                    key={log.id} 
                    onClick={() => setSelectedLog(log)}
                    className="group hover:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-[14px] text-neutral-300">{log.timestamp}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex px-2 py-1 rounded text-[12px] font-medium border",
                        log.source === "API" ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" : 
                        log.source === "SDK" ? "text-blue-400 bg-blue-500/10 border-blue-500/20" : 
                        "text-neutral-400 bg-white/[0.05] border-white/[0.1]"
                      )}>
                        {log.source === "API" ? "API" : log.source === "SDK" ? "SDK" : "Playground"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <ProviderLogo provider={log.provider} />
                        <span className="text-[14px] font-medium text-neutral-200">{log.provider}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[14px] text-neutral-400 group-hover:text-neutral-200 truncate max-w-[300px] xl:max-w-[450px] transition-colors">
                        {log.prompt}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.attackCategory === "None" ? (
                        <span className="text-[14px] text-neutral-600">—</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded text-[13px] font-medium text-red-400 bg-red-500/10">
                          <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> {log.attackCategory}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={cn("text-[13px] font-medium", riskColors.text)}>{log.riskScore}</span>
                        <span className={cn("text-[13px] font-medium", riskColors.text)}>{riskLevel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn("inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[13px] font-medium border border-transparent", getDecisionBadge(log.decision))}>
                        {log.decision === "BLOCK" ? "Blocked" : log.decision === "WARN" ? "Warning" : "Allowed"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[14px] text-neutral-400">
                        {log.latency} ms
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-b-xl p-4 flex items-center justify-between shrink-0 relative z-20">
        <div className="text-[13px] font-medium text-neutral-500 pl-2">
          Showing <span className="text-white">{logs.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}</span> to <span className="text-white">{Math.min(currentPage * rowsPerPage, totalLogs)}</span> of <span className="text-white">{totalLogs}</span> logs
        </div>
        <div className="flex items-center space-x-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.08] text-neutral-400 hover:text-white hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[13px] font-medium text-neutral-400 px-3">Page {currentPage} of {Math.max(1, totalPages)}</span>
          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(p => p + 1)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.08] text-neutral-400 hover:text-white hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SLIDE-OVER DETAILS PANEL */}
      <AnimatePresence>
        {selectedLog && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSelectedLog(null)}
            />
            <motion.div 
              initial={{ x: "100%", boxShadow: "-20px 0 40px rgba(0,0,0,0)" }} 
              animate={{ x: 0, boxShadow: "-20px 0 40px rgba(0,0,0,0.5)" }} 
              exit={{ x: "100%", boxShadow: "-20px 0 40px rgba(0,0,0,0)" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-full sm:w-[650px] bg-[#0A0A0A] border-l border-white/[0.08] z-50 flex flex-col"
            >
              <div className="px-8 py-6 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-[#0A0A0A]">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h2 className="text-[18px] font-medium text-white">Threat Investigation</h2>
                    <span className={cn(
                      "inline-flex px-2 py-0.5 rounded text-[12px] font-medium border",
                      selectedLog.source === "API" ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" : 
                      selectedLog.source === "SDK" ? "text-blue-400 bg-blue-500/10 border-blue-500/20" : 
                      "text-neutral-400 bg-white/[0.05] border-white/[0.1]"
                    )}>
                      {selectedLog.source === "API" ? "API" : selectedLog.source === "SDK" ? "SDK" : "Playground"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[13px] text-neutral-500 font-mono">
                    <span>{selectedLog.id}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-600" />
                    <span>{selectedLog.timestamp}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                
                {/* Metric Strip */}
                <div className="flex gap-4">
                  <div className="flex-1 p-5 bg-white/[0.02] border border-white/[0.05] rounded-xl flex flex-col justify-center">
                    <span className="text-[14px] font-medium text-neutral-400 mb-2 flex items-center"><Shield className="w-4 h-4 mr-2" /> Decision</span>
                    <span className={cn("text-[16px] font-semibold", getDecisionBadge(selectedLog.decision).split(' ')[0])}>
                      {selectedLog.decision === "BLOCK" ? "Blocked" : selectedLog.decision === "WARN" ? "Warning" : "Allowed"}
                    </span>
                  </div>
                  <div className="flex-1 p-5 bg-white/[0.02] border border-white/[0.05] rounded-xl flex flex-col justify-center">
                    <span className="text-[14px] font-medium text-neutral-400 mb-2 flex items-center"><Activity className="w-4 h-4 mr-2" /> Risk Score</span>
                    <div className="flex items-baseline space-x-2">
                      <span className={cn("text-[24px] font-semibold leading-none", getRiskColors(selectedLog.riskScore).text)}>{selectedLog.riskScore}</span>
                      <span className="text-[13px] font-medium text-neutral-500">/ 100</span>
                    </div>
                  </div>
                  <div className="flex-1 p-5 bg-white/[0.02] border border-white/[0.05] rounded-xl flex flex-col justify-center">
                    <span className="text-[14px] font-medium text-neutral-400 mb-2 flex items-center"><Cpu className="w-4 h-4 mr-2" /> Provider</span>
                    <div className="flex items-center space-x-2">
                      <ProviderLogo provider={selectedLog.provider} className="w-5 h-5" />
                      <span className="text-[16px] font-semibold text-white">{selectedLog.provider}</span>
                    </div>
                  </div>
                </div>

                {/* Reasoning */}
                <div>
                  <h4 className="text-[14px] font-medium text-white mb-3">Policy Evaluation</h4>
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[14px] text-neutral-300 leading-relaxed font-medium">
                    {selectedLog.matchedPolicyName && (
                      <div className="mb-4 pb-4 border-b border-white/[0.05]">
                        <div className="text-[14px] text-neutral-500 mb-1">Matched Custom Policy</div>
                        <div className="text-indigo-400">{selectedLog.matchedPolicyName}</div>
                      </div>
                    )}
                    <div className="mb-4 pb-4 border-b border-white/[0.05]">
                      <div className="text-[14px] text-neutral-500 mb-1">Core Engine Decision</div>
                      <div className={cn("font-medium", (selectedLog.coreDecision || selectedLog.decision) === "ALLOW" ? "text-green-400" : (selectedLog.coreDecision || selectedLog.decision) === "WARN" ? "text-amber-400" : "text-red-400")}>
                         {(selectedLog.coreDecision || selectedLog.decision) === "BLOCK" ? "Blocked" : (selectedLog.coreDecision || selectedLog.decision) === "WARN" ? "Warning" : "Allowed"}
                      </div>
                    </div>
                    <div className="text-[14px] text-neutral-500 mb-1">Explanation</div>
                    {selectedLog.reason}
                  </div>
                </div>

                {/* Detected Threats */}
                {selectedLog.threats.length > 0 && (
                  <div>
                    <h4 className="text-[14px] font-medium text-white mb-3">Detected Threats</h4>
                    <div className="space-y-3">
                      {selectedLog.threats.map((t, i) => (
                        <div key={i} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-4">
                          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                          <div>
                            <div className="text-[14px] font-medium text-red-400">{t.type}</div>
                            <div className="text-[14px] text-red-300 mt-1 leading-relaxed">{t.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Original Prompt */}
                <div className="relative group">
                  <h4 className="text-[14px] font-medium text-white mb-3 flex items-center justify-between">
                    Original Payload
                    <button onClick={() => handleCopy(selectedLog.prompt, 'prompt')} className="text-neutral-400 hover:text-white transition-colors flex items-center text-[12px] bg-white/[0.05] px-2.5 py-1 rounded">
                      {copiedStates['prompt'] ? <Check className="w-3.5 h-3.5 text-green-400 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                      {copiedStates['prompt'] ? "Copied" : "Copy"}
                    </button>
                  </h4>
                  <div className="p-5 rounded-xl bg-[#030303] border border-white/[0.05] text-[14px] font-mono text-neutral-300 leading-relaxed break-words">
                    {selectedLog.prompt}
                  </div>
                </div>

                {/* Sanitized Prompt */}
                {selectedLog.sanitizedPrompt && (
                  <div className="relative group">
                    <h4 className="text-[14px] font-medium text-white mb-3 flex items-center justify-between">
                      Sanitized Payload
                      <button onClick={() => handleCopy(selectedLog.sanitizedPrompt!, 'sanitized')} className="text-neutral-400 hover:text-white transition-colors flex items-center text-[12px] bg-white/[0.05] px-2.5 py-1 rounded">
                        {copiedStates['sanitized'] ? <Check className="w-3.5 h-3.5 text-green-400 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                        {copiedStates['sanitized'] ? "Copied" : "Copy"}
                      </button>
                    </h4>
                    <div className="p-5 rounded-xl bg-[#05150a] border border-[#4ade80]/20 text-[14px] font-mono text-[#4ade80]/90 leading-relaxed break-words">
                      {selectedLog.sanitizedPrompt}
                    </div>
                  </div>
                )}

                {/* Execution Timeline */}
                <div>
                  <h4 className="text-[14px] font-medium text-white mb-4">Execution Timeline</h4>
                  <div className="flex flex-col space-y-2 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-white/[0.08]">
                    <div className="flex items-center space-x-4 text-[14px] text-neutral-400 relative z-10">
                      <div className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-white/[0.1] flex items-center justify-center shrink-0"><ChevronRight className="w-3.5 h-3.5 text-neutral-500" /></div>
                      <span>Request received from gateway</span>
                    </div>
                    <div className="flex items-center space-x-4 text-[14px] text-neutral-400 relative z-10 py-2">
                      <div className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-indigo-500/50 flex items-center justify-center shrink-0"><Lock className="w-3.5 h-3.5 text-indigo-400" /></div>
                      <span className="text-indigo-300">Security layers processed ({selectedLog.latency}ms)</span>
                    </div>
                    <div className="flex items-center space-x-4 text-[14px] font-medium text-neutral-300 relative z-10">
                      <div className={cn("w-6 h-6 rounded-full border flex items-center justify-center shrink-0 bg-[#1A1A1A]", selectedLog.decision === "ALLOW" ? "border-green-500/40" : "border-red-500/40")}>
                        {selectedLog.decision === "ALLOW" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                      </div>
                      <span className={selectedLog.decision === "ALLOW" ? "text-green-400" : "text-red-400"}>Action enforced: {selectedLog.decision === "BLOCK" ? "Blocked" : selectedLog.decision === "WARN" ? "Warning" : "Allowed"}</span>
                    </div>
                  </div>
                </div>

                <div className="h-6" /> {/* Spacer */}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
