"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    num: "1",
    title: "Point Your Native SDK to Krixai",
    description: "Change your base_url to api.krixaisecurity.com. Works natively with OpenAI, Anthropic, and Gemini SDKs."
  },
  {
    num: "2",
    title: "We Scan Every Request & Response",
    description: "Prompt injection, jailbreaks, PII, custom rules — checked in under 50ms. Clean requests pass through instantly."
  },
  {
    num: "3",
    title: "Threats Blocked. Traffic Flows.",
    description: "Malicious requests are blocked before they reach your LLM. Every event is logged for your audit trail."
  }
];

export function HowItWorks() {
  return (
    <section className="w-full max-w-[1200px] mx-auto mt-[120px] px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, type: "spring", bounce: 0, ease: "easeOut" }}
      >
        <h2 className="text-[#FFFFFF] text-[32px] md:text-[48px] font-medium leading-[1.1] tracking-tighter">
          How It Works
        </h2>
        <p className="text-[#888888] text-[16px] md:text-[20px] mt-[16px]">
          Three steps. Five minutes. Full protection.
        </p>
      </motion.div>

      <div className="relative mt-[64px]">
        {/* Horizontal dashed line (Desktop only) */}
        <div className="hidden md:block absolute top-[24px] left-[10%] right-[10%] border-t-[2px] border-dashed border-[#1A1A1A] z-0" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[40px] md:gap-[24px] relative z-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              {/* Number Circle */}
              <div className="w-[48px] h-[48px] rounded-full bg-[#FFFFFF] text-[#000000] font-medium text-[20px] flex items-center justify-center mb-[24px] shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
                {step.num}
              </div>
              
              <h3 className="text-[#FFFFFF] text-[20px] md:text-[24px] font-medium leading-[1.3] mb-[12px]">
                {step.title}
              </h3>
              <p className="text-[#888888] text-[16px] leading-[1.6] max-w-[320px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
