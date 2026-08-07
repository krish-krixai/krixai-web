"use client";

import React from "react";
import { ShieldAlert, Database, Network } from "lucide-react";
import { motion } from "framer-motion";

export function Features() {
  const evaluateFeatures = [
    {
      icon: ShieldAlert,
      title: "Prompt injection defense",
      description: "Identify instruction override, jailbreak, and prompt-extraction patterns.",
      bg: "bg-[#08111F]",
      iconColor: "text-[#3B82F6]"
    },
    {
      icon: Database,
      title: "Sensitive data detection",
      description: "Identify potential secrets and personally identifiable information in routed requests.",
      bg: "bg-[#05070A]",
      iconColor: "text-[#F59E0B]"
    },
    {
      icon: Network,
      title: "Policy-based decisions",
      description: "Apply configured workspace controls to reliably allow, warn, or block a request.",
      bg: "bg-[#0A0D12]",
      iconColor: "text-[#10B981]"
    },
  ];

  return (
    <section id="product" className="relative w-full bg-[#05070A] py-20 lg:py-32 overflow-hidden flex flex-col items-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
        
        {/* Left Column: Sticky Intro */}
        <div className="w-full lg:w-[40%] flex flex-col sticky top-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[12px] text-neutral-500 mb-6 font-medium uppercase tracking-[0.25em]">
              RUNTIME SECURITY CONTROLS
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-medium tracking-tight text-white leading-[1.15] mb-6">
              What krixai evaluates
            </h2>
            <p className="text-[17px] text-neutral-400 leading-[1.6] font-normal">
              Screen AI requests before they reach your model. Detect risky inputs, apply your policies, and keep a clear record of every security decision.
            </p>
          </motion.div>
        </div>

        {/* Right Column: Stacked Rows */}
        <div className="w-full lg:w-[60%] flex flex-col gap-6">
          {evaluateFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 p-8 rounded-[24px] border border-white/[0.04] ${feature.bg} shadow-lg`}
              >
                <div className={`shrink-0 w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center shadow-inner`}>
                  <Icon className={`w-6 h-6 ${feature.iconColor}`} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold tracking-wide text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[15px] text-neutral-400 leading-[1.6] font-normal">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
