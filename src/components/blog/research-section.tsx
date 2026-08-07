"use client";

import React from "react";
import { FlaskConical, Lock } from "lucide-react";

export function ResearchSection() {
  return (
    <section className="w-full bg-[#050505] py-32 border-y border-white/[0.04] relative overflow-hidden flex flex-col items-center text-center">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(79,70,229,0.03),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10 flex flex-col items-center">
        
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-white/[0.02] border border-white/[0.05] rounded-3xl flex items-center justify-center backdrop-blur-xl">
            <FlaskConical className="w-8 h-8 text-neutral-400" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center backdrop-blur-md">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
          </div>
        </div>

        <span className="text-indigo-400 font-semibold text-[11px] tracking-[0.25em] uppercase mb-4 block">
          Threat Intelligence
        </span>
        
        <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-medium tracking-tight text-white mb-6">
          Latest Research
        </h2>
        
        <p className="text-neutral-400 text-[16px] sm:text-[18px] leading-[1.6] max-w-2xl mb-10">
          We are preparing to publish our comprehensive benchmark reports, zero-day threat analysis, and whitepapers on adversarial AI behavior.
        </p>

        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/[0.08]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
          </span>
          <span className="text-white text-[13px] font-medium tracking-wide">
            Coming Soon
          </span>
        </div>

      </div>
    </section>
  );
}
