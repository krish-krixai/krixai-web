"use client";

import React from "react";
import { motion } from "framer-motion";

export function CodeSnippet() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
      className="w-full max-w-[720px] mx-auto mt-[64px] px-6"
    >
      <div className="w-full bg-[#111827] border border-white/[0.06] rounded-[12px] overflow-hidden shadow-2xl">
        {/* Window Chrome */}
        <div className="flex items-center gap-[8px] px-[20px] py-[16px] bg-[#111827] border-b border-white/[0.04]">
          <div className="w-[12px] h-[12px] rounded-full bg-[#EF4444]" />
          <div className="w-[12px] h-[12px] rounded-full bg-[#F59E0B]" />
          <div className="w-[12px] h-[12px] rounded-full bg-[#10B981]" />
        </div>

        {/* Code Content */}
        <div className="p-[24px] overflow-x-auto text-[13px] md:text-[14px] leading-[1.7] font-mono text-[#E2E8F0]">
          <pre>
            <code>
              <span className="text-[#71717A]"># Before — direct OpenAI call</span>
              <br />
              <span className="text-[#C792EA]">import</span> openai
              <br />
              client <span className="text-[#C792EA]">=</span> openai.<span className="text-[#82AAFF]">OpenAI</span>(api_key<span className="text-[#C792EA]">=</span><span className="text-[#C3E88D]">"sk-..."</span>)
              <br />
              <br />
              <span className="text-[#71717A]"># After — secured through Krixai (change 2 lines)</span>
              <br />
              client <span className="text-[#C792EA]">=</span> openai.<span className="text-[#82AAFF]">OpenAI</span>(
              <br />
              {"    "}api_key<span className="text-[#C792EA]">=</span><span className="text-[#C3E88D]">"sk-..."</span>,
              <br />
              <div className="bg-[rgba(255,255,255,0.04)] -mx-[24px] px-[24px] py-[2px] border-l-[3px] border-white/20">
                {"    "}base_url<span className="text-[#C792EA]">=</span><span className="text-[#C3E88D]">"https://api.krixai.com/v1"</span>,     <span className="text-[#71717A]"># &larr; route through Krixai</span>
                <br />
                {"    "}default_headers<span className="text-[#C792EA]">=</span>{"{"}<span className="text-[#C3E88D]">"X-Krixai-Key"</span>: <span className="text-[#C3E88D]">"kx-..."</span>{"}"} <span className="text-[#71717A]"># &larr; add your Krixai key</span>
              </div>
              )
              <br />
              <br />
              <span className="text-[#71717A]"># That's it. Every request is now protected.</span>
              <br />
              response <span className="text-[#C792EA]">=</span> client.chat.completions.<span className="text-[#82AAFF]">create</span>(
              <br />
              {"    "}model<span className="text-[#C792EA]">=</span><span className="text-[#C3E88D]">"gpt-4o"</span>,
              <br />
              {"    "}messages<span className="text-[#C792EA]">=</span>[{"{"}<span className="text-[#C3E88D]">"role"</span>: <span className="text-[#C3E88D]">"user"</span>, <span className="text-[#C3E88D]">"content"</span>: user_input{"}"}]
              <br />
              )
            </code>
          </pre>
        </div>
      </div>
      <p className="text-center text-[#71717A] text-[13px] md:text-[14px] mt-[16px] max-w-[500px] mx-auto">
        Works with OpenAI, Anthropic, Google, and any OpenAI-compatible API.
      </p>
    </motion.section>
  );
}
