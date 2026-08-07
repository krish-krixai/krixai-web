"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section 
      className="relative w-full overflow-hidden flex flex-col items-center justify-center pt-[160px] pb-[64px] px-6"
      style={{
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 80%, rgba(255, 255, 255, 0.01) 0%, transparent 50%),
          #0A0E1A
        `
      }}
    >
      <div className="z-10 flex flex-col items-center text-center w-full max-w-[1200px] mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[#FFFFFF] font-bold text-[40px] md:text-[64px] leading-[1.05] tracking-tighterer"
        >
          Secure Every AI Request.<br />
          In Milliseconds.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="mt-[24px] max-w-[640px] text-[#A1A1AA] text-[16px] md:text-[20px] leading-[1.6]"
        >
          Drop-in API proxy that detects prompt injection, jailbreaks, and PII leakage before they reach your LLM. 2 lines of code. Under 50ms.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="mt-[40px] flex flex-col sm:flex-row items-center gap-[16px]"
        >
          <Link 
            href="/auth/sign-up"
            className="text-[16px] font-semibold bg-[#FFFFFF] text-[#0A0E1A] px-[32px] py-[14px] rounded-[10px] hover:brightness-110 transition-all shadow-[0_4px_14px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_14px_rgba(255,255,255,0.1)] whitespace-nowrap"
          >
            Get Free API Key &rarr;
          </Link>
          <Link 
            href="/docs"
            className="text-[16px] font-semibold text-[#FFFFFF] border border-white/20 px-[32px] py-[14px] rounded-[10px] hover:bg-white/[0.05] transition-colors whitespace-nowrap"
          >
            View Documentation
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
