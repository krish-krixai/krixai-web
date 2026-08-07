import React from "react";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { PromptInjectionVis, RuntimeFirewallVis, AgentGraphVis } from "./visuals";

export function ResearchCollections() {
  return (
    <section className="w-full max-w-[85rem] mx-auto px-6 lg:px-12 mt-16 mb-24 relative z-10">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-[14px] font-bold tracking-[0.2em] uppercase text-white">Featured Collections</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/[0.08] to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Collection 1: Prompt Injection */}
        <Link href="/research/category/threat-intelligence" className="group flex flex-col h-full bg-[#161616] border border-white/[0.04] rounded-xl overflow-hidden hover:border-white/[0.1] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300">
          <div className="w-full h-[140px] bg-[#050505] border-b border-white/[0.04] relative flex items-center justify-center overflow-hidden">
            <PromptInjectionVis className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-neutral-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Collection</span>
            </div>
            <h3 className="text-white font-medium text-[18px] mb-2 group-hover:text-neutral-200 transition-colors">
              Prompt Injection Defense
            </h3>
            <p className="text-neutral-400 text-[13px] leading-[1.6] line-clamp-2 mb-6">
              Engineering research on intercepting and neutralizing advanced prompt extraction and jailbreak attempts.
            </p>
            <div className="mt-auto pt-4 border-t border-white/[0.04] flex items-center justify-between text-[12px] font-medium text-white">
              <span>View Collection</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Collection 2: Runtime Firewall */}
        <Link href="/research/category/runtime-security" className="group flex flex-col h-full bg-[#161616] border border-white/[0.04] rounded-xl overflow-hidden hover:border-white/[0.1] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300">
          <div className="w-full h-[140px] bg-[#050505] border-b border-white/[0.04] relative flex items-center justify-center overflow-hidden">
            <RuntimeFirewallVis className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-neutral-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Collection</span>
            </div>
            <h3 className="text-white font-medium text-[18px] mb-2 group-hover:text-neutral-200 transition-colors">
              Runtime Firewall
            </h3>
            <p className="text-neutral-400 text-[13px] leading-[1.6] line-clamp-2 mb-6">
              Architectural deep dives into building low-latency, high-accuracy inference gateways.
            </p>
            <div className="mt-auto pt-4 border-t border-white/[0.04] flex items-center justify-between text-[12px] font-medium text-white">
              <span>View Collection</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Collection 3: Agent Security */}
        <Link href="/research/category/research" className="group flex flex-col h-full bg-[#161616] border border-white/[0.04] rounded-xl overflow-hidden hover:border-white/[0.1] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300">
          <div className="w-full h-[140px] bg-[#050505] border-b border-white/[0.04] relative flex items-center justify-center overflow-hidden">
            <AgentGraphVis className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-neutral-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Collection</span>
            </div>
            <h3 className="text-white font-medium text-[18px] mb-2 group-hover:text-neutral-200 transition-colors">
              Agent Security
            </h3>
            <p className="text-neutral-400 text-[13px] leading-[1.6] line-clamp-2 mb-6">
              Securing autonomous AI agents from unauthorized tool execution and lateral movement.
            </p>
            <div className="mt-auto pt-4 border-t border-white/[0.04] flex items-center justify-between text-[12px] font-medium text-white">
              <span>View Collection</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

      </div>
    </section>
  );
}
