"use client";
import React from "react";
import { Activity, Server, Database, ArrowUpRight } from "lucide-react";

export function RightSidebar() {
  return (
    <div className="w-full xl:w-[340px] space-y-6 shrink-0">
      
      {/* System Status */}
      <div className="p-6 rounded-xl border border-white/[0.08] bg-[#0A0A0A]">
        <h3 className="text-[15px] font-semibold text-white mb-6">System Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between group cursor-default">
            <div className="flex items-center space-x-3 text-[14px]">
              <Server className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
              <span className="text-neutral-300 font-medium group-hover:text-white transition-colors">API Gateway</span>
            </div>
            <span className="text-[13px] text-green-400 font-medium tracking-wide px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">Operational</span>
          </div>
          <div className="flex items-center justify-between group cursor-default">
            <div className="flex items-center space-x-3 text-[14px]">
              <Database className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
              <span className="text-neutral-300 font-medium group-hover:text-white transition-colors">Edge Nodes</span>
            </div>
            <span className="text-[13px] text-green-400 font-medium tracking-wide px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">Operational</span>
          </div>
          <div className="flex items-center justify-between group cursor-default">
            <div className="flex items-center space-x-3 text-[14px]">
              <Activity className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
              <span className="text-neutral-300 font-medium group-hover:text-white transition-colors">Firewall Engine</span>
            </div>
            <span className="text-[13px] text-green-400 font-medium tracking-wide px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">Operational</span>
          </div>
        </div>
      </div>

      {/* Latest Alerts */}
      <div className="p-6 rounded-xl border border-white/[0.08] bg-[#0A0A0A]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[15px] font-semibold text-white">Latest Alerts</h3>
          <button className="text-[13px] font-medium text-neutral-400 hover:text-white transition-colors flex items-center">
            View All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
        <div className="space-y-6">
          <div className="flex items-start space-x-4 relative before:absolute before:left-[3.5px] before:top-4 before:bottom-[-28px] before:w-px before:bg-white/[0.08] last:before:hidden group cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0 z-10" />
            <div>
              <p className="text-[14px] text-white font-medium group-hover:text-neutral-200 transition-colors">Jailbreak Spike</p>
              <p className="text-[13px] text-neutral-400 mt-1 leading-relaxed">Detected a 40% increase in jailbreak attempts from region US-East.</p>
              <p className="text-[12px] text-neutral-500 mt-1.5 font-medium">35m ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 relative before:absolute before:left-[3.5px] before:top-4 before:bottom-[-28px] before:w-px before:bg-white/[0.08] last:before:hidden group cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-neutral-300 mt-1.5 shrink-0 z-10" />
            <div>
              <p className="text-[14px] text-white font-medium group-hover:text-neutral-200 transition-colors">Policy Activated</p>
              <p className="text-[13px] text-neutral-400 mt-1 leading-relaxed">"Strict PII Redaction" policy is now enforcing across all endpoints.</p>
              <p className="text-[12px] text-neutral-500 mt-1.5 font-medium">2h ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
