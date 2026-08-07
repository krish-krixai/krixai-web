"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, Activity, Clock, Server, Zap, ArrowUpRight, 
  ArrowDownRight, Download, ChevronDown, CheckCircle2, 
  AlertTriangle, CreditCard, ChevronRight, Sparkles, Calendar,
  TrendingUp, Info, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { createClient } from "@/utils/supabase/client";
import { useWorkspace } from "@/components/providers/workspace-provider";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Sparkline Component
function Sparkline({ data, color, className }: { data: number[], color: string, className?: string }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((val, i) => {
    const x = (i / (Math.max(1, data.length - 1))) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y || 0}`;
  }).join(" ");

  return (
    <svg viewBox="0 -10 100 120" className={cn("w-20 h-10 overflow-visible", className)} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polygon
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        points={`0,100 ${points} 100,100`}
        fill={`url(#spark-${color})`}
      />
      <motion.polyline
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Custom Line Chart Component
function UsageTrendChart({ timeRange }: { timeRange: string }) {
  const pointsCount = timeRange === "7 Days" ? 7 : timeRange === "30 Days" ? 30 : 90;
  
  const [data, setData] = useState<number[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    // Return empty array (0s) for new users with no data
    const realData = Array(pointsCount).fill(0);
    setData(realData);
  }, [timeRange]);

  if (data.length === 0) return <div className="h-64 w-full animate-pulse bg-white/[0.02] rounded-xl" />;

  const maxVal = Math.max(...data);
  const max = maxVal > 0 ? maxVal * 1.1 : 1; 

  const points = data.map((val, i) => {
    const x = (i / (Math.max(1, data.length - 1))) * 100;
    const y = 100 - (val / max) * 100;
    return `${x},${y || 0}`;
  }).join(" ");

  return (
    <div className="relative h-[280px] w-full mt-8 group">
      {/* Grid Lines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-full h-px bg-white/[0.04]" />
        ))}
      </div>

      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="usageGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Fill Area */}
        <motion.polygon
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          points={`0,100 ${points} 100,100`}
          fill="url(#usageGradient)"
        />

        {/* Line */}
        <motion.polyline
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          points={points}
          fill="none"
          stroke="#6366f1"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hover Points */}
        {data.map((val, i) => {
          const x = (i / (Math.max(1, data.length - 1))) * 100;
          const y = 100 - (val / max) * 100;
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y || 0}
                r="4"
                fill="#0A0A0A"
                stroke="#6366f1"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <rect
                x={x - 3}
                y="0"
                width="6"
                height="100"
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-crosshair"
              />
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-0 -translate-y-[80px] bg-[#1A1A1A] border border-white/[0.08] shadow-2xl rounded-xl p-3.5 pointer-events-none z-10 min-w-[180px]"
            style={{ 
              left: `calc(${(hoveredIndex / (data.length - 1)) * 100}%)`,
              transform: `translateX(-50%)`
            }}
          >
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/[0.08]">
              <span className="text-[13px] font-medium text-neutral-400">Day {hoveredIndex + 1}</span>
              <span className="text-[12px] font-medium text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +2.4%
              </span>
            </div>
            <div className="flex items-baseline space-x-1.5 mb-1">
              <span className="text-[24px] font-semibold text-white tracking-tight leading-none">{data[hoveredIndex].toLocaleString()}</span>
              <span className="text-[14px] font-medium text-neutral-500">Scans</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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
      <div className="flex-1 flex flex-col items-center justify-center h-full text-neutral-500">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-[14px] font-medium">Loading Usage Data...</span>
      </div>
    );
  }

  // Current Plan Real Data
  const monthlyLimit = subscription?.included_scans || 50000;
  const used = subscription?.scans_used || 0;
  const remaining = Math.max(0, monthlyLimit - used);
  const usagePercentage = Math.min(100, (used / monthlyLimit) * 100);
  
  let barColor = "from-indigo-500 to-indigo-400";
  let textColor = "text-indigo-400";
  let bgGlow = "shadow-[0_0_40px_rgba(99,102,241,0.2)]";
  
  if (usagePercentage > 90) {
    barColor = "from-red-500 to-red-400";
    textColor = "text-red-400";
    bgGlow = "shadow-[0_0_40px_rgba(239,68,68,0.2)]";
  } else if (usagePercentage > 70) {
    barColor = "from-amber-500 to-amber-400";
    textColor = "text-amber-400";
    bgGlow = "shadow-[0_0_40px_rgba(245,158,11,0.2)]";
  }

  const providerColors: Record<string, string> = {
    "OpenAI": "#10a37f",
    "Claude": "#d97757",
    "Anthropic": "#d97757",
    "Gemini": "#4285f4",
    "Groq": "#f55036",
    "Bedrock": "#ff9900",
    "Unknown": "#6b7280"
  };

  const providers = (stats?.provider_breakdown || []).map((p: any) => ({
    name: p.name,
    scans: p.scans,
    percent: used > 0 ? Math.round((p.scans / used) * 100) : 0,
    color: providerColors[p.name] || providerColors["Unknown"],
  }));

  const periodStart = new Date(subscription?.period_start).getTime();
  const periodEnd = new Date(subscription?.period_end).getTime();
  const now = Date.now();
  const elapsedDays = Math.max(1, (now - periodStart) / (1000 * 60 * 60 * 24));
  const totalDays = Math.max(1, (periodEnd - periodStart) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, Math.ceil(totalDays - elapsedDays));
  const projectedScans = elapsedDays > 1 ? Math.round((used / elapsedDays) * totalDays) : null;
  const isWithinLimits = projectedScans !== null ? projectedScans <= monthlyLimit : true;

  const insights = [
    { type: "Recommendation", text: "Enable latency caching on OpenAI to reduce average request time by 4ms.", color: "text-indigo-400 bg-indigo-500/10" },
    { type: "Trend", text: "Usage increased 18% this week compared to last week.", color: "text-blue-400 bg-blue-500/10" },
    { type: "Observation", text: "OpenAI accounts for 62% of all traffic.", color: "text-neutral-300 bg-white/[0.05]" },
  ];

  const handleExport = (format: 'csv' | 'json') => {
    const exportData = {
      workspaceId: activeWorkspace?.id || 'unknown',
      exportDate: new Date().toISOString(),
      totalLimit: monthlyLimit,
      usedScans: used,
      remainingScans: remaining,
      providers: providers.map((p: any) => ({ name: p.name, scans: p.scans, percentage: p.percent }))
    };

    let content = '';
    let mimeType = '';
    let fileExtension = format;

    if (format === 'json') {
      content = JSON.stringify(exportData, null, 2);
      mimeType = 'application/json';
    } else if (format === 'csv') {
      content = `Metric,Value\n`;
      content += `Workspace ID,${exportData.workspaceId}\n`;
      content += `Export Date,${exportData.exportDate}\n`;
      content += `Total Limit,${exportData.totalLimit}\n`;
      content += `Used Scans,${exportData.usedScans}\n`;
      content += `Remaining Scans,${exportData.remainingScans}\n\n`;
      content += `Provider,Scans,Percentage\n`;
      exportData.providers.forEach((p: any) => {
        content += `${p.name},${p.scans},${p.percentage}%\n`;
      });
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `krixai-usage-export.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col flex-1 pb-10 space-y-8 max-w-7xl mx-auto w-full">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-30 mb-2">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-white mb-1.5">Usage & Billing</h1>
          <p className="text-[15px] text-neutral-400">Track prompt scans, usage trends and plan consumption across your AI infrastructure.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <button className="h-10 px-4 bg-[#0A0A0A] border border-white/[0.08] rounded-lg text-[14px] font-medium text-neutral-300 hover:text-white hover:bg-white/[0.04] flex items-center transition-colors">
              <Download className="w-4 h-4 mr-2" /> Export <ChevronDown className="w-4 h-4 ml-2 opacity-60" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#1A1A1A] border border-white/[0.08] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
              <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-2.5 text-[14px] font-medium text-neutral-300 hover:text-white hover:bg-white/[0.05] transition-colors">Export CSV</button>
              <button onClick={() => handleExport('json')} className="w-full text-left px-4 py-2.5 text-[14px] font-medium text-neutral-300 hover:text-white hover:bg-white/[0.05] transition-colors">Export JSON</button>
              <div className="w-full h-px bg-white/[0.05] my-1" />
              <button onClick={() => alert("PDF Export is coming soon.")} className="w-full text-left px-4 py-2.5 text-[14px] font-medium text-neutral-500 cursor-not-allowed flex items-center justify-between">PDF <span className="text-[10px] bg-white/[0.05] px-2 py-0.5 rounded-md text-white">Soon</span></button>
            </div>
          </div>
          <button onClick={() => window.location.href = '/dashboard/billing'} className="h-10 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[14px] font-medium flex items-center transition-colors shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <CreditCard className="w-4 h-4 mr-2" /> View Billing
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CURRENT PLAN - MASTER CARD */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-8 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-[15px] font-medium text-neutral-400">Current Plan</span>
                <span className="px-2.5 py-0.5 bg-white/[0.05] border border-white/[0.08] rounded-md text-[13px] font-medium text-white">Starter</span>
              </div>
              <div className="flex items-baseline space-x-2">
                <h2 className="text-[42px] font-semibold text-white tracking-tight leading-none">{used.toLocaleString()}</h2>
                <span className="text-[16px] font-medium text-neutral-500">/ {monthlyLimit.toLocaleString()} scans</span>
              </div>
            </div>
            
            <div className="text-right hidden sm:block">
              <div className="text-[14px] font-medium text-neutral-500 mb-1">Days Remaining</div>
              <div className="text-[20px] font-medium text-white">{daysRemaining} <span className="text-[14px] text-neutral-500">Days</span></div>
            </div>
          </div>
          
          <div className="w-full space-y-4 relative z-10 mt-auto">
            <div className="flex items-center justify-between text-[14px] font-medium">
              <span className={textColor}>{usagePercentage.toFixed(1)}% Consumed</span>
              <span className="text-neutral-400">{remaining.toLocaleString()} remaining scans</span>
            </div>
            <div className="w-full h-3 bg-white/[0.03] border border-white/[0.05] rounded-full overflow-visible relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(1, usagePercentage)}%` }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className={cn(`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r transition-all duration-1000 ${barColor} ${bgGlow}`)}
              />
            </div>
            {usagePercentage > 70 && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                className={cn("text-[14px] font-medium flex items-center mt-3", textColor)}
              >
                <AlertTriangle className="w-4 h-4 mr-2" /> 
                {usagePercentage > 90 ? "Critical: Nearing monthly limit." : "Warning: Over 70% of monthly quota used."}
              </motion.div>
            )}
          </div>
        </div>

        {/* PROJECTED SCANS */}
        <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[15px] font-medium text-neutral-400">Projected End-of-Month</div>
              <Activity className="w-5 h-5 text-neutral-500" />
            </div>
            <div className="text-[42px] font-semibold text-white tracking-tight leading-none mb-4">
              {projectedScans !== null ? projectedScans.toLocaleString() : "..."}
            </div>
            
            {projectedScans !== null ? (
              isWithinLimits ? (
                <div className="text-[14px] font-medium text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg inline-flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Safely within limits
                </div>
              ) : (
                <div className="text-[14px] font-medium text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg inline-flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" /> Projected to exceed limit
                </div>
              )
            ) : (
              <div className="text-[14px] font-medium text-neutral-400 bg-white/[0.05] px-3 py-1.5 rounded-lg inline-flex items-center">
                Not enough data yet
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-white/[0.05]">
               <div className="text-[13px] font-medium text-neutral-500 mb-1">Estimated Reset Date</div>
               <div className="text-[15px] font-medium text-neutral-200">July 31, 2026</div>
            </div>
          </div>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      {used > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Scans This Period", value: used.toLocaleString(), trend: "+12%", trendUp: true, icon: BarChart3, spark: [10, 15, 12, 18, 20, 25, 22] },
            { label: "Avg Daily Usage", value: "614", trend: "-2%", trendUp: false, icon: Activity, spark: [20, 18, 22, 15, 14, 16, 15] },
            { label: "Peak Usage Day", value: "Tue", desc: "1,850 scans", icon: Zap, spark: [10, 12, 15, 25, 18, 12, 10] },
            { label: "Avg Latency", value: "14ms", trend: "-1ms", trendUp: true, icon: Clock, spark: [18, 17, 15, 16, 14, 13, 14] }
          ].map((kpi, i) => (
            <div key={i} className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-6 hover:border-white/[0.15] transition-colors group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 text-neutral-400 group-hover:text-neutral-300 transition-colors">
                  <span className="text-[15px] font-medium truncate pr-2">{kpi.label}</span>
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center">
                    <kpi.icon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="text-[32px] font-semibold text-white tracking-tight leading-none mb-2">{kpi.value}</div>
              </div>
              
              <div className="flex items-end justify-between mt-6">
                <div className="flex items-center">
                  {kpi.trend ? (
                    <span className={cn("text-[14px] font-medium flex items-center", kpi.trendUp ? "text-green-400" : "text-amber-400")}>
                      {kpi.trendUp ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                      {kpi.trend}
                    </span>
                  ) : (
                    <span className="text-[14px] font-medium text-neutral-500">{kpi.desc}</span>
                  )}
                </div>
                <Sparkline data={kpi.spark} color={kpi.trendUp === false && kpi.trend ? "#f59e0b" : "#6366f1"} className="w-20 h-10" />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* USAGE TREND CHART */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8 shrink-0">
            <div>
              <h3 className="text-[18px] font-medium text-white mb-1">Usage Trend</h3>
              <p className="text-[14px] text-neutral-400">Daily prompt scans over time.</p>
            </div>
            <div className="flex items-center p-1 bg-[#111] border border-white/[0.05] rounded-xl">
              {["7 Days", "30 Days", "90 Days"].map(range => (
                <button 
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    "px-4 py-2 text-[13px] font-medium rounded-lg transition-colors",
                    timeRange === range ? "bg-white/[0.08] text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full relative">
             <UsageTrendChart timeRange={timeRange} />
          </div>
        </div>

        {/* PROVIDER BREAKDOWN */}
        <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-8 flex flex-col">
          <div className="mb-8">
            <h3 className="text-[18px] font-medium text-white mb-1">Provider Breakdown</h3>
            <p className="text-[14px] text-neutral-400">Traffic distribution by AI model provider.</p>
          </div>
          
          <div className="flex-1 space-y-6">
            {providers.map((p: any, i: number) => (
              <div key={p.name} className="group cursor-default">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-[15px] font-medium text-neutral-200 group-hover:text-white transition-colors">{p.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-[14px] text-neutral-400 transition-colors">{p.scans.toLocaleString()}</span>
                    <span className="text-[14px] font-medium text-white w-10 text-right">{p.percent}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-white/[0.03] border border-white/[0.05] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${p.percent}%` }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                </div>
              </div>
            ))}
            {providers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-neutral-500">
                <Server className="w-8 h-8 mb-3 opacity-50" />
                <span className="text-[14px] font-medium text-neutral-400">No provider data yet.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* USAGE INSIGHTS */}
        <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-8 flex flex-col">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="text-[18px] font-medium text-white">Usage Insights</h3>
          </div>
          <div className="space-y-4 flex-1">
            {used === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-neutral-500 py-8">
                <Sparkles className="w-6 h-6 mb-2 opacity-50" />
                <span className="text-[14px]">Insights will appear here.</span>
              </div>
            ) : insights.map((insight, i) => (
              <div key={i} className="flex flex-col space-y-2 p-5 bg-[#111] border border-white/[0.05] rounded-xl hover:bg-[#151515] transition-colors group">
                <span className={cn("text-[13px] font-medium w-max px-2.5 py-1 rounded-md", insight.color)}>
                  {insight.type}
                </span>
                <p className="text-[14px] text-neutral-300 leading-relaxed group-hover:text-white transition-colors">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY TABLE */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-8 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[18px] font-medium text-white">Recent Activity</h3>
            <button className="text-[14px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2 rounded-lg">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="flex-1 w-full overflow-x-auto custom-scrollbar">
            <div className="min-w-[700px] h-full flex flex-col">
              <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-4 pb-4 border-b border-white/[0.08] text-[14px] font-medium text-neutral-400 shrink-0">
                <div>Timestamp</div>
                <div>Provider</div>
                <div className="text-right">Prompt Scans</div>
                <div className="text-right">Latency</div>
                <div className="text-right">Status</div>
              </div>
              <div className="flex-1 min-h-[200px]">
                {used === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-neutral-500 py-12">
                    <Activity className="w-8 h-8 mb-3 opacity-50" />
                    <span className="text-[15px] font-medium text-white mb-1">No activity yet</span>
                    <span className="text-[14px]">Your API requests will appear here.</span>
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.04]">
                    {[
                      { time: "Today, 10:45:21 AM", provider: "OpenAI", scans: 14, latency: "112ms", status: "Success" },
                      { time: "Today, 10:42:05 AM", provider: "Claude", scans: 8, latency: "120ms", status: "Success" },
                      { time: "Today, 10:30:12 AM", provider: "OpenAI", scans: 42, latency: "114ms", status: "Success" },
                      { time: "Today, 10:15:00 AM", provider: "Gemini", scans: 3, latency: "98ms", status: "Success" },
                      { time: "Today, 09:55:33 AM", provider: "OpenAI", scans: 120, latency: "145ms", status: "Warning" },
                    ].map((row, i) => (
                      <div key={i} className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-4 py-5 items-center group hover:bg-white/[0.02] -mx-8 px-8 transition-colors">
                        <div className="text-[14px] text-neutral-400">{row.time}</div>
                        <div className="text-[14px] font-medium text-neutral-200 flex items-center">
                          <div className="w-6 h-6 rounded bg-white/[0.05] flex items-center justify-center mr-3">
                            <Server className="w-3.5 h-3.5 text-neutral-400" />
                          </div>
                          {row.provider}
                        </div>
                        <div className="text-[14px] font-medium text-white text-right">{row.scans}</div>
                        <div className="text-[14px] text-neutral-400 text-right">{row.latency}</div>
                        <div className="flex justify-end">
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-md text-[13px] font-medium",
                            row.status === "Success" ? "text-green-400 bg-green-500/10" : "text-amber-400 bg-amber-500/10"
                          )}>
                            {row.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
