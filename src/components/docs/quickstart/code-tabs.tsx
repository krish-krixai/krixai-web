"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Tab {
  id: string;
  label: string;
  language: string;
  code: string;
}

interface CodeTabsProps {
  tabs: Tab[];
}

export function CodeTabs({ tabs }: CodeTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [copied, setCopied] = useState(false);

  const activeCode = tabs.find((t) => t.id === activeTab)?.code || "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group w-full bg-[#0a0a0a] rounded-xl border border-white/[0.1] shadow-2xl overflow-hidden mt-4 mb-8">
      {/* Tabs Header */}
      <div className="flex items-center px-4 pt-3 border-b border-white/[0.1] bg-[#050505] space-x-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-3 text-[13px] font-medium transition-colors duration-200 border-b-2 relative -bottom-[1px]",
                isActive 
                  ? "text-indigo-400 border-indigo-400" 
                  : "text-neutral-500 border-transparent hover:text-neutral-300"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Code Body */}
      <div className="relative">
        <pre className="p-5 overflow-x-auto text-[13px] font-mono leading-[1.7] text-neutral-300 custom-scrollbar">
          <code>{activeCode}</code>
        </pre>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/[0.05] border border-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
          aria-label="Copy code"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
