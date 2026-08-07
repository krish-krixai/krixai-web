"use client";

import React from "react";
import { Search } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORIES = [
  "All",
  "AI Security",
  "Prompt Injection",
  "LLM Security",
  "Runtime Protection",
  "Engineering",
  "Product Updates",
  "Tutorials",
  "Research",
];

interface BlogHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export function BlogHero({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
}: BlogHeroProps) {
  return (
    <section className="relative w-full bg-black pt-32 pb-16 overflow-hidden flex flex-col items-center">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.06),transparent_70%)]" />
      </div>

      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full relative z-10 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-medium tracking-tight text-neutral-50 text-balance leading-[1.05] mb-6">
          AI Security Insights
        </h1>
        <p className="text-lg lg:text-[19px] text-neutral-400 max-w-2xl leading-[1.6] font-normal tracking-wide mb-12">
          Practical engineering guides, AI security research, product updates and best practices for building secure LLM applications.
        </p>

        {/* Search Bar */}
        <div className="relative w-full max-w-xl mb-12">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-500" />
          </div>
          <input
            type="text"
            className="w-full bg-white/[0.03] border border-white/[0.08] text-white rounded-full py-4 pl-12 pr-4 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-[15px]"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300",
                  isActive
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-[1.02]"
                    : "bg-white/[0.03] text-neutral-400 border border-white/[0.04] hover:bg-white/[0.08] hover:text-white"
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
