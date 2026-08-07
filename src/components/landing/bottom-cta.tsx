"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function BottomCta() {
  return (
    <section className="w-full mt-[120px] pb-[60px] px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-[800px] mx-auto flex flex-col items-center"
      >
        <h2 className="text-[#FFFFFF] text-[32px] md:text-[48px] font-bold leading-[1.1] tracking-tighter">
          Secure Your AI in 5 Minutes
        </h2>
        <p className="text-[#A1A1AA] text-[16px] md:text-[20px] mt-[16px]">
          Free for your first 10,000 requests. No credit card required.
        </p>
        
        <Link 
          href="/auth/sign-up"
          className="mt-[40px] text-[16px] font-semibold bg-[#FFFFFF] text-[#0A0E1A] px-[32px] py-[14px] rounded-[10px] hover:brightness-110 transition-all shadow-[0_4px_14px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_14px_rgba(255,255,255,0.1)] whitespace-nowrap"
        >
          Get Free API Key &rarr;
        </Link>
      </motion.div>
    </section>
  );
}
