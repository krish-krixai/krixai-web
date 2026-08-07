"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export function Integration() {
  return (
    <section className="relative w-full bg-[#08111F] py-20 lg:py-32 overflow-hidden flex flex-col items-center border-t border-white/[0.04]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col items-center">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 relative z-10"
        >
          <p className="text-[12px] text-neutral-500 mb-6 font-medium uppercase tracking-[0.25em]">
            DEVELOPER EXPERIENCE
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-medium tracking-tight text-white leading-[1.15] mb-6">
            Two lines of code. <br className="hidden sm:block"/> Instant protection.
          </h2>
          <p className="text-[17px] text-neutral-400 leading-[1.6] max-w-2xl font-normal">
            krixai acts as a seamless wrapper around your existing AI SDKs. No complex architecture changes, no proxy management. Just drop it in and your workspace policies are instantly enforced.
          </p>
        </motion.div>

        {/* Code Editor Visual */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl bg-[#030508] border border-white/[0.05] rounded-[16px] overflow-hidden mb-12 shadow-[0_0_50px_rgba(59,130,246,0.05)] relative z-10 group"
        >
          {/* Editor Header (macOS style) */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0A0D12] border-b border-white/[0.05]">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-neutral-600/50" />
              <div className="w-3 h-3 rounded-full bg-neutral-600/50" />
              <div className="w-3 h-3 rounded-full bg-neutral-600/50" />
            </div>
            <div className="flex items-center space-x-2 text-neutral-500">
              <Terminal className="w-4 h-4" />
              <span className="text-xs font-mono font-medium">route.ts</span>
            </div>
            <div className="w-16" /> {/* Spacer */}
          </div>

          {/* Editor Content */}
          <div className="p-6 lg:p-8 overflow-x-auto">
            <pre className="text-[13px] lg:text-[14px] leading-[1.8] font-mono">
              <code>
                <span className="text-pink-400">import</span> <span className="text-neutral-300">OpenAI</span> <span className="text-pink-400">from</span> <span className="text-emerald-400">"openai"</span>;<br />
                <span className="text-pink-400">import</span> <span className="text-neutral-300">{'{'} wrapOpenAI {'}'}</span> <span className="text-pink-400">from</span> <span className="text-emerald-400">"@krixai/node"</span>;<br />
                <br />
                <span className="text-neutral-600">{"// 1. Initialize your provider as usual"}</span><br />
                <span className="text-blue-400">const</span> <span className="text-neutral-300">openai</span> <span className="text-blue-400">=</span> <span className="text-pink-400">new</span> <span className="text-neutral-300">OpenAI()</span>;<br />
                <br />
                {/* Highlighted krixai initialization */}
                <motion.div
                  initial={{ backgroundColor: "rgba(59,130,246,0)" }}
                  whileInView={{ backgroundColor: "rgba(59,130,246,0.1)" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="rounded px-2 -mx-2 py-1 border border-blue-500/0 relative"
                >
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                    className="absolute -left-1 top-0 bottom-0 w-[2px] bg-blue-500"
                  />
                  <span className="text-neutral-600">{"// 2. Wrap it with krixai (1 line of code)"}</span><br />
                  <span className="text-blue-400">const</span> <span className="text-neutral-300">krixai</span> <span className="text-blue-400">=</span> <span className="text-amber-300">wrapOpenAI</span><span className="text-neutral-300">(openai)</span>;
                </motion.div>
                <br />
                <span className="text-neutral-600">{"// 3. All requests are now evaluated against your workspace policies"}</span><br />
                <span className="text-blue-400">const</span> <span className="text-neutral-300">response</span> <span className="text-blue-400">= await</span> <span className="text-neutral-300">krixai.chat.completions.</span><span className="text-amber-300">create</span><span className="text-neutral-300">({'{'}</span><br />
                <span className="text-neutral-300">  model: </span><span className="text-emerald-400">"gpt-4-turbo"</span><span className="text-neutral-300">,</span><br />
                <span className="text-neutral-300">  messages: [{'{'} role: </span><span className="text-emerald-400">"user"</span><span className="text-neutral-300">, content: </span><span className="text-emerald-400">"Summarize this document..."</span> <span className="text-neutral-300">{'}'}],</span><br />
                <span className="text-neutral-300">{'}'})</span>;<br />
              </code>
            </pre>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <Link
            href="/docs"
            className="bg-white text-black px-8 py-3.5 rounded-full text-[14px] font-semibold tracking-wide hover:scale-[1.02] hover:bg-neutral-200 transition-all duration-300 ease-out flex items-center justify-center w-full sm:w-auto group shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <span>Read the Docs</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
