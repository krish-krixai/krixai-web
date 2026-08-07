"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

export function CodeSnippet() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      className="relative z-20 w-full max-w-[1000px] mx-auto mt-[40px] px-6 text-left"
    >
      <div className="w-full bg-[#000000] border border-[#27272A] rounded-[12px] overflow-hidden shadow-2xl relative">
        
        {/* Sleek Tab Bar (Only Python) */}
        <div className="flex items-center justify-between px-[16px] bg-[#0A0A0A] border-b border-[#27272A] overflow-x-auto">
          <div className="flex items-center">
            <div className="px-[16px] py-[14px] text-[13px] font-medium flex items-center gap-[8px] text-[#EDEDED] border-b-[2px] border-[#8B5CF6] -mb-[1px]">
              Python
            </div>
          </div>
          <button 
            onClick={handleCopy}
            className="p-[8px] text-[#888888] hover:text-[#EDEDED] transition-colors rounded-md hover:bg-[#1A1A1A]"
          >
            {copied ? <Check className="w-[16px] h-[16px]" /> : <Copy className="w-[16px] h-[16px]" />}
          </button>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="flex p-[24px] md:p-[32px] overflow-x-auto text-[13px] md:text-[14px] leading-[1.7] font-mono text-[#EDEDED]">
          
          {/* Line Numbers */}
          <div className="flex flex-col text-[#404040] select-none pr-[24px] text-right">
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(num => (
              <span key={num}>{num}</span>
            ))}
          </div>

          {/* Actual Code */}
          <div className="flex-1 overflow-x-auto">
            <pre>
              <code>
                <span className="text-[#666666]"># Before — direct OpenAI call</span>
                <br />
                <span className="text-[#8B5CF6]">import</span> openai
                <br />
                client <span className="text-[#8B5CF6]">=</span> openai.<span className="text-[#38BDF8]">OpenAI</span>(api_key<span className="text-[#8B5CF6]">=</span><span className="text-[#34D399]">"sk-..."</span>)
                <br />
                <br />
                <span className="text-[#666666]"># After — secured through Krixai (change 2 lines)</span>
                <br />
                client <span className="text-[#8B5CF6]">=</span> openai.<span className="text-[#38BDF8]">OpenAI</span>(
                <br />
                {"    "}api_key<span className="text-[#8B5CF6]">=</span><span className="text-[#34D399]">"sk-..."</span>,
                <br />
                <div className="bg-[rgba(139,92,246,0.08)] -ml-[24px] pl-[24px] pr-[100px] py-[2px] border-l-[2px] border-[#8B5CF6] block whitespace-pre">
                  {"    "}base_url<span className="text-[#8B5CF6]">=</span><span className="text-[#34D399]">"https://api.krixaisecurity.com/v1"</span>,     <span className="text-[#666666]"># &larr; route through Krixai</span>
                  <br />
                  {"    "}default_headers<span className="text-[#8B5CF6]">=</span>{"{"}<span className="text-[#34D399]">"X-Krixai-Key"</span>: <span className="text-[#34D399]">"kx-..."</span>{"}"} <span className="text-[#666666]"># &larr; add your Krixai key</span>
                </div>
                )
                <br />
                <br />
                <span className="text-[#666666]"># That's it. Every request is now protected.</span>
                <br />
                response <span className="text-[#8B5CF6]">=</span> client.chat.completions.<span className="text-[#38BDF8]">create</span>(
                <br />
                {"    "}model<span className="text-[#8B5CF6]">=</span><span className="text-[#34D399]">"gpt-4o"</span>,
                <br />
                {"    "}messages<span className="text-[#8B5CF6]">=</span>[{"{"}<span className="text-[#34D399]">"role"</span>: <span className="text-[#34D399]">"user"</span>, <span className="text-[#34D399]">"content"</span>: user_input{"}"}]
                <br />
                )
              </code>
            </pre>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
