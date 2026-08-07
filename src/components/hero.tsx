"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Extremely slow parallax for background
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#05070A] text-white py-20 lg:py-32"
    >
      {/* Parallax Background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {/* Blueprint Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_10%,transparent_100%)]" />

        {/* KrixAI Aurora 1 (Deep Blue) */}
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-blue-600/10 blur-[130px] rounded-full"
        />

        {/* KrixAI Aurora 2 (Subtle Emerald) */}
        <motion.div 
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 60, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ repeat: Infinity, duration: 25, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-1/4 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-emerald-500/5 blur-[130px] rounded-full"
        />

        {/* Near-invisible noise texture (on top of glows to add grain) */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-screen" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center z-10">
        
        {/* Left Column: Copy & CTAs */}
        <div className="flex flex-col space-y-8 w-full max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-[4.75rem] font-medium tracking-tight lg:tracking-[-0.03em] leading-[1.05] text-white text-balance">
              Protect what <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-[#3B82F6] drop-shadow-sm">
                your AI knows
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[17px] lg:text-[19px] text-neutral-400 leading-[1.6] font-normal tracking-wide text-balance">
              krixai screens AI requests before they reach your model—detecting prompt injection, jailbreak attempts, and sensitive data in user input, then allowing, warning, or blocking based on your security policy.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link 
              href="/dashboard" 
              className="bg-white text-black px-8 py-3.5 rounded-full text-[14px] font-semibold tracking-wide hover:bg-neutral-200 transition-colors flex items-center justify-center w-full sm:w-auto shadow-sm"
            >
              Get Started
            </Link>
            <Link 
              href="/contact" 
              className="text-neutral-400 px-6 py-3.5 rounded-full text-[14px] font-medium tracking-wide hover:text-white transition-colors flex items-center justify-center w-full sm:w-auto"
            >
              Contact Sales
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Abstract Request Signal Field */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center"
        >
          {/* Glassmorphism Container */}
          <div className="relative w-full max-w-[500px] h-[320px] bg-white/[0.02] border border-white/[0.05] rounded-3xl shadow-2xl flex items-center overflow-hidden">
            
            {/* Subtle background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:1rem_1rem] pointer-events-none" />
            
            {/* SVG Connecting Lines behind elements */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" z-index="0">
              {/* Path 1: Top (Malicious) */}
              <motion.path 
                d="M 50 100 C 150 100 200 160 250 160" 
                stroke="rgba(239,68,68,0.4)" strokeWidth="2" strokeDasharray="4 4" fill="none"
                animate={{ strokeDashoffset: [24, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
              <motion.path 
                d="M 250 160 C 300 160 350 80 450 80" 
                stroke="rgba(239,68,68,0.2)" strokeWidth="2" strokeDasharray="4 4" fill="none"
                animate={{ strokeDashoffset: [24, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
              {/* Path 2: Bottom (Safe) */}
              <motion.path 
                d="M 50 220 C 150 220 200 160 250 160" 
                stroke="rgba(59,130,246,0.4)" strokeWidth="2" strokeDasharray="4 4" fill="none"
                animate={{ strokeDashoffset: [24, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
              <motion.path 
                d="M 250 160 C 300 160 350 240 450 240" 
                stroke="rgba(16,185,129,0.4)" strokeWidth="2" strokeDasharray="4 4" fill="none"
                animate={{ strokeDashoffset: [24, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </svg>

            {/* Elements Layer */}
            <div className="absolute inset-0 flex items-center w-full h-full z-10">
              
              {/* Left Side: Incoming Requests */}
              <div className="absolute left-[5%] top-[80px] flex flex-col gap-2">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }}
                  className="bg-[#111] border border-red-500/20 px-3 py-2 rounded-md shadow-lg"
                >
                  <span className="text-[11px] font-mono text-neutral-300">"Ignore instructions..."</span>
                </motion.div>
              </div>

              <div className="absolute left-[5%] top-[200px] flex flex-col gap-2">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 1.1 }}
                  className="bg-[#111] border border-blue-500/20 px-3 py-2 rounded-md shadow-lg"
                >
                  <span className="text-[11px] font-mono text-neutral-300">"Summarize document..."</span>
                </motion.div>
              </div>

              {/* Center: krixai Engine */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2.5 bg-[#08111F] border border-blue-500/30 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)] backdrop-blur-md"
              >
                <span className="text-[12px] font-bold text-white uppercase tracking-widest">krixai</span>
              </motion.div>

              {/* Right Side: Outcomes */}
              <div className="absolute right-[5%] top-[70px] flex items-center justify-center">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4, delay: 1.4 }}
                  className="bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-full flex items-center shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 animate-pulse" />
                  <span className="text-[10px] font-bold text-red-500 tracking-wider">BLOCKED</span>
                </motion.div>
              </div>

              <div className="absolute right-[5%] top-[230px] flex items-center justify-center">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4, delay: 1.7 }}
                  className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full flex items-center shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                  <span className="text-[10px] font-bold text-emerald-500 tracking-wider">ALLOWED</span>
                </motion.div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
