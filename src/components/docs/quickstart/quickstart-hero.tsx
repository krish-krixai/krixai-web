import React from "react";
import { Clock } from "lucide-react";

export function QuickstartHero() {
  return (
    <div className="flex flex-col mb-16">
      <div className="inline-flex w-max items-center px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8">
        <span className="text-[12px] font-medium text-neutral-400 uppercase tracking-widest">Quick Start</span>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white leading-[1.2] mb-6">
        Protect your AI application in under 5 minutes.
      </h1>
      
      <p className="text-lg lg:text-[19px] text-neutral-400 max-w-2xl leading-[1.6] mb-8">
        Install the SDK, authenticate with your API key, scan prompts and forward only safe requests to your LLM.
      </p>

      <div className="flex items-center space-x-2 text-neutral-500">
        <Clock className="w-4 h-4" />
        <span className="text-[13px] font-medium tracking-wide">Estimated reading time: 5 minutes</span>
      </div>
    </div>
  );
}
