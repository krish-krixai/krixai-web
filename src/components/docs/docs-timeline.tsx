import React from "react";
import { Key, Package, Zap, ShieldCheck, CheckCircle2, Cpu, ArrowRight } from "lucide-react";

export function DocsTimeline() {
  const steps = [
    {
      icon: Key,
      title: "Get API Key",
      description: "Generate a key from your dashboard."
    },
    {
      icon: Package,
      title: "Install SDK",
      description: "Available for Python, Node.js and Go."
    },
    {
      icon: Zap,
      title: "Initialize Client",
      description: "Connect your app to krixai."
    },
    {
      icon: ShieldCheck,
      title: "Scan Prompt",
      description: "Pass every user input through the API."
    },
    {
      icon: CheckCircle2,
      title: "Receive Decision",
      description: "Get ALLOW, WARN, or BLOCK."
    },
    {
      icon: Cpu,
      title: "Forward Safe Prompt",
      description: "Send clean requests to your LLM."
    }
  ];

  return (
    <section id="quick-start" className="relative w-full bg-black py-12 lg:py-16 overflow-hidden flex flex-col items-center">
      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full relative z-10 flex flex-col items-center">
        
        {/* Horizontal Timeline Container */}
        <div className="w-full overflow-x-auto pb-8 custom-scrollbar">
          <div className="min-w-[1000px] flex items-start justify-between relative px-4">
            
            {/* Connecting Line */}
            <div className="absolute top-[28px] left-10 right-10 h-[1px] bg-white/[0.08]" />

            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;
              return (
                <div key={index} className="flex flex-col items-center relative z-10 w-[160px]">
                  
                  {/* Icon Node */}
                  <div className="w-14 h-14 rounded-2xl bg-[#080808] border border-white/[0.1] shadow-xl flex items-center justify-center mb-6 group hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300">
                    <Icon className="w-6 h-6 text-neutral-400 group-hover:text-indigo-400 transition-colors" strokeWidth={1.5} />
                  </div>
                  
                  {/* Step Info */}
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5">
                      Step {index + 1}
                    </span>
                    <h3 className="text-[14px] font-semibold text-white tracking-wide mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[12px] text-neutral-400 leading-relaxed px-2">
                      {step.description}
                    </p>
                  </div>
                  
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
