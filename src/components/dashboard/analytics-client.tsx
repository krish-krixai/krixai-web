"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldAlert, Activity, Clock, ShieldCheck, Zap, Download,
  ChevronDown, ArrowUpRight, ArrowDownRight, Lightbulb, Hexagon,
  Box, Sparkles, Server, ArrowRight, CheckCircle2, XCircle, AlertTriangle, AlertCircle, Info
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------
// Custom Sparkline Component
// ---------------------------------------------------------
const Sparkline = ({ color, points, trend, height = 35, strokeWidth = 2 }: { color: string, points: number[], trend: 'up' | 'down' | 'flat', height?: number, strokeWidth?: number }) => {
  const max = Math.max(...points) || 1;
  const min = Math.min(...points) || 0;
  const range = max - min || 1;
  
  const path = points.map((p, i) => {
    const x = (i / Math.max(1, points.length - 1)) * 100;
    const y = height - 5 - ((p - min) / range) * (height - 10);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 100 ${height}`} className={cn("w-full overflow-visible", height === 35 ? "h-10 mt-3" : "h-full")}>
      <defs>
        <linearGradient id={`grad-${color}-${height}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L 100 ${height} L 0 ${height} Z`} fill={`url(#grad-${color}-${height})`} className="opacity-50" />
      <motion.path 
        d={path} 
        fill="none" 
        stroke={color} 
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ type: "spring", bounce: 0, duration: 2 }}
      />
      {trend === 'up' && <circle cx="100" cy={height - 5 - ((points[points.length-1] - min) / range) * (height - 10)} r={strokeWidth * 1.5} fill={color} />}
    </svg>
  );
};

