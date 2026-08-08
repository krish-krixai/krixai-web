"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Lock, ChevronLeft, ChevronRight, AlertTriangle, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useWorkspace } from "@/components/providers/workspace-provider";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ThreatLogsClient() {
  const { activeWorkspace } = useWorkspace();
  const [logs, setLogs] = useState<any[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;

  async function fetchLogs() {
    if (!activeWorkspace) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/logs?page=${currentPage}&limit=${rowsPerPage}`);
      if (!res.ok) throw new Error("Failed to fetch logs");
      const data = await res.json();
      
      // We map the backend real data to the terminal visual format
      setLogs(data.logs.map((log: any) => ({
        id: log.id,
        status: log.decision === "BLOCK" ? "BLK" : log.decision === "WARN" ? "FLG" : "PAS",
        time: new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        fullTime: new Date(log.timestamp).toLocaleString(),
        category: log.attackCategory || "None",
        conf: `${log.riskScore}%`,
        latency: `${log.latency}ms`,
        sourceIp: "203.0.113.42", // Mock IP for detail
        apiKey: log.provider,
        subType: log.reason?.substring(0,20) + "...",
        mode: log.decision === "BLOCK" ? "Blocking" : "Monitoring",
        prompt: log.prompt
      })) || []);
      setTotalLogs(data.total || 0);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, [currentPage, activeWorkspace]);

  return (
    <div className="flex-1 p-8 font-mono text-[13px] bg-[#000000] min-h-screen text-neutral-300 relative">
      <div className="max-w-[1000px] mx-auto space-y-6">
        
        <div className="text-white text-[15px] font-medium mb-6 tracking-wide">Detection Logs</div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="text-neutral-500">Filters:</div>
          <div className="flex items-center gap-2 text-[12px]">
            <select className="bg-transparent border border-white/10 rounded-sm px-2 py-1.5 text-white focus:outline-none focus:border-white/30">
              <option>All</option>
            </select>
            <select className="bg-transparent border border-white/10 rounded-sm px-2 py-1.5 text-white focus:outline-none focus:border-white/30">
              <option>Prompt Injection</option>
            </select>
            <select className="bg-transparent border border-white/10 rounded-sm px-2 py-1.5 text-white focus:outline-none focus:border-white/30">
              <option>Blocked</option>
            </select>
            <select className="bg-transparent border border-white/10 rounded-sm px-2 py-1.5 text-white focus:outline-none focus:border-white/30">
              <option>Today</option>
            </select>
            <button className="bg-white/5 border border-white/10 rounded-sm p-1.5 text-neutral-400 hover:text-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>
          <div className="ml-auto">
            <button className="flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-sm hover:bg-indigo-500/20 transition-colors">
              <Lock className="w-3.5 h-3.5" /> [Export CSV] PRO
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-white/10 rounded-sm bg-[#050505] overflow-hidden">
          <table className="w-full text-left">
            <thead className="border-b border-white/10">
              <tr>
                <th className="px-5 py-3.5 font-medium text-neutral-500">Status</th>
                <th className="px-5 py-3.5 font-medium text-neutral-500">Time</th>
                <th className="px-5 py-3.5 font-medium text-neutral-500">Category</th>
                <th className="px-5 py-3.5 font-medium text-neutral-500">Conf.</th>
                <th className="px-5 py-3.5 font-medium text-neutral-500">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-neutral-500">Scanning logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-neutral-500">No logs found.</td></tr>
              ) : logs.map((log) => (
                <tr 
                  key={log.id} 
                  onClick={() => setSelectedLog(log)}
                  className="border-b border-white/5 hover:bg-white/[0.04] cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3.5 flex items-center gap-2">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      log.status === "BLK" ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" : 
                      log.status === "FLG" ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" : 
                      "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                    )} />
                    <span className={
                      log.status === "BLK" ? "text-red-400 font-medium" : 
                      log.status === "FLG" ? "text-amber-400 font-medium" : 
                      "text-green-400 font-medium"
                    }>{log.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-neutral-400">{log.time}</td>
                  <td className="px-5 py-3.5 text-white">{log.category}</td>
                  <td className="px-5 py-3.5">{log.conf}</td>
                  <td className="px-5 py-3.5 text-neutral-400">{log.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-neutral-500">
          <div className="flex items-center gap-3">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white">{currentPage}</span> / {Math.max(1, Math.ceil(totalLogs / rowsPerPage))}
            <button 
              disabled={currentPage >= Math.ceil(totalLogs / rowsPerPage)}
              onClick={() => setCurrentPage(p => p + 1)}
              className="hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div>Showing {logs.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-{Math.min(currentPage * rowsPerPage, totalLogs)} of {totalLogs} detections</div>
        </div>

      </div>

      {/* Slide-in Detail Panel */}
      <AnimatePresence>
        {selectedLog && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" 
              onClick={() => setSelectedLog(null)} 
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[480px] bg-[#0A0A0A] border-l border-white/10 z-50 flex flex-col font-mono text-[13px] shadow-2xl"
            >
              
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div className="text-white text-[14px] font-medium tracking-wide">Detection Detail</div>
                <button onClick={() => setSelectedLog(null)} className="text-neutral-500 hover:text-white transition-colors">
                  [x]
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 text-neutral-400">
                
                <div className="grid grid-cols-[120px_1fr] gap-3">
                  <div>Request ID:</div><div className="text-white">{selectedLog.id}</div>
                  <div>Timestamp:</div><div className="text-white">{selectedLog.fullTime}</div>
                  <div>Source IP:</div><div className="text-white">{selectedLog.sourceIp}</div>
                  <div>Provider:</div><div className="text-white">{selectedLog.apiKey}</div>
                </div>

                <div className="h-px w-full bg-white/10 my-4" />

                <div className="grid grid-cols-[120px_1fr] gap-3">
                  <div>Category:</div><div className="text-white">{selectedLog.category}</div>
                  <div>Sub-type:</div><div className="text-white">{selectedLog.subType}</div>
                  <div>Confidence:</div>
                  <div className="text-white flex items-center gap-3">
                    {selectedLog.conf}
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white/40" style={{ width: selectedLog.conf }} />
                    </div>
                  </div>
                  <div>Action:</div>
                  <div className={cn("font-medium", selectedLog.status === "BLK" ? "text-red-400" : selectedLog.status === "FLG" ? "text-amber-400" : "text-green-400")}>
                    {selectedLog.status === "BLK" ? "BLOCKED" : selectedLog.status === "FLG" ? "FLAGGED" : "ALLOWED"}
                  </div>
                  <div>Scan time:</div><div className="text-white">{selectedLog.latency}</div>
                  <div>Mode:</div><div className="text-white">{selectedLog.mode}</div>
                </div>

                <div className="h-px w-full bg-white/10 my-4" />

                <div>
                  <div className="mb-2">Original Payload:</div>
                  <div className="p-4 bg-[#050505] border border-white/10 rounded-sm text-neutral-300 break-words leading-relaxed">
                    {selectedLog.prompt}
                  </div>
                </div>

                <div className="mt-8 border border-white/10 rounded-sm p-5 bg-[#050505]">
                  <div className="text-neutral-300 mb-4 font-medium flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-neutral-500" />
                    This is not an attack (false positive)
                  </div>
                  <button 
                    onClick={() => {
                      alert("False positive reported. Thank you for improving the model!");
                      setSelectedLog(null);
                    }}
                    className="bg-white/10 text-white hover:bg-white/20 transition-colors px-4 py-2 rounded-sm w-full font-medium tracking-wide"
                  >
                    [Report False Positive]
                  </button>
                  <div className="text-[11px] text-neutral-500 mt-3 text-center">
                    *Available on all plans. Helps improve detection accuracy.
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
