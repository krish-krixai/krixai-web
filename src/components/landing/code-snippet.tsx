"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type SDK = "OpenAI" | "Google GenAI" | "Anthropic";

export function CodeSnippet() {
  const [copied, setCopied] = useState(false);
  const [activeSDK, setActiveSDK] = useState<SDK>("OpenAI");

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sdks: SDK[] = ["OpenAI", "Google GenAI", "Anthropic"];

  const snippets = {
    "OpenAI": (
      <>
        <span className="text-[#666666]"># Native OpenAI SDK</span>
        <br />
        <span className="text-[#8B5CF6]">import</span> openai
        <br />
        <br />
        client <span className="text-[#8B5CF6]">=</span> openai.<span className="text-[#38BDF8]">OpenAI</span>(
        <br />
        {"    "}api_key<span className="text-[#8B5CF6]">=</span><span className="text-[#34D399]">"sk-..."</span>,
        <br />
        <div className="bg-[rgba(139,92,246,0.08)] -ml-[24px] pl-[24px] pr-[100px] py-[2px] border-l-[2px] border-[#8B5CF6] block whitespace-pre">
          {"    "}base_url<span className="text-[#8B5CF6]">=</span><span className="text-[#34D399]">"https://api.krixaisecurity.com/v1"</span>,     <span className="text-[#666666]"># &larr; route through Krixai</span>
          <br />
          {"    "}default_headers<span className="text-[#8B5CF6]">=</span>{"{"}<span className="text-[#34D399]">"X-Krixai-API-Key"</span>: <span className="text-[#34D399]">"kx-..."</span>{"}"} <span className="text-[#666666]"># &larr; add your Krixai key</span>
        </div>
        )
        <br />
        <br />
        response <span className="text-[#8B5CF6]">=</span> client.chat.completions.<span className="text-[#38BDF8]">create</span>(
        <br />
        {"    "}model<span className="text-[#8B5CF6]">=</span><span className="text-[#34D399]">"gpt-4o"</span>,
        <br />
        {"    "}messages<span className="text-[#8B5CF6]">=</span>[{"{"}<span className="text-[#34D399]">"role"</span>: <span className="text-[#34D399]">"user"</span>, <span className="text-[#34D399]">"content"</span>: <span className="text-[#34D399]">"Hello, Krixai!"</span>{"}"}]
        <br />
        )
      </>
    ),
    "Google GenAI": (
      <>
        <span className="text-[#666666]"># Native Google GenAI SDK</span>
        <br />
        <span className="text-[#8B5CF6]">from</span> google <span className="text-[#8B5CF6]">import</span> genai
        <br />
        <span className="text-[#8B5CF6]">from</span> google.genai <span className="text-[#8B5CF6]">import</span> types
        <br />
        <br />
        client <span className="text-[#8B5CF6]">=</span> genai.<span className="text-[#38BDF8]">Client</span>(
        <br />
        {"    "}api_key<span className="text-[#8B5CF6]">=</span><span className="text-[#34D399]">"AIza..."</span>,
        <br />
        <div className="bg-[rgba(139,92,246,0.08)] -ml-[24px] pl-[24px] pr-[100px] py-[2px] border-l-[2px] border-[#8B5CF6] block whitespace-pre">
          {"    "}http_options<span className="text-[#8B5CF6]">=</span>types.<span className="text-[#38BDF8]">HttpOptions</span>(
          <br />
          {"        "}base_url<span className="text-[#8B5CF6]">=</span><span className="text-[#34D399]">"https://api.krixaisecurity.com"</span>,  <span className="text-[#666666]"># &larr; route through Krixai</span>
          <br />
          {"        "}headers<span className="text-[#8B5CF6]">=</span>{"{"}<span className="text-[#34D399]">"x-krixai-api-key"</span>: <span className="text-[#34D399]">"kx-..."</span>{"}"}   <span className="text-[#666666]"># &larr; add your Krixai key</span>
          <br />
          {"    "})
        </div>
        )
        <br />
        <br />
        response <span className="text-[#8B5CF6]">=</span> client.models.<span className="text-[#38BDF8]">generate_content</span>(
        <br />
        {"    "}model<span className="text-[#8B5CF6]">=</span><span className="text-[#34D399]">"gemini-3.7-flash"</span>,
        <br />
        {"    "}contents<span className="text-[#8B5CF6]">=</span><span className="text-[#34D399]">"Hello, Krixai!"</span>
        <br />
        )
      </>
    ),
    "Anthropic": (
      <>
        <span className="text-[#666666]"># Native Anthropic SDK</span>
        <br />
        <span className="text-[#8B5CF6]">from</span> anthropic <span className="text-[#8B5CF6]">import</span> Anthropic
        <br />
        <br />
        client <span className="text-[#8B5CF6]">=</span> <span className="text-[#38BDF8]">Anthropic</span>(
        <br />
        {"    "}api_key<span className="text-[#8B5CF6]">=</span><span className="text-[#34D399]">"sk-ant-..."</span>,
        <br />
        <div className="bg-[rgba(139,92,246,0.08)] -ml-[24px] pl-[24px] pr-[100px] py-[2px] border-l-[2px] border-[#8B5CF6] block whitespace-pre">
          {"    "}base_url<span className="text-[#8B5CF6]">=</span><span className="text-[#34D399]">"https://api.krixaisecurity.com"</span>,      <span className="text-[#666666]"># &larr; route through Krixai</span>
          <br />
          {"    "}default_headers<span className="text-[#8B5CF6]">=</span>{"{"}<span className="text-[#34D399]">"x-krixai-api-key"</span>: <span className="text-[#34D399]">"kx-..."</span>{"}"} <span className="text-[#666666]"># &larr; add your Krixai key</span>
        </div>
        )
        <br />
        <br />
        message <span className="text-[#8B5CF6]">=</span> client.messages.<span className="text-[#38BDF8]">create</span>(
        <br />
        {"    "}model<span className="text-[#8B5CF6]">=</span><span className="text-[#34D399]">"claude-3-opus-20240229"</span>,
        <br />
        {"    "}messages<span className="text-[#8B5CF6]">=</span>[{"{"}<span className="text-[#34D399]">"role"</span>: <span className="text-[#34D399]">"user"</span>, <span className="text-[#34D399]">"content"</span>: <span className="text-[#34D399]">"Hello, Krixai!"</span>{"}"}]
        <br />
        )
      </>
    )
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      className="relative z-20 w-full max-w-[1000px] mx-auto mt-[40px] px-6 text-left"
    >
      <div className="w-full bg-[#000000] border border-[#27272A] rounded-[12px] overflow-hidden shadow-2xl relative">
        
        {/* Sleek Tab Bar */}
        <div className="flex items-center justify-between px-[16px] bg-[#0A0A0A] border-b border-[#27272A] overflow-x-auto">
          <div className="flex items-center">
            {sdks.map(sdk => (
              <button
                key={sdk}
                onClick={() => setActiveSDK(sdk)}
                className={`px-[16px] py-[14px] text-[13px] font-medium flex items-center gap-[8px] transition-colors -mb-[1px] ${
                  activeSDK === sdk 
                    ? "text-[#EDEDED] border-b-[2px] border-[#8B5CF6]" 
                    : "text-[#888888] hover:text-[#EDEDED] border-b-[2px] border-transparent"
                }`}
              >
                {sdk}
              </button>
            ))}
          </div>
          <button 
            onClick={handleCopy}
            className="p-[8px] text-[#888888] hover:text-[#EDEDED] transition-colors rounded-md hover:bg-[#1A1A1A]"
          >
            {copied ? <Check className="w-[16px] h-[16px]" /> : <Copy className="w-[16px] h-[16px]" />}
          </button>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="flex p-[24px] md:p-[32px] overflow-x-auto text-[13px] md:text-[14px] leading-[1.7] font-mono text-[#EDEDED] min-h-[350px]">
          
          {/* Line Numbers */}
          <div className="flex flex-col text-[#404040] select-none pr-[24px] text-right">
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(num => (
              <span key={num}>{num}</span>
            ))}
          </div>

          {/* Actual Code */}
          <div className="flex-1 overflow-x-auto relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSDK}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0"
              >
                <pre>
                  <code>
                    {snippets[activeSDK]}
                  </code>
                </pre>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
