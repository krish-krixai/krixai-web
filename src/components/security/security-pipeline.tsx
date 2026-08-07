"use client";

import React from "react";
import { motion } from "framer-motion";
import { Terminal, FileText, Shield, Activity, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";

export function SecurityPipeline() {
  const steps = [
    { icon: Terminal, title: "User Prompt" },
    { icon: FileText, title: "Normalization" },
    { icon: Shield, title: "Threat Detection" },
    { icon: Activity, title: "Risk Score" },
    { icon: AlertCircle, title: "Policy Engine" },
  ];

  return (
    <section className="relative w-full bg-black py-24 lg:py-32 overflow-hidden flex flex-col items-center border-t border-white/[0.04]">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[#020202] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[200px] bg-indigo-500/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full relative z-10 flex flex-col items-center">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-24">
          <p className="text-[12px] text-neutral-500 mb-5 font-semibold uppercase tracking-[0.2em]">
            How Requests Flow
          </p>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white text-balance leading-[1.1]">
            Real-time inspection pipeline.
          </h2>
        </div>

        {/* Pipeline Container - Horizontal scrolling on mobile */}
        <div className="w-full overflow-x-auto pb-12 custom-scrollbar">
          <div className="min-w-[900px] relative flex flex-col items-center pt-8">
            
            {/* The Main Line */}
            <div className="absolute top-[38px] left-[10%] right-[10%] h-[2px] bg-white/[0.05]" />

            {/* The Animated Packets */}
            {/* Safe Packet */}
            <motion.div
              className="absolute top-[36px] w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_12px_3px_rgba(99,102,241,0.6)] z-20"
              animate={{ 
                left: ["5%", "95%"],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.1, 0.9, 1]
              }}
            />

            {/* Blocked Packet */}
            <motion.div
              className="absolute top-[36px] w-2 h-2 bg-red-500 rounded-full shadow-[0_0_12px_3px_rgba(239,68,68,0.6)] z-20"
              animate={{ 
                left: ["5%", "75%"],
                top: ["36px", "36px", "36px", "110px"],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.1, 0.6, 0.8],
                delay: 2
              }}
            />

            {/* Steps Row */}
            <div className="relative z-10 w-full flex justify-between px-8">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex flex-col items-center relative">
                    <div className="w-12 h-12 rounded-xl bg-[#080808] border border-white/[0.1] flex items-center justify-center mb-4 shadow-xl">
                      <Icon className="w-5 h-5 text-neutral-400" />
                    </div>
                    <span className="text-[12px] font-medium text-neutral-300 tracking-wide text-center max-w-[100px]">
                      {step.title}
                    </span>
                  </div>
                );
              })}

              {/* End Node (Safe) */}
              <div className="flex flex-col items-center relative">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-[12px] font-bold text-indigo-400 tracking-wide text-center">
                  Safe Request
                </span>
              </div>
            </div>

            {/* Blocked Branch */}
            <div className="absolute top-[38px] left-[76%] w-[2px] h-[72px] bg-red-500/20" />
            <div className="absolute top-[110px] left-[76%] -translate-x-1/2 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                <ShieldAlert className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-[12px] font-bold text-red-400 tracking-wide text-center">
                Blocked
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
