"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function PricingPreview() {
  return (
    <section className="relative w-full bg-[#08111F] py-20 lg:py-24 overflow-hidden flex flex-col items-center border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col items-center">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10"
        >
          <p className="text-[12px] text-neutral-500 mb-4 font-medium uppercase tracking-[0.25em]">
            PRICING
          </p>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white text-balance mb-4">
            Start with the protection you need.
          </h2>
          <p className="text-[16px] text-neutral-400 leading-[1.6] font-normal">
            Plans are based on the number of AI requests routed through KrixAI.
          </p>
        </motion.div>

        {/* Compact Horizontal Pricing Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl bg-[#05070A] border border-blue-500/20 rounded-[20px] p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-[0_0_30px_rgba(59,130,246,0.05)] relative overflow-hidden"
        >
          
          {/* Subtle Glow inside the panel */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/5 via-transparent to-transparent pointer-events-none" />

          {/* Left: Plan Name & Quota */}
          <div className="flex flex-col relative z-10">
            <h3 className="text-[20px] font-semibold text-white mb-1">Starter</h3>
            <p className="text-[14px] text-neutral-400">50,000 prompt scans / month</p>
          </div>

          {/* Center: Price & Tax */}
          <div className="flex flex-col lg:items-center relative z-10">
            <div className="text-[24px] font-medium text-white mb-1">
              ₹4,100 <span className="text-[16px] text-neutral-500 font-normal">/ month</span>
            </div>
            <p className="text-[13px] text-neutral-500">+ applicable GST</p>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto relative z-10 mt-2 lg:mt-0">
            <Link
              href="/pricing"
              className="bg-white text-black px-6 py-2.5 rounded-full text-[14px] font-semibold tracking-wide hover:scale-[1.02] hover:bg-neutral-200 transition-all duration-300 flex items-center justify-center w-full sm:w-auto shadow-sm"
            >
              View pricing
            </Link>
            <Link
              href="/contact"
              className="text-[14px] font-medium text-neutral-400 hover:text-white transition-colors flex items-center justify-center group"
            >
              Talk to sales
              <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Optional small note */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-[12px] text-neutral-600 mt-6 text-center"
        >
          India self-serve billing is currently available. International billing: contact sales.
        </motion.p>

      </div>
    </section>
  );
}
