"use client";
import React from "react";
import { ShieldCheck, ShieldAlert, Activity, Zap } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAnalytics } from "../providers/analytics-provider";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function MetricCards() {
  const analytics = useAnalytics();

  const getTrendStr = (current: number, prev: number) => {
    if (prev === 0 && current === 0) return "stable";
    if (prev === 0) return "+100%";
    const diff = current - prev;
    const pct = (diff / prev) * 100;
    if (pct === 0) return "stable";
    return `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`;
  };

  const isTrendPositive = (current: number, prev: number, lowerIsBetter: boolean) => {
    if (prev === 0 && current === 0) return true;
    if (prev === 0) return !lowerIsBetter;
    const diff = current - prev;
    return lowerIsBetter ? diff <= 0 : diff >= 0;
  };

  const metrics = [
    { 
      label: "Protected Requests", 
      value: analytics.totalScans.toLocaleString(), 
      trend: getTrendStr(analytics.totalScans, analytics.prevTotalScans), 
      isPositive: isTrendPositive(analytics.totalScans, analytics.prevTotalScans, false), 
      icon: ShieldCheck, color: "text-neutral-400"
    },
    { 
      label: "Threats Blocked", 
      value: analytics.threatsBlocked.toLocaleString(), 
      trend: getTrendStr(analytics.threatsBlocked, analytics.prevThreatsBlocked), 
      isPositive: isTrendPositive(analytics.threatsBlocked, analytics.prevThreatsBlocked, true), 
      icon: ShieldAlert, color: "text-neutral-400" 
    },
    { 
      label: "API Latency", 
      value: `${analytics.avgLatency} ms`, 
      trend: getTrendStr(analytics.avgLatency, analytics.prevAvgLatency), 
      isPositive: isTrendPositive(analytics.avgLatency, analytics.prevAvgLatency, true), 
      icon: Activity, color: "text-neutral-400" 
    },
    { 
      label: "Block Rate", 
      value: `${analytics.blockRate.toFixed(1)}%`, 
      trend: getTrendStr(analytics.blockRate, analytics.prevBlockRate), 
      isPositive: isTrendPositive(analytics.blockRate, analytics.prevBlockRate, true), 
      icon: Zap, color: "text-neutral-400" 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.label}
            className="group relative p-6 rounded-xl border border-white/[0.08] bg-[#0A0A0A] flex flex-col justify-between h-[160px]"
          >
            <div className="flex items-center justify-between z-10 relative mb-4">
              <span className="text-[15px] font-medium text-neutral-400">{metric.label}</span>
              <div className="p-2 rounded-md bg-white/[0.03] border border-white/[0.05]">
                <Icon className={cn("w-4 h-4", metric.color)} strokeWidth={2} />
              </div>
            </div>
            
            <div className="z-10 flex flex-col justify-end relative">
              <h3 className="text-4xl font-semibold text-white tracking-tight leading-none mb-3">{metric.value}</h3>
              <div className="flex items-center space-x-2">
                <span className={cn(
                  "text-[13px] font-medium px-2 py-0.5 rounded-full",
                  metric.isPositive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                )}>
                  {metric.trend}
                </span>
                <span className="text-[13px] text-neutral-500 font-medium">vs last 7 days</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
