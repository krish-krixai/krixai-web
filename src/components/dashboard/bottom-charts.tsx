"use client";
import React from "react";
import { motion } from "framer-motion";
import { useAnalytics } from "../providers/analytics-provider";

export function BottomCharts() {
  const { currentEvents, attackDistribution, dateRange } = useAnalytics();

  // Simple 7-bucket aggregation
  const buckets = Array(7).fill(0);
  if (currentEvents.length > 0) {
    const minTime = Math.min(...currentEvents.map(e => new Date(e.created_at).getTime()));
    const maxTime = Math.max(...currentEvents.map(e => new Date(e.created_at).getTime()));
    const range = (maxTime - minTime) || 1;
    currentEvents.forEach(e => {
      const time = new Date(e.created_at).getTime();
      let idx = Math.floor(((time - minTime) / range) * 7);
      if (idx === 7) idx = 6;
      buckets[idx]++;
    });
  }
  const maxBucket = Math.max(...buckets) || 1;
  const barData = buckets.map(b => (b / maxBucket) * 100);

  // Map attack distribution
  const totalAttacks = attackDistribution.reduce((acc, a) => acc + a.count, 0);
  const colors = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500"];
  const glows = ["shadow-[0_0_12px_rgba(239,68,68,0.4)]", "shadow-[0_0_12px_rgba(249,115,22,0.4)]", "shadow-[0_0_12px_rgba(245,158,11,0.4)]", "shadow-[0_0_12px_rgba(234,179,8,0.4)]"];
  
  const threats = attackDistribution.slice(0, 4).map((a, i) => ({
    label: a.category.replace(/_/g, " "),
    value: Math.round((a.count / totalAttacks) * 100),
    color: colors[i % colors.length],
    glow: glows[i % glows.length]
  }));
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Usage Overview (Simulated Bar Chart) */}
      <div className="p-6 rounded-2xl border border-white/[0.05] bg-[#060606] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-[15px] font-semibold text-white tracking-wide">Requests Over Time</h3>
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest bg-white/[0.02] px-2.5 py-1 rounded-md border border-white/[0.04]">{dateRange}</span>
        </div>
        
        {/* Background Grid Lines */}
        <div className="relative h-56 flex items-end justify-between space-x-4 group">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-b border-white/[0.02]">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="w-full h-px bg-white/[0.015]" />
            ))}
          </div>
          
          {barData.map((val, i) => (
            <div key={i} className="w-full h-full relative group/bar flex items-end">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${val}%` }}
                transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full bg-indigo-500/80 rounded-t-lg transition-all duration-300 group-hover/bar:bg-indigo-400 group-hover/bar:shadow-[0_0_20px_rgba(99,102,241,0.4)] z-10" 
              >
                {/* Premium Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#111] border border-white/[0.08] px-3 py-1.5 rounded-lg shadow-xl text-[11px] font-bold text-white opacity-0 group-hover/bar:opacity-100 group-hover/bar:-translate-y-2 transition-all duration-300 whitespace-nowrap pointer-events-none z-20">
                  {buckets[i].toLocaleString()} Req
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111] border-b border-r border-white/[0.08] rotate-45" />
                </div>
              </motion.div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-5 text-[11px] text-neutral-500 font-bold uppercase tracking-widest px-2">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>

      {/* Threat Distribution (Simulated Horizontal Bar Chart) */}
      <div className="p-6 rounded-2xl border border-white/[0.05] bg-[#060606] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-[15px] font-semibold text-white tracking-wide">Threat Distribution</h3>
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest bg-white/[0.02] px-2.5 py-1 rounded-md border border-white/[0.04]">{dateRange}</span>
        </div>
        <div className="space-y-7">
          {threats.length === 0 ? (
            <div className="text-neutral-500 text-[12px] font-medium h-full flex items-center justify-center pt-10">No threats detected in this period.</div>
          ) : threats.map((item, i) => (
            <div key={i} className="space-y-2.5 group cursor-default">
              <div className="flex justify-between text-[13px] font-semibold">
                <span className="text-neutral-400 group-hover:text-white transition-colors tracking-wide">{item.label}</span>
                <span className="text-neutral-300 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.04]">{item.value}%</span>
              </div>
              <div className="h-2.5 w-full bg-white/[0.02] rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1.2, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-full ${item.color} rounded-full transition-all group-hover:${item.glow}`} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
