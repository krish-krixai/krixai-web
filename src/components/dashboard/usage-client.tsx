"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, Activity, Clock, Server, Zap, ArrowRight, 
  Download, ChevronDown, CheckCircle2, AlertTriangle, CreditCard, Sparkles
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { createClient } from "@/utils/supabase/client";
import { useWorkspace } from "@/components/providers/workspace-provider";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function UsageClient() {
  const { activeWorkspace } = useWorkspace();
  const [isMounted, setIsMounted] = useState(false);
  const [timeRange, setTimeRange] = useState("30 Days");
  const [subscription, setSubscription] = useState<any>(null);
  const [stats, setStats] = useState<any>({ provider_breakdown: [], daily_trend: [] });
  
  const supabase = createClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (activeWorkspace) {
      const fetchData = async () => {
        const { data, error } = await supabase
          .from('workspace_subscriptions')
          .select('*')
          .eq('workspace_id', activeWorkspace.id)
          .single();
        if (data && !error) {
          setSubscription(data);
        }
        
        const { data: statsData } = await supabase.rpc('get_workspace_usage_stats', { p_workspace_id: activeWorkspace.id });
        if (statsData) {
          setStats(statsData);
        }
      };
      fetchData();
    }
  }, [activeWorkspace]);

  if (!isMounted || !subscription) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#000000] text-neutral-500 font-mono text-[13px]">
        Loading Usage Data...
      </div>
    );
  }

  // Current Plan Real Data
  const monthlyLimit = subscription?.included_scans || 10000;
  const used = subscription?.scans_used || 0;
  const remaining = Math.max(0, monthlyLimit - used);
  const usagePercentage = Math.min(100, (used / monthlyLimit) * 100);
  
  let barColor = "bg-indigo-500";
  let textColor = "text-indigo-400";
  let statusText = "Normal";
  
  if (usagePercentage > 90) {
    barColor = "bg-red-500";
    textColor = "text-red-400";
    statusText = "Critical";
  } else if (usagePercentage > 70) {
    barColor = "bg-amber-500";
    textColor = "text-amber-400";
    statusText = "Warning";
  }

  const providers = (stats?.provider_breakdown || []).map((p: any) => ({
    name: p.name,
    scans: p.scans,
    percent: used > 0 ? Math.round((p.scans / used) * 100) : 0,
  }));

  const periodStart = new Date(subscription?.period_start || Date.now()).getTime();
  const periodEnd = new Date(subscription?.period_end || Date.now() + 30*24*60*60*1000).getTime();
  const now = Date.now();
  const elapsedDays = Math.max(1, (now - periodStart) / (1000 * 60 * 60 * 24));
  const totalDays = Math.max(1, (periodEnd - periodStart) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, Math.ceil(totalDays - elapsedDays));
  const projectedScans = elapsedDays > 1 ? Math.round((used / elapsedDays) * totalDays) : null;
  const isWithinLimits = projectedScans !== null ? projectedScans <= monthlyLimit : true;

  const insights: any[] = [];

  const handleExport = () => {
    alert("Export initiated.");
  };

  // Chart data based on real history (empty for now until historical metrics API is integrated)
  const chartData: number[] = [];

  return (
    <div className="flex flex-col flex-1 pb-10 space-y-8 p-8 font-mono text-[13px] bg-[#000000] min-h-screen text-neutral-300">
      
      <div className="max-w-[1000px] mx-auto w-full space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-30">
          <div>
            <h1 className="text-white text-[15px] font-medium tracking-wide mb-1">Usage & Billing</h1>
            <p className="text-[13px] text-neutral-500">Track prompt scans, usage trends and plan consumption.</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button onClick={handleExport} className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-sm px-4 py-1.5 transition-colors flex items-center">
              [Export] <ChevronDown className="w-3 h-3 ml-2" />
            </button>
            <button onClick={() => window.location.href = '/dashboard/billing'} className="bg-white text-black hover:bg-neutral-200 rounded-sm px-4 py-1.5 font-medium flex items-center transition-colors">
              [View Billing]
            </button>
          </div>
        </div>

        {/* CORE METRICS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* CURRENT PLAN */}
          <div className="lg:col-span-2 bg-[#050505] border border-white/10 rounded-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <span className="text-white font-medium">Current Plan</span>
                <span className="px-2 py-0.5 bg-white/10 text-white text-[11px] uppercase tracking-widest">Starter</span>
              </div>
              <div className="text-right">
                <div className="text-[24px] text-white font-medium">{daysRemaining}</div>
                <div className="text-[11px] text-neutral-500 uppercase tracking-widest">Days Remaining</div>
              </div>
            </div>
            
            <div>
              <div className="flex items-baseline space-x-2 mb-2">
                <h2 className="text-[32px] font-medium text-white tracking-tight">{used.toLocaleString()}</h2>
                <span className="text-neutral-500">/ {monthlyLimit.toLocaleString()} scans</span>
              </div>

              <div className="w-full flex items-center gap-3">
                <span className={cn("font-medium", textColor)}>{usagePercentage.toFixed(1)}%</span>
                <div className="flex-1 h-2 bg-white/5 rounded-none overflow-hidden border border-white/10">
                  <div className={cn("h-full", barColor)} style={{ width: `${Math.max(1, usagePercentage)}%` }} />
                </div>
                <span className="text-neutral-500 text-[11px]">{remaining.toLocaleString()} remaining</span>
              </div>
            </div>
          </div>

          {/* PROJECTED */}
          <div className="bg-[#050505] border border-white/10 rounded-sm p-6 flex flex-col justify-between">
            <div>
              <div className="text-white font-medium mb-4">Projected End-of-Month</div>
              <div className="text-[32px] font-medium text-white tracking-tight mb-4">
                {projectedScans !== null ? projectedScans.toLocaleString() : "---"}
              </div>
              
              {projectedScans !== null ? (
                isWithinLimits ? (
                  <div className="text-green-400 font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Safely within limits
                  </div>
                ) : (
                  <div className="text-red-400 font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Projected to exceed limit
                  </div>
                )
              ) : (
                <div className="text-neutral-500">Not enough data</div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-[11px]">
              <span className="text-neutral-500 uppercase tracking-widest">Reset Date</span>
              <span className="text-white">{new Date(periodEnd).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* KPIs */}
        {used > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {([
              { label: "Scans This Period", value: used.toLocaleString(), trend: null },
              { label: "Avg Daily Usage", value: Math.round(used / Math.max(1, elapsedDays)).toLocaleString(), trend: null },
              { label: "Peak Usage Day", value: "---", desc: "Not enough historical data" },
              { label: "Avg Latency", value: "---", desc: "Awaiting logs" }
            ] as any[]).map((kpi, i) => (
              <div key={i} className="bg-[#050505] border border-white/10 rounded-sm p-5 flex flex-col justify-between h-[120px]">
                <div className="text-neutral-500">{kpi.label}</div>
                <div>
                  <div className="text-2xl text-white font-medium mb-1">{kpi.value}</div>
                  {kpi.trend ? (
                    <div className={cn("text-[11px]", kpi.trend.startsWith('+') ? "text-green-400" : "text-blue-400")}>
                      {kpi.trend} vs last period
                    </div>
                  ) : (
                    <div className="text-[11px] text-neutral-500">{kpi.desc}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* USAGE TREND */}
          <div className="lg:col-span-2 bg-[#050505] border border-white/10 rounded-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="text-white font-medium">Usage Trend (30 Days)</div>
              <div className="flex gap-2">
                <button className="text-neutral-500 hover:text-white transition-colors">[7D]</button>
                <button className="text-white">[30D]</button>
                <button className="text-neutral-500 hover:text-white transition-colors">[90D]</button>
              </div>
            </div>

            {chartData.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-neutral-500 border-b border-white/10 pb-4 mb-4">
                No historical trend data available.
              </div>
            ) : (
              <div className="h-32 flex items-end justify-between px-2 gap-2 mb-4 border-b border-white/10 pb-4">
                {chartData.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end gap-[1px] group relative hover:bg-white/5 transition-colors rounded-sm px-1">
                    <div className="w-full bg-indigo-500/80 group-hover:bg-indigo-400 transition-colors" style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between text-neutral-500 text-[11px] px-2 uppercase tracking-widest">
              <span>Start</span>
              <span>Mid</span>
              <span>End</span>
            </div>
          </div>

          {/* PROVIDER BREAKDOWN */}
          <div className="bg-[#050505] border border-white/10 rounded-sm p-6 flex flex-col">
            <div className="text-white font-medium mb-8">Provider Breakdown</div>
            
            <div className="flex-1 space-y-5">
              {providers.map((p: any) => (
                <div key={p.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-white">{p.name}</span>
                    <span className="text-neutral-500">{p.percent}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 overflow-hidden">
                    <div className="h-full bg-white/40" style={{ width: `${p.percent}%` }} />
                  </div>
                </div>
              ))}
              {providers.length === 0 && (
                <div className="text-neutral-500 text-center py-8">No provider data yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* INSIGHTS */}
        <div className="bg-[#050505] border border-white/10 rounded-sm p-6">
          <div className="text-white font-medium mb-6">AI Insights</div>
          <div className="space-y-4">
            {used === 0 ? (
              <div className="text-neutral-500">Insights will appear here.</div>
            ) : insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-4 p-4 border border-white/5 bg-white/[0.02]">
                <div className={cn("uppercase tracking-widest text-[11px] w-24 shrink-0 mt-0.5", insight.color)}>
                  {insight.type}
                </div>
                <div className="text-neutral-300 leading-relaxed">
                  {insight.text}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
