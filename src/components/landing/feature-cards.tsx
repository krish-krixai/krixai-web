"use client";

import React from "react";
import { Shield, Lock, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    iconColor: "#8B5CF6", // Amethyst
    title: "Prompt Injection Detection",
    description: "Catches direct attacks, indirect injection via RAG documents, and multi-turn manipulation — in real-time, before the request reaches your model."
  },
  {
    icon: Lock,
    iconColor: "#06B6D4", // Cyan
    title: "PII & Data Leakage Protection",
    description: "Scans inputs and outputs for credit cards, SSNs, emails, API keys, and custom sensitive patterns. Block or redact automatically."
  },
  {
    icon: Zap,
    iconColor: "#EAB308", // Sand/Gold
    title: "Under 50ms. Always.",
    description: "Your users won't notice us. Lightweight ONNX-based detection adds virtually zero latency to your AI pipeline. No cold starts, no queues."
  }
];

export function FeatureCards() {
  return (
    <section className="w-full max-w-[1200px] mx-auto mt-[120px] px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-[16px] p-[32px] transition-all duration-300 hover:border-[#8B5CF6] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.05)] hover:-translate-y-[4px] group"
            >
              <div className="relative w-[48px] h-[48px] rounded-[10px] flex items-center justify-center mb-[24px] bg-[#000000] border border-[#27272A] shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden group-hover:border-[#333333] transition-colors">
                {/* Subtle colored glow behind icon */}
                <div 
                  className="absolute inset-0 opacity-20 blur-[12px] group-hover:opacity-40 transition-opacity duration-300"
                  style={{ backgroundColor: feature.iconColor }}
                />
                {/* Top edge highlight */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />
                
                <Icon 
                  size={20} 
                  color={feature.iconColor} 
                  strokeWidth={1.5} 
                  className="relative z-10"
                  style={{ filter: `drop-shadow(0 0 8px ${feature.iconColor}40)` }}
                />
              </div>
              <h3 className="text-[#FFFFFF] text-[20px] md:text-[24px] font-medium leading-[1.3] mb-[12px]">
                {feature.title}
              </h3>
              <p className="text-[#888888] text-[16px] leading-[1.6]">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
