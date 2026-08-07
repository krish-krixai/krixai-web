"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split("\n");

  return (
    <div className="relative group w-full bg-[#050505] rounded-xl border border-white/[0.08] shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden mt-4 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.04] bg-black/40 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
          <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/30" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
        </div>
        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest">{language}</span>
      </div>

      {/* Code Body with Line Numbers */}
      <div className="relative flex">
        {/* Line Numbers Gutter */}
        <div className="flex flex-col text-right px-4 py-5 bg-white/[0.01] border-r border-white/[0.04] select-none">
          {lines.map((_, i) => (
            <span key={i} className="text-[13px] font-mono leading-[1.7] text-neutral-600/80">
              {i + 1}
            </span>
          ))}
        </div>
        
        {/* Code Content */}
        <pre className="p-5 overflow-x-auto custom-scrollbar flex-1 w-full">
          <code className="text-[13px] font-mono leading-[1.7] text-neutral-300 block">
            {lines.map((line, i) => (
              <span key={i} className="block">{line || " "}</span>
            ))}
          </code>
        </pre>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/[0.05] border border-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Copy code"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
              >
                <Check className="w-4 h-4 text-emerald-400" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
              >
                <Copy className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}