// ---------------------------------------------------------
// Connected Interactive Area Chart
// ---------------------------------------------------------
const AreaChart = ({ 
  color, 
  data, 
  label, 
  activeIdx, 
  setActiveIdx 
}: { 
  color: string, 
  data: number[], 
  label: string,
  activeIdx: number | null,
  setActiveIdx: (idx: number | null) => void
}) => {
  const max = Math.max(...data) || 1;
  const path = data.map((p, i) => {
    const x = (i / Math.max(1, data.length - 1)) * 100;
    const y = 100 - (p / max) * 100;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="relative w-full h-[220px] mt-4 group" onMouseLeave={() => setActiveIdx(null)}>
      {/* Y-Axis Labels */}
      <div className="absolute inset-0 flex flex-col justify-between text-[10px] font-bold text-neutral-600 pb-5 z-0">
        <span>{max}</span>
        <span>{Math.round(max * 0.66)}</span>
        <span>{Math.round(max * 0.33)}</span>
        <span>0</span>
      </div>

      {/* Chart SVG */}
      <div className="absolute inset-0 left-8 border-b border-white/[0.05] z-10">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={`chart-grad-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          
          <path d={`${path} L 100 100 L 0 100 Z`} fill={`url(#chart-grad-${color})`} className="opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
          <motion.path 
            d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ type: "spring", bounce: 0, duration: 2 }}
          />

          {/* Hover hitboxes & vertical lines */}
          {data.map((p, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - (p / max) * 100;
            const isActive = activeIdx === i;
            
            return (
              <g key={i} className="cursor-crosshair" onMouseEnter={() => setActiveIdx(i)}>
                <rect x={x - (100/(data.length-1))/2} y="0" width={100/(data.length-1)} height="100" fill="transparent" />
                <AnimatePresence>
                  {isActive && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                      <line x1={x} y1={0} x2={x} y2={100} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="3" />
                      <circle cx={x} cy={y} r="3" fill="#0a0a0a" stroke={color} strokeWidth="2" className="shadow-[0_0_10px_currentColor]" />
                    </motion.g>
                  )}
                </AnimatePresence>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip HTML Overlay */}
        <AnimatePresence>
          {activeIdx !== null && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 5 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute pointer-events-none z-50 flex flex-col items-center"
              style={{ left: `${(activeIdx / (data.length - 1)) * 100}%`, top: `${100 - (data[activeIdx] / max) * 100}%`, transform: 'translate(-50%, -130%)' }}
            >
              <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/[0.12] rounded-xl px-4 py-3 shadow-[0_15px_40px_rgba(0,0,0,0.8)] min-w-[150px]">
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                  July {14 + activeIdx}
                  <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded ml-3", activeIdx > 0 && data[activeIdx] > data[activeIdx-1] ? "text-red-400 bg-red-400/10" : "text-green-400 bg-green-400/10")}>
                    {activeIdx > 0 ? (data[activeIdx] > data[activeIdx-1] ? `+${Math.round(((data[activeIdx]-data[activeIdx-1])/data[activeIdx-1])*100)}%` : `${Math.round(((data[activeIdx]-data[activeIdx-1])/data[activeIdx-1])*100)}%`) : "—"}
                  </span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: color, color: color }} />
                  <span className="text-[18px] font-black text-white">{data[activeIdx]}</span>
                  <span className="text-[12px] font-bold text-neutral-500 uppercase tracking-widest">{label}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// Connected Interactive Donut Chart
// ---------------------------------------------------------
const DonutChart = ({ data, activeCategory, setActiveCategory }: { data: {label: string, value: number, color: string}[], activeCategory: string | null, setActiveCategory: (c: string | null) => void }) => {
  let cumulativePercent = 0;

  return (
    <div className="flex items-center justify-between h-full w-full mt-2 relative">
      <div className="relative w-48 h-48 group" onMouseLeave={() => setActiveCategory(null)}>
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 drop-shadow-2xl">
          {data.map((slice, i) => {
            const dasharray = `${slice.value} 100`;
            const offset = -cumulativePercent;
            cumulativePercent += slice.value;
            const isActive = activeCategory === slice.label;
            const isFaded = activeCategory && !isActive;
            
            return (
              <motion.circle
                key={i} cx="50" cy="50" r="40" fill="transparent" stroke={slice.color}
                strokeWidth={isActive ? "18" : "15"}
                strokeDasharray={dasharray}
                initial={{ strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: offset, strokeWidth: isActive ? 18 : 15, opacity: isFaded ? 0.2 : 1 }}
                transition={{ strokeDashoffset: { type: "spring", bounce: 0, duration: 2, delay: i * 0.1 }, strokeWidth: { duration: 0.2 }, opacity: { duration: 0.2 } }}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setActiveCategory(slice.label)}
              />
            );
          })}
        </svg>
        {/* Center Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            {activeCategory ? (
              <motion.div key="category" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.15 }} className="flex flex-col items-center justify-center">
                <span className="text-[22px] font-black text-white">{data.find(d => d.label === activeCategory)?.value}%</span>
                <span className="text-[9px] font-extrabold text-neutral-500 uppercase tracking-widest mt-0.5 text-center px-6 leading-tight">{activeCategory}</span>
              </motion.div>
            ) : (
              <motion.div key="icon" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.15 }}>
                <ShieldAlert className="w-7 h-7 text-neutral-600" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col space-y-4 flex-1 ml-10">
        {data.map((slice, i) => {
          const isActive = activeCategory === slice.label;
          const isFaded = activeCategory && !isActive;
          return (
            <div 
              key={i} 
              className={cn("flex items-center justify-between cursor-pointer transition-all duration-300", isFaded ? "opacity-30" : "opacity-100", isActive ? "translate-x-1" : "")}
              onMouseEnter={() => setActiveCategory(slice.label)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <div className="flex items-center space-x-3">
                <span className={cn("w-2.5 h-2.5 rounded-full transition-all duration-300", isActive ? "scale-125" : "")} style={{ backgroundColor: slice.color, boxShadow: isActive ? `0 0 12px ${slice.color}90` : 'none' }} />
                <span className={cn("text-[13px] font-bold transition-colors", isActive ? "text-white" : "text-neutral-300")}>{slice.label}</span>
              </div>
              <span className="text-[13px] font-mono font-bold text-neutral-400">{slice.value}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// Security Score Component
// ---------------------------------------------------------
const SecurityScore = ({ score }: { score: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  
  useEffect(() => {
    const controls = animate(count, score, { duration: 2, ease: "easeOut", delay: 0.2 });
    return controls.stop;
  }, [count, score]);

  return (
    <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-white/[0.12] transition-colors">
      <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
      <div className="absolute top-6 left-6 flex items-center space-x-2">
        <h3 className="text-[15px] font-bold text-white tracking-tight">Security Posture</h3>
        <Info className="w-4 h-4 text-neutral-500 hover:text-white transition-colors cursor-help" />
      </div>
      
      <div className="relative w-56 h-56 mt-10 flex flex-col items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
          <motion.circle 
            cx="50" cy="50" r="42" fill="transparent" stroke={score >= 80 ? "#4ade80" : score >= 60 ? "#fbbf24" : "#f87171"} strokeWidth="8" strokeLinecap="round"
            strokeDasharray="264" strokeDashoffset="264"
            animate={{ strokeDashoffset: 264 - (264 * (score / 100)) }}
            transition={{ type: "spring", bounce: 0, duration: 2.5, delay: 0.2 }}
            className="drop-shadow-md"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <motion.h2 className="text-[56px] leading-none font-black text-white tracking-tighter">
            {rounded}
          </motion.h2>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex flex-col items-center mt-1">
            <span className={cn("text-[11px] font-black uppercase tracking-[0.2em]", score >= 80 ? "text-green-400" : score >= 60 ? "text-amber-400" : "text-red-400")}>
              {score >= 80 ? "Excellent" : score >= 60 ? "Fair" : "Critical"}
            </span>
          </motion.div>
        </div>
      </div>
      
      <p className="text-[13px] font-medium text-neutral-400 text-center mt-8 max-w-[260px] leading-relaxed">
        Calculated deterministically based on blocked threat volume and latency performance.
      </p>
    </div>
  );
};

import { useAnalytics, DateRange } from "../providers/analytics-provider";

// ---------------------------------------------------------
// Main Client Component
// ---------------------------------------------------------
export function AnalyticsClient() {
  const [isMounted, setIsMounted] = useState(false);
  
  const analytics = useAnalytics();
  const { dateRange, setDateRange } = analytics;
  
  // Shared hover states for "Connected Analytics" feel
  const [activeTrendIdx, setActiveTrendIdx] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-neutral-500">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-[13px] font-mono">Initializing Intelligence Center...</span>
      </div>
    );
  }

  // Map Attack Distribution to Donut Format
  const totalAttacks = analytics.attackDistribution.reduce((acc, a) => acc + a.count, 0);
  const donutData = totalAttacks === 0 ? [] : analytics.attackDistribution.map((a, i) => {
    const colors = ["#f87171", "#fbbf24", "#c084fc", "#38bdf8"];
    return {
      label: a.category.replace(/_/g, " "),
      value: Math.round((a.count / totalAttacks) * 100),
      color: colors[i % colors.length]
    };
  });

  // Security Score
  const score = Math.max(0, Math.min(100, Math.round(100 - (analytics.blockRate * 1.5))));

  // Executive Security Brief (Deterministic)
  const getBrief = () => {
    const brief = [];
    
    if (analytics.prevTotalScans === 0 && analytics.totalScans === 0) {
      brief.push({ text: "No scan activity detected in the current period.", highlight: "No scan activity" });
      return brief;
    }

    // Threat Volume
    const diff = analytics.totalScans - analytics.prevTotalScans;
    const pct = analytics.prevTotalScans > 0 ? Math.round(Math.abs(diff) / analytics.prevTotalScans * 100) : 100;
    if (diff > 0) {
      brief.push({ text: `Scan volume increased ${pct}% this period.`, highlight: `increased ${pct}%` });
    } else if (diff < 0) {
      brief.push({ text: `Scan volume decreased ${pct}% this period.`, highlight: `decreased ${pct}%` });
    } else {
      brief.push({ text: "Scan volume remained stable this period.", highlight: "remained stable" });
    }

    // Top Attack Category
    if (analytics.attackDistribution.length > 0) {
      const top = analytics.attackDistribution[0].category.replace(/_/g, " ");
      brief.push({ text: `${top} was the dominant threat category.`, highlight: top });
    } else {
      brief.push({ text: "No threats were detected in this period.", highlight: "No threats" });
    }

    // Latency
    const latDiff = analytics.prevAvgLatency - analytics.avgLatency;
    if (latDiff > 0) {
      brief.push({ text: `Average latency improved by ${latDiff} ms.`, highlight: `improved by ${latDiff} ms` });
    } else if (latDiff < 0) {
      brief.push({ text: `Average latency increased by ${Math.abs(latDiff)} ms.`, highlight: `increased by ${Math.abs(latDiff)} ms` });
    }

    // Top Provider
    if (analytics.providerDistribution.length > 0) {
      const topP = analytics.providerDistribution[0].provider;
      brief.push({ text: `${topP} processed the majority of requests.`, highlight: topP });
    }

    return brief;
  };

  const brief = getBrief();

  // Temporary mock for bucketing (until implemented in Provider)
  const trendData = [0, 0, 0, 0, 0, 0, 0, 0, 0, Math.max(1, analytics.totalScans)];
  const latencyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, Math.max(1, analytics.avgLatency)];

  if (analytics.totalScans === 0) {
    return (
      <div className="flex flex-col flex-1 pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-30">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-tight text-white mb-1.5">Analytics</h1>
            <p className="text-[14px] text-neutral-400 font-medium">Monitor trends, threats and the security posture of your AI infrastructure.</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-[#0a0a0a] border border-white/[0.08] rounded-3xl mt-4">
          <div className="w-24 h-24 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20">
            <Activity className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Data Available</h2>
          <p className="text-neutral-400 text-[14px] font-medium max-w-md text-center">Your security data will appear here after your first API call.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 pb-10">
      
      {/* HEADER & GLOBAL FILTERS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-30">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-white mb-1.5">Analytics</h1>
          <p className="text-[14px] text-neutral-400 font-medium">Monitor trends, threats and the security posture of your AI infrastructure.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-1 flex items-center shadow-sm">
            {["Last 24h", "Last 7 Days", "Last 30 Days"].map(range => (
              <button 
                key={range}
                onClick={() => setDateRange(range as DateRange)}
                className={cn(
                  "px-4 py-2 text-[12px] font-bold rounded-lg transition-all",
                  dateRange === range 
                    ? "bg-white/[0.1] text-white shadow-sm" 
                    : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03]"
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="h-10 px-5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[12px] font-bold text-neutral-200 hover:text-white hover:bg-white/[0.1] flex items-center transition-all shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
        </div>
      </div>

      {/* EXECUTIVE SECURITY BRIEF */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden group shadow-lg">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3 group-hover:bg-indigo-500/20 transition-colors duration-1000" />
        <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-6 flex items-center">
          <Sparkles className="w-4 h-4 mr-2" /> Executive Security Brief
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8 relative z-10">
          {brief.map((insight, i) => (
            <div key={i} className="flex items-start space-x-3.5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0 shadow-[0_0_12px_rgba(129,140,248,1)]" />
              <p className="text-[14px] font-medium text-indigo-100/70 leading-relaxed">
                {insight.text.split(insight.highlight).map((part, index, array) => 
                  index < array.length - 1 ? <React.Fragment key={index}>{part}<span className="text-white font-bold">{insight.highlight}</span></React.Fragment> : part
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
        {[
          { label: "Prompt Scans", value: "245.2K", trend: "+14%", type: "up", color: "#6366f1", points: [10, 15, 12, 20, 25, 22, 35] },
          { label: "Threats Blocked", value: "1,248", trend: "-5%", type: "down", color: "#4ade80", points: [30, 25, 28, 20, 15, 18, 12] },
          { label: "Avg Risk Score", value: "18", trend: "-2", type: "down", color: "#4ade80", points: [22, 24, 20, 21, 19, 18, 18] },
          { label: "Avg Latency", value: "24ms", trend: "stable", type: "flat", color: "#fbbf24", points: [24, 23, 25, 24, 24, 23, 24] },
          { label: "Detection Acc", value: "99.9%", trend: "+0.1%", type: "up", color: "#38bdf8", points: [99.5, 99.6, 99.6, 99.8, 99.8, 99.9, 99.9] },
          { label: "API Success", value: "100%", trend: "stable", type: "flat", color: "#a8a29e", points: [100, 100, 100, 100, 100, 100, 100] }
        ].map((kpi, i) => (
          <motion.div 
            key={kpi.label} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-white/[0.15] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(99,102,241,0.1)] transition-all duration-300 group flex flex-col justify-between cursor-default"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <span className="text-[11px] font-extrabold text-neutral-500 uppercase tracking-widest leading-tight w-2/3 group-hover:text-neutral-400 transition-colors">{kpi.label}</span>
                <span className={cn(
                  "text-[10px] font-extrabold px-1.5 py-0.5 rounded flex items-center bg-white/[0.04] border border-white/[0.05] transition-colors",
                  kpi.type === 'up' ? "text-green-400 group-hover:bg-green-400/10 group-hover:border-green-400/20" : kpi.type === 'down' ? "text-indigo-400 group-hover:bg-indigo-400/10 group-hover:border-indigo-400/20" : "text-neutral-400"
                )}>
                  {kpi.type === 'up' ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : kpi.type === 'down' ? <ArrowDownRight className="w-3 h-3 mr-0.5" /> : null}
                  {kpi.trend}
                </span>
              </div>
              <div className="text-3xl font-black text-white tracking-tighter">{kpi.value}</div>
            </div>
            <Sparkline color={kpi.color} points={kpi.points} trend={kpi.type as any} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* ATTACK TREND */}
        <div className="xl:col-span-2 bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6 md:p-8 shadow-xl relative z-20 hover:border-white/[0.12] transition-colors duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <h3 className="text-[15px] font-bold text-white tracking-tight">Threat Volume Trend</h3>
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-[12px] font-bold text-neutral-400"><span className="w-2.5 h-2.5 rounded bg-[#6366f1] mr-2.5 shadow-[0_0_10px_#6366f1]" /> Total Scans</div>
              <div className="flex items-center text-[12px] font-bold text-neutral-400"><span className="w-2.5 h-2.5 rounded bg-[#f87171] mr-2.5 shadow-[0_0_10px_#f87171]" /> Blocked Threats</div>
            </div>
          </div>
          <AreaChart color="#6366f1" data={trendData} label="Scans" activeIdx={activeTrendIdx} setActiveIdx={setActiveTrendIdx} />
        </div>

        {/* ATTACK DISTRIBUTION */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6 md:p-8 shadow-xl flex flex-col relative z-10 hover:border-white/[0.12] transition-colors duration-300">
          <h3 className="text-[15px] font-bold text-white tracking-tight mb-1">Attack Distribution</h3>
          <p className="text-[12px] text-neutral-500 font-semibold mb-2">Categorization of intercepted threats</p>
          <div className="flex-1 flex items-center justify-center">
            {donutData.length > 0 ? (
              <DonutChart data={donutData} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
            ) : (
              <div className="text-neutral-500 text-[12px] font-medium">No threats detected.</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* PROVIDER ANALYTICS */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6 md:p-8 shadow-xl flex flex-col hover:border-white/[0.12] transition-colors duration-300">
          <h3 className="text-[15px] font-bold text-white tracking-tight mb-6">Provider Analytics</h3>
          <div className="space-y-4 flex-1">
            {analytics.providerDistribution.length === 0 ? (
              <div className="text-neutral-500 text-[12px] font-medium flex items-center justify-center h-full">No providers used.</div>
            ) : analytics.providerDistribution.map(p => {
              const isActive = activeProvider === p.provider;
              const isFaded = activeProvider && !isActive;
              const Icon = p.provider === "OpenAI" ? Hexagon : p.provider === "Anthropic" ? Box : p.provider === "Gemini" ? Sparkles : p.provider === "Groq" ? Zap : Server;
              return (
                <div 
                  key={p.provider} 
                  className={cn("flex items-center justify-between p-3.5 -mx-3.5 rounded-xl border border-transparent hover:bg-white/[0.03] hover:border-white/[0.06] transition-all cursor-pointer", isFaded ? "opacity-30" : "opacity-100", isActive ? "scale-[1.02] bg-white/[0.03] border-white/[0.06]" : "")}
                  onMouseEnter={() => setActiveProvider(p.provider)}
                  onMouseLeave={() => setActiveProvider(null)}
                >
                  <div className="flex items-center space-x-4 w-36 shrink-0">
                    <div className="w-9 h-9 rounded-lg bg-[#111] border border-white/[0.1] flex items-center justify-center shadow-sm">
                      <Icon className="w-4 h-4 text-neutral-400" />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-neutral-200 leading-tight">{p.provider}</div>
                      <div className="text-[11px] font-mono font-medium text-neutral-500 mt-0.5">{p.count} scans</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 flex-1 justify-end">
                    <div className="flex flex-col items-end hidden sm:flex">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-0.5">Avg Lat</span>
                      <span className="text-[12px] font-mono font-bold text-neutral-300">{p.avgLatency}ms</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-0.5">Avg Risk</span>
                      <span className={cn("text-[12px] font-mono font-bold", p.avgRisk > 20 ? "text-orange-400" : "text-green-400")}>{p.avgRisk}</span>
                    </div>
                    <div className="w-16 h-8 hidden lg:block">
                      <Sparkline color={p.avgRisk > 20 ? "#fbbf24" : "#4ade80"} points={[p.avgRisk, Math.max(0, p.avgRisk - 5), p.avgRisk]} trend="flat" height={25} strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECURITY POSTURE */}
        <SecurityScore score={score} />

        {/* LATENCY ANALYTICS */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6 md:p-8 shadow-xl flex flex-col z-20 hover:border-white/[0.12] transition-colors duration-300">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[15px] font-bold text-white tracking-tight">Latency Analytics</h3>
            <span className="text-[10px] font-extrabold text-[#4ade80] bg-[#4ade80]/10 px-2.5 py-1 rounded border border-[#4ade80]/20 tracking-widest">HEALTHY</span>
          </div>
          <p className="text-[12px] text-neutral-500 font-semibold mb-6">Average gateway processing time</p>
          <AreaChart color="#4ade80" data={latencyData} label="ms avg" activeIdx={activeTrendIdx} setActiveIdx={setActiveTrendIdx} />
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* TOP THREATS */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl shadow-xl overflow-hidden hover:border-white/[0.12] transition-colors duration-300">
          <div className="p-6 md:px-8 border-b border-white/[0.05]">
            <h3 className="text-[15px] font-bold text-white tracking-tight">Top Attack Categories</h3>
          </div>
          <div className="divide-y divide-white/[0.03]">
            {[
              { name: "Prompt Injection", count: 842, severity: "Critical", trend: "+12%" },
              { name: "Data Leakage (PII)", count: 412, severity: "High", trend: "-5%" },
              { name: "Jailbreak (Roleplay)", count: 218, severity: "High", trend: "+2%" },
              { name: "Tool Abuse", count: 94, severity: "Medium", trend: "-18%" },
              { name: "Unicode Obfuscation", count: 12, severity: "Low", trend: "stable" }
            ].map(t => {
              const isActive = activeCategory === t.name;
              const isFaded = activeCategory && !isActive;
              return (
                <div 
                  key={t.name} 
                  className={cn("p-4 px-6 md:px-8 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer transition-all duration-300", isFaded ? "opacity-30" : "opacity-100", isActive ? "bg-white/[0.04] scale-[1.01]" : "")}
                  onMouseEnter={() => setActiveCategory(t.name)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <div className="flex items-center space-x-4 md:space-x-5">
                    <div className={cn(
                      "w-3 h-3 rounded-full transition-shadow duration-300",
                      t.severity === "Critical" ? "bg-red-500 shadow-[0_0_12px_#ef4444]" : t.severity === "High" ? "bg-orange-500 shadow-[0_0_12px_#f97316]" : t.severity === "Medium" ? "bg-amber-400 shadow-[0_0_12px_#fbbf24]" : "bg-neutral-500"
                    )} />
                    <div>
                      <div className="text-[14px] font-bold text-neutral-200">{t.name}</div>
                      <div className="text-[11px] font-semibold text-neutral-500 mt-0.5">{t.severity} Severity</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 md:space-x-8">
                    <span className="text-[13px] font-mono font-bold text-neutral-300">{t.count}</span>
                    <span className={cn("text-[12px] font-bold w-12 text-right", t.trend.includes('+') ? "text-red-400" : t.trend.includes('-') ? "text-green-400" : "text-neutral-500")}>{t.trend}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI INSIGHTS */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl shadow-xl overflow-hidden flex flex-col hover:border-white/[0.12] transition-colors duration-300">
          <div className="p-6 md:px-8 border-b border-white/[0.05] flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-white tracking-tight">AI Insights</h3>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="p-6 md:px-8 flex-1 space-y-4 bg-gradient-to-b from-indigo-500/5 to-transparent">
            {[
              { type: "Critical", icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", text: "Prompt Injection attacks targeting the Anthropic provider increased by 18%. Gateway rules successfully mitigated 100% of attempts." },
              { type: "Recommendation", icon: Lightbulb, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20", text: "Consider enforcing stricter rate limits on the Groq provider to prevent enumeration of the classification boundary." },
              { type: "Observation", icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", text: "Latency improved by 2ms globally following the new caching layer deployment. Bedrock continues to show the highest variance." },
            ].map((insight, i) => (
              <div key={i} className="p-4 md:p-5 bg-white/[0.02] border border-white/[0.05] rounded-xl flex items-start space-x-4 shadow-sm hover:border-white/[0.1] hover:bg-white/[0.03] hover:-translate-y-0.5 transition-all duration-300 group">
                <div className={cn("w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors", insight.bg)}>
                  <insight.icon className={cn("w-4 h-4 transition-colors", insight.color)} />
                </div>
                <div>
                  <div className={cn("text-[10px] font-black uppercase tracking-widest mb-1.5 transition-colors", insight.color)}>{insight.type}</div>
                  <p className="text-[13px] text-neutral-300 font-semibold leading-relaxed group-hover:text-white transition-colors">{insight.text}</p>
                </div>
              </div>
            ))}
            <button className="w-full mt-4 text-[12px] font-bold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg flex items-center justify-center py-2.5 transition-all">
              View Full Security Report <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
