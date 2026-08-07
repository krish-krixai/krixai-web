import React from "react";
import { Shield, Layers, Network, Zap } from "lucide-react";

export function SecurityFeatures() {
  const features = [
    {
      icon: Shield,
      title: "Runtime Protection",
      description: "Protect prompts before inference."
    },
    {
      icon: Layers,
      title: "Layered Detection",
      description: "Multiple security engines working together."
    },
    {
      icon: Network,
      title: "Model Agnostic",
      description: "Works with OpenAI, Anthropic, Gemini, Groq, OpenRouter and self-hosted models."
    },
    {
      icon: Zap,
      title: "Low Latency",
      description: "Security in milliseconds without slowing applications."
    }
  ];

  return (
    <section className="relative w-full bg-black py-24 lg:py-32 overflow-hidden flex flex-col items-center border-t border-white/[0.04]">
      <div className="absolute inset-0 bg-[#020202] pointer-events-none" />
      
      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full relative z-10 flex flex-col items-center">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-20">
          <p className="text-[12px] text-neutral-500 mb-5 font-semibold uppercase tracking-[0.2em]">
            Why Krixai
          </p>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white text-balance leading-[1.1]">
            Enterprise-grade security infrastructure.
          </h2>
        </div>

        {/* Feature Grid (2x2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div 
                key={i}
                className="group relative flex flex-col p-8 lg:p-10 rounded-[24px] bg-[#050505] border border-white/[0.05] hover:bg-[#080808] hover:border-white/[0.1] transition-all duration-300 ease-out"
              >
                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-white/[0.03] border border-white/[0.08] group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all duration-300 ease-out shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <Icon className="w-5 h-5 text-neutral-400 group-hover:text-indigo-400 transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <h3 className="text-[19px] font-semibold text-white tracking-wide mb-3">
                  {feature.title}
                </h3>
                <p className="text-[15px] text-neutral-400 leading-relaxed max-w-[320px]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
