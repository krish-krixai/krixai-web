"use client";

import React, { useState } from "react";
import { Key, Copy, Check } from "lucide-react";

export function Step1ApiKey() {
  const [copied, setCopied] = useState(false);
  const apiKey = "krx_live_a1b2c3d4e5f6g7h8i9j0";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="step-1" className="flex flex-col pt-12 pb-8 border-t border-white/[0.08] scroll-mt-24">
      <h2 className="text-2xl font-semibold text-white mb-4">1. Get an API Key</h2>
      <p className="text-[15px] text-neutral-400 leading-relaxed mb-6">
        To interact with the krixai platform, you first need to generate a secure API key. 
        Create an account on the dashboard, navigate to the API Keys section, and generate a new live key.
        Store this key securely in your environment variables.
      </p>

      {/* Mock API Key Card */}
      <div className="w-full max-w-md p-6 rounded-xl bg-[#050505] border border-white/[0.1] shadow-lg flex flex-col">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
            <Key className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-[14px] font-semibold text-white">Live API Key</span>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg bg-black border border-white/[0.05]">
          <span className="text-[13px] font-mono text-neutral-300 tracking-wide">{apiKey}</span>
          <button 
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-white/[0.05] text-neutral-500 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
