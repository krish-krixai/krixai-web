import React from "react";
import { Check } from "lucide-react";

export function SecurityPrinciples() {
  const principles = [
    { title: "Zero Trust", description: "Every prompt is treated as potentially malicious until verified." },
    { title: "Default Deny", description: "Strict boundaries block unauthorized actions by default." },
    { title: "Explainable Decisions", description: "Every block or warn action includes clear reasoning." },
    { title: "Low Latency", description: "Optimized rust engine adds minimal overhead to requests." },
    { title: "Privacy First", description: "Prompts are analyzed locally without storing sensitive data." },
    { title: "Model Independent", description: "Security applied before the LLM, protecting any backend model." },
    { title: "Enterprise Ready", description: "Scales to millions of requests with predictable performance." }
  ];

  return (
    <section className="relative w-full bg-black py-24 lg:py-32 overflow-hidden flex flex-col items-center border-t border-white/[0.04]">
      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left: Heading */}
        <div className="w-full lg:w-1/3 flex flex-col">
          <p className="text-[12px] text-neutral-500 mb-5 font-semibold uppercase tracking-[0.2em]">
            Security Principles
          </p>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white leading-[1.2] mb-6">
            Foundation of trust.
          </h2>
          <p className="text-[15px] text-neutral-400 leading-relaxed">
            krixai is built on core security principles designed to provide robust, scalable, and privacy-preserving protection for enterprise AI applications.
          </p>
        </div>

        {/* Right: List */}
        <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {principles.map((principle, i) => (
            <div key={i} className="flex items-start">
              <div className="mt-1 mr-4 shrink-0 w-6 h-6 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[15px] font-semibold text-white tracking-wide mb-1.5">
                  {principle.title}
                </h3>
                <p className="text-[14px] text-neutral-400 leading-relaxed">
                  {principle.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
