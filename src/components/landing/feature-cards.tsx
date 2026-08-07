"use client";

import React from "react";
import { Shield, Lock, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    iconColor: "#FFFFFF",
    iconBg: "rgba(255,255,255,0.05)",
    title: "Prompt Injection Detection",
    description: "Catches direct attacks, indirect injection via RAG documents, and multi-turn manipulation — in real-time, before the request reaches your model."
  },
  {
    icon: Lock,
    iconColor: "#10B981",
    iconBg: "rgba(16,185,129,0.1)",
    title: "PII & Data Leakage Protection",
    description: "Scans inputs and outputs for credit cards, SSNs, emails, API keys, and custom sensitive patterns. Block or redact automatically."
  },
  {
    icon: Zap,
    iconColor: "#F59E0B",
    iconBg: "rgba(245,158,11,0.1)",
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className="bg-[#111827] border border-white/[0.06] rounded-[16px] p-[32px] transition-all duration-300 hover:border-[rgba(255,255,255,0.15)] hover:shadow-[0_4px_14px_rgba(255,255,255,0.1)] hover:-translate-y-[4px] group"
            >
              <div 
                className="w-[64px] h-[64px] rounded-[12px] flex items-center justify-center mb-[24px]"
                style={{ backgroundColor: feature.iconBg }}
              >
                <Icon size={32} color={feature.iconColor} strokeWidth={1.5} />
              </div>
              <h3 className="text-[#FFFFFF] text-[18px] md:text-[22px] font-semibold leading-[1.3] mb-[12px]">
                {feature.title}
              </h3>
              <p className="text-[#A1A1AA] text-[16px] leading-[1.6]">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
