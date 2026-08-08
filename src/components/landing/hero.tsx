"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CodeSnippet } from "@/components/landing/code-snippet";

export function Hero() {
  return (
    <section 
      className="relative w-full overflow-hidden flex flex-col items-center justify-center pt-[160px] pb-[64px] px-6"
      style={{
        background: `
          radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 70%), #000000
        `
      }}
    >
      <div className="z-10 flex flex-col items-center text-center w-full max-w-[1200px] mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[#EDEDED] font-medium text-[48px] md:text-[72px] leading-[1.05] tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        >
          Secure Every AI Request.<br />
          In Milliseconds.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="mt-[24px] max-w-[640px] text-[#888888] text-[16px] md:text-[20px] leading-[1.6]"
        >
          Drop-in API proxy that detects prompt injection, jailbreaks, and PII leakage before they reach your LLM. 2 lines of code. Under 50ms.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="mt-[40px] flex flex-col sm:flex-row items-center gap-[16px]"
        >
          <Link 
            href="/auth/sign-up"
            className="text-[16px] font-medium bg-[#FFFFFF] text-[#000000] px-[32px] py-[14px] rounded-[10px] hover:brightness-110 transition-all shadow-[0_0_0_1px_rgba(255,255,255,0.05)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.05)] whitespace-nowrap"
          >
            Get Free API Key &rarr;
          </Link>
          <Link 
            href="https://docs.krixaisecurity.com"
            className="text-[16px] font-medium text-[#FFFFFF] border border-[#27272A] px-[32px] py-[14px] rounded-[10px] hover:bg-white/[0.05] transition-colors whitespace-nowrap"
          >
            View Documentation
          </Link>
        </motion.div>

        {/* Bring code snippet inside so the purple glow covers it seamlessly */}
        <div className="w-full mt-[48px]">
          <CodeSnippet />
        </div>
      </div>
    </section>
  );
}
