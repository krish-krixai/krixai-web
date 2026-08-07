"use client";

import React from "react";
import { Search, Clock, FileText, Activity } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CATEGORIES, ARTICLES } from "@/data/research";
import { SignatureRuntimeVis } from "./signature-runtime-vis";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORY_COLOR_MAP: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40",
  red: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40",
};

interface ResearchHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  activeDifficulty?: string;
  setActiveDifficulty?: (diff: string) => void;
}

export function ResearchHero({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  activeDifficulty = "All",
  setActiveDifficulty = () => {},
}: ResearchHeroProps) {
  const latestArticle = ARTICLES[0]; // Assuming sorted by date

  return (
    <section className="relative w-full bg-black pt-32 pb-0 overflow-hidden border-b border-white/[0.04]">
      {/* Subtle Blueprint Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      
      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full relative z-10 flex flex-col gap-12">
        
        {/* Top: Content & Filters */}
        <div className="w-full flex flex-col items-center text-center">
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-neutral-400 text-[11px] font-semibold tracking-wide">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>LIVE JOURNAL</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-500 text-[11px] font-medium hidden sm:flex">
              <FileText className="w-3.5 h-3.5" />
              <span>{ARTICLES.length} Publications</span>
            </div>
            {latestArticle && (
              <div className="flex items-center gap-1.5 text-neutral-500 text-[11px] font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>Updated {latestArticle.publishDate}</span>
              </div>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[4.5rem] font-medium tracking-tight text-white leading-[1.05] mb-6">
            Krixai Research
          </h1>
          <p className="text-lg lg:text-xl text-neutral-400 max-w-2xl leading-[1.6] font-normal mb-10 text-balance mx-auto">
            Original engineering research, runtime security analysis, threat intelligence, and practical guidance for building secure AI systems.
          </p>

          <div className="w-full flex flex-col items-center gap-6">
            <div className="relative w-full max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-500" />
              </div>
              <input
                type="text"
                className="w-full bg-white/[0.02] border border-white/[0.08] text-white rounded-xl py-3.5 pl-11 pr-4 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-white/[0.15] focus:border-white/[0.15] transition-all text-[14px] font-medium shadow-sm hover:border-white/[0.12]"
                placeholder="Search proprietary research..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap justify-center items-center gap-2">
                <button
                  onClick={() => setActiveCategory("All")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[12px] font-semibold tracking-wide transition-all duration-200 border",
                    activeCategory === "All"
                      ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                      : "bg-transparent text-neutral-400 border-white/[0.08] hover:bg-white/[0.03] hover:text-white hover:border-white/[0.15]"
                  )}
                >
                  All Research
                </button>
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  const activeColors = CATEGORY_COLOR_MAP[cat.color] || "";
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-[12px] font-semibold tracking-wide transition-all duration-200 border",
                        isActive
                          ? activeColors
                          : "bg-transparent text-neutral-400 border-white/[0.08] hover:bg-white/[0.03] hover:text-white hover:border-white/[0.15]"
                      )}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              {/* Difficulty Filters */}
              <div className="flex flex-wrap justify-center items-center gap-2 mt-2">
                <span className="text-[11px] font-semibold tracking-widest text-neutral-600 uppercase mr-2">Level:</span>
                {["All", "Beginner", "Intermediate", "Advanced"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setActiveDifficulty(diff)}
                    className={cn(
                      "px-3 py-1 rounded-md text-[11px] font-semibold tracking-wide transition-all duration-200 border",
                      activeDifficulty === diff
                        ? "bg-white/10 text-white border-white/20"
                        : "bg-transparent text-neutral-500 border-white/[0.04] hover:bg-white/[0.03] hover:text-neutral-300"
                    )}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Full Width Visualization */}
        <div className="w-full mt-10 rounded-t-2xl overflow-hidden border border-white/[0.04] border-b-0 bg-[#020202] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <SignatureRuntimeVis />
        </div>
      </div>
    </section>
  );
}
