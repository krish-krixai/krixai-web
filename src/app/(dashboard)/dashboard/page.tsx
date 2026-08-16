"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, ArrowRight, ShieldAlert, CheckCircle2, Clock, Activity } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardOverview() {
  const [userName, setUserName] = useState("User");
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user?.user_metadata?.full_name) {
        setUserName(data.user.user_metadata.full_name.split(" ")[0]);
      }

      // Fetch real logs to populate the dashboard metrics
      try {
        const res = await fetch(`/api/logs?page=1&limit=50`);
        if (res.ok) {
          const logsData = await res.json();
          setLogs(logsData.data || []);
        }
      } catch(e) {
        console.error("Failed to fetch logs", e);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Calculate real metrics from the logs
  const requestsScanned = logs.length;
  const threatsBlocked = logs.filter(l => l.status === "blocked").length;
  const threatsFlagged = logs.filter(l => l.status === "flagged").length;
  const falsePositiveRate = requestsScanned > 0 ? ((logs.filter(l => (l.category === "None" || !l.category) && l.status !== "passed").length / requestsScanned) * 100).toFixed(1) : "0.0";
  const avgLatency = requestsScanned > 0 ? Math.round(logs.reduce((acc, curr) => acc + (curr.scan_time_ms || 0), 0) / requestsScanned) : 0;

  // Generate chart data based on real logs (binning by day is complex client-side without timestamps spanning days, so we render flat or empty for now if no historical data is processed)
  const chartData: number[] = [];

  return (
    <div className="flex-1 p-8 font-mono text-[13px] bg-[#000000] min-h-screen text-neutral-300">
      <div className="max-w-[1000px] mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-white text-[14px]">
            {greeting}, {userName} <span className="inline-block animate-wave">👋</span>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-sm">
            <span className="text-neutral-500">Mode:</span>
            <span className="flex items-center gap-2 text-white font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
              BLOCKING
            </span>
          </div>
        </div>

        {/* The 4 Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border border-white/10 p-5 rounded-sm flex flex-col justify-between h-[160px] bg-[#050505] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="text-3xl font-medium text-white mb-2">{isLoading ? "--" : requestsScanned}</div>
              <div className="text-neutral-500">Requests<br/>Scanned<br/>today</div>
            </div>
            <Activity className="absolute bottom-4 right-4 w-12 h-12 text-white/5" />
          </div>
          <div className="border border-white/10 p-5 rounded-sm flex flex-col justify-between h-[160px] bg-[#050505] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="text-3xl font-medium text-red-500 mb-2">{isLoading ? "--" : threatsBlocked}</div>
              <div className="text-neutral-500">Threats<br/>Blocked<br/>today</div>
            </div>
            <div className="flex items-center gap-2 text-neutral-500 mt-2 text-[11px] relative z-10">
              -- vs yesterday
            </div>
            <ShieldAlert className="absolute bottom-4 right-4 w-12 h-12 text-red-500/5" />
          </div>
          <div className="border border-white/10 p-5 rounded-sm flex flex-col justify-between h-[160px] bg-[#050505] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="text-3xl font-medium text-white mb-2">{isLoading ? "--" : falsePositiveRate}%</div>
              <div className="text-neutral-500">False<br/>Positive<br/>Rate</div>
            </div>
            <div className="flex items-center gap-2 text-neutral-500 mt-2 text-[11px] relative z-10">
              -- vs last wk
            </div>
            <CheckCircle2 className="absolute bottom-4 right-4 w-12 h-12 text-green-500/5" />
          </div>
          <div className="border border-white/10 p-5 rounded-sm flex flex-col justify-between h-[160px] bg-[#050505] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="text-3xl font-medium text-white mb-2">{isLoading ? "--" : avgLatency}<span className="text-xl text-neutral-500">ms</span></div>
              <div className="text-neutral-500">Avg<br/>Scan<br/>Latency</div>
            </div>
            <div className="flex items-center gap-2 text-neutral-500 mt-2 text-[11px] relative z-10">
              -- threshold
            </div>
            <Clock className="absolute bottom-4 right-4 w-12 h-12 text-blue-500/5" />
          </div>
        </div>

        {/* Detection Activity (Last 7 Days) */}
        <div>
          <div className="mb-3 text-white text-[14px]">Detection Activity (Last 7 Days)</div>
          <div className="border border-white/10 p-8 rounded-sm bg-[#050505]">
            
            {chartData.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-neutral-500 border-b border-white/5 pb-4 mb-4">
                No historical data available for this period.
              </div>
            ) : (
              <div className="h-32 flex items-end justify-between px-2 gap-2 mb-4 border-b border-white/5 pb-4">
                {chartData.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end gap-[1px] group relative hover:bg-white/5 transition-colors rounded-sm px-1 cursor-crosshair">
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#111] border border-white/10 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {h} Scanned
                    </div>
                    <div className="w-full bg-red-500/80 rounded-t-[1px] hover:bg-red-400 transition-colors" style={{ height: `${h * 0.2}%` }} />
                    <div className="w-full bg-amber-500/80 hover:bg-amber-400 transition-colors" style={{ height: `${h * 0.1}%` }} />
                    <div className="w-full bg-white/20 rounded-b-[1px] group-hover:bg-white/30 transition-colors" style={{ height: `${h * 0.7}%` }} />
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-between text-neutral-500 text-[11px] px-2 mb-8 border-b border-white/5 pb-4">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            <div className="flex items-center justify-center gap-8 text-[12px] text-neutral-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white/20 rounded-sm" /> Scanned
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-sm shadow-[0_0_8px_rgba(239,68,68,0.4)]" /> Blocked
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-sm shadow-[0_0_8px_rgba(245,158,11,0.4)]" /> Flagged
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-neutral-600 bg-white/5 px-2 py-1 rounded-sm border border-white/5 cursor-not-allowed">
              <Lock className="w-3 h-3" /> [30 days] Pro
            </span>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="mb-3 text-white text-[14px]">Recent Activity</div>
          <div className="border border-white/10 rounded-sm bg-[#050505] flex flex-col overflow-hidden">
            
            {isLoading ? (
               <div className="p-8 text-center text-neutral-500">Loading recent activity...</div>
            ) : logs.length === 0 ? (
               <div className="p-8 text-center text-neutral-500">No recent activity found.</div>
            ) : logs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center p-4 border-b border-white/5 hover:bg-white/[0.03] transition-colors group cursor-pointer">
                <div className="w-12">
                  <span className={cn(
                    "w-2.5 h-2.5 rounded-full inline-block",
                    log.status === "blocked" ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" :
                    log.status === "flagged" ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" :
                    "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                  )} />
                </div>
                <div className="w-24 text-neutral-500">
                  {new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <div className={cn(
                  "flex-1 font-medium",
                  log.status === "blocked" ? "text-red-400" :
                  log.status === "flagged" ? "text-amber-400" :
                  "text-neutral-300"
                )}>
                  {log.status === "blocked" ? "Threat Blocked" : log.status === "flagged" ? "Threat Flagged" : "Request Passed"}
                  <span className="text-neutral-500 font-normal ml-2 hidden sm:inline">- {log.category || "No threat"}</span>
                </div>
                <div className="w-16 text-right text-neutral-300">{log.confidence > 0 ? `${(log.confidence * 100).toFixed(1)}%` : "—"}</div>
                <div className="w-16 text-right text-neutral-500">{log.scan_time_ms}ms</div>
              </div>
            ))}

            <div className="p-4 bg-[#0A0A0A] border-t border-white/10 text-center">
              <Link href="/dashboard/logs" className="text-white hover:text-neutral-300 flex items-center justify-center gap-2 group tracking-wide">
                [View All Logs <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />]
              </Link>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
