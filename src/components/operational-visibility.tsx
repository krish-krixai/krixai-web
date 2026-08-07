"use client";

import React from "react";
import { Radar, Network, Key } from "lucide-react";
import { motion } from "framer-motion";

export function OperationalVisibility() {
  const capabilities = [
    {
      icon: Radar,
      title: "Security decision logs",
      description: "Review a complete record of scanned requests, evaluated risk scores, detected threat categories, and the enforced policy outcome for your workspace.",
    },
    {
      icon: Network,
      title: "Workspace policies",
      description: "Define and manage the active security controls that govern how incoming requests are evaluated before they reach the model.",
    },
    {
      icon: Key,
      title: "API key and usage controls",
      description: "Manage programmatic access to the krixai evaluation engine and monitor scanned request volume for your workspace.",
    },
  ];

  return (
    <section className="relative w-full bg-[#0A0D12] py-20 lg:py-32 overflow-hidden flex flex-col items-center">
      {/* Subtle blue edge lighting at the top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col items-center">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20"
        >
          <p className="text-[12px] text-neutral-500 mb-6 font-medium uppercase tracking-[0.25em]">
            OPERATIONAL VISIBILITY
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-neutral-50 text-balance leading-[1.15]">
            Decisions you can investigate
          </h2>
        </motion.div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 w-full">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start border-t border-white/[0.04] pt-8"
              >
                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#08111F] border border-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.05)]">
                  <Icon className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold tracking-wide text-white mb-3">
                  {capability.title}
                </h3>
                <p className="text-[15px] text-neutral-400 leading-[1.6] font-normal">
                  {capability.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
