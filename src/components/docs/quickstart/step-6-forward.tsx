import React from "react";
import { User, Shield, Cpu, ArrowRight } from "lucide-react";

export function Step6Forward() {
  return (
    <div id="step-6" className="flex flex-col pt-12 pb-16 border-t border-white/[0.08] scroll-mt-24">
      <h2 className="text-2xl font-semibold text-white mb-4">6. Forward Safe Requests</h2>
      <p className="text-[15px] text-neutral-400 leading-relaxed mb-8">
        Once krixai returns an ALLOW decision, you can safely forward the original prompt to your LLM provider. 
        Your architecture now has a robust security layer sitting in front of your models.
      </p>

      {/* Visual Architecture */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between p-8 rounded-xl bg-[#050505] border border-white/[0.1] shadow-xl gap-6">
        
        {/* User */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.1] flex items-center justify-center mb-3">
            <User className="w-5 h-5 text-neutral-400" />
          </div>
          <span className="text-[12px] font-medium text-neutral-300">User App</span>
        </div>

        <ArrowRight className="w-5 h-5 text-white/[0.1] rotate-90 md:rotate-0" />

        {/* krixai */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)] flex items-center justify-center mb-3">
            <Shield className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="text-[12px] font-bold text-indigo-400 tracking-wide">krixai Firewall</span>
        </div>

        <ArrowRight className="w-5 h-5 text-emerald-500/30 rotate-90 md:rotate-0" />

        {/* LLM */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.1] flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5 text-neutral-400" />
          </div>
          <span className="text-[12px] font-medium text-neutral-300">OpenAI / LLM</span>
        </div>

      </div>
    </div>
  );
}
