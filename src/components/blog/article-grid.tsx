"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";
import type { Article } from "@/data/research";
import { getCategoryById } from "@/data/research";
import { 
  RuntimePipelineVis, 
  ThreatMatrixVis, 
  PromptInjectionVis, 
  PolicyEngineVis, 
  RuntimeFirewallVis, 
  AgentGraphVis, 
  DetectionTimelineVis, 
  InferenceGatewayVis, 
  RuntimeArchitectureVis 
} from "./visuals";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ACCENT_MAP: Record<string, { border: string; text: string; bg: string }> = {
  blue:    { border: "group-hover:border-blue-500/30", text: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  red:     { border: "group-hover:border-red-500/30", text: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  emerald: { border: "group-hover:border-emerald-500/30", text: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  purple:  { border: "group-hover:border-purple-500/30", text: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  amber:   { border: "group-hover:border-amber-500/30", text: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
};

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const category = getCategoryById(article.category);
  const accent = category ? ACCENT_MAP[category.color] : ACCENT_MAP.blue;
  
  // Rhythm logic
  const isLarge = index % 5 === 0;
  const isWide = index % 5 === 3;
  
  const colSpanClass = isWide 
    ? "md:col-span-3 lg:col-span-3" 
    : isLarge 
      ? "md:col-span-2 lg:col-span-2" 
      : "md:col-span-1 lg:col-span-1";

  // Assign a visual to wide or large cards based on category and index
  let Visual = RuntimePipelineVis;
  if (article.category === "threat-intelligence") {
    Visual = index % 3 === 0 ? ThreatMatrixVis : index % 2 === 0 ? PromptInjectionVis : DetectionTimelineVis;
  } else if (article.category === "engineering") {
    Visual = index % 2 === 0 ? PolicyEngineVis : InferenceGatewayVis;
  } else if (article.category === "runtime-security") {
    Visual = index % 2 === 0 ? RuntimeFirewallVis : RuntimeArchitectureVis;
  } else if (article.category === "research") {
    Visual = index % 2 === 0 ? AgentGraphVis : RuntimePipelineVis;
  }

  const showVisual = isWide || (isLarge && index % 2 === 0);

  return (
    <Link href={`/research/${article.slug}`} className={cn("block group w-full h-full", colSpanClass)}>
      <div className={cn(
        "flex h-full bg-[#161616] border border-white/[0.04] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300",
        accent.border,
        isWide || isLarge ? "flex-col lg:flex-row" : "flex-col"
      )}>
        
        {/* Content Area */}
        <div className={cn(
          "flex flex-col flex-1 p-6 lg:p-8 relative z-10",
          (isWide || isLarge) && showVisual ? "lg:w-[55%]" : "w-full"
        )}>
          {/* Header row: Category + Difficulty */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className={cn("text-[10px] font-bold tracking-[0.2em] uppercase border px-2 py-0.5 rounded-md", accent.bg, accent.text)}>
              {category?.name}
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500 border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 rounded-md">
              {article.difficulty}
            </span>
            <span className="text-[10px] font-medium tracking-wide text-neutral-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readingTime}
            </span>
          </div>

          {/* Title */}
          <h3 className={cn(
            "font-medium tracking-tight text-white mb-3 leading-[1.25] group-hover:text-neutral-200 transition-colors text-balance",
            isWide || isLarge ? "text-2xl lg:text-3xl" : "text-xl"
          )}>
            {article.title}
          </h3>

          {/* New Meta Fields for Authority */}
          <div className="flex flex-col gap-2 mb-6 mt-1">
            {article.problemSolved && (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-[13px] text-neutral-400 leading-snug">
                  <strong className="text-neutral-300 font-medium">Solves:</strong> {article.problemSolved}
                </span>
              </div>
            )}
            {article.targetAudience && (
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span className="text-[13px] text-neutral-400 leading-snug">
                  <strong className="text-neutral-300 font-medium">For:</strong> {article.targetAudience}
                </span>
              </div>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-white/[0.04] flex items-center justify-between">
            <span className="text-[11px] font-medium text-neutral-500">
              Updated {article.lastUpdated || article.publishDate}
            </span>
            <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>

        {/* Optional Visual Area for Large/Wide cards */}
        {showVisual && (isWide || isLarge) && (
          <div className="w-full lg:w-[45%] min-h-[200px] border-t lg:border-t-0 lg:border-l border-white/[0.04] bg-[#050505] relative overflow-hidden flex items-center justify-center p-6">
            <Visual className="w-full max-w-[300px] opacity-40 group-hover:opacity-100 transition-opacity duration-700" color={category?.color as any} />
          </div>
        )}
      </div>
    </Link>
  );
}

function ThreatBulletinCard() {
  return (
    <Link href="/research/category/threat-intelligence" className="block group w-full h-full md:col-span-1 lg:col-span-1">
      <div className="flex flex-col h-full bg-[#111111] border border-red-500/20 rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(239,68,68,0.15)] transition-all duration-300 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-red-500/20 transition-all duration-700" />
        
        <div className="p-6 lg:p-8 flex flex-col h-full relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-red-400">Latest Threat Bulletin</span>
          </div>

          <h3 className="text-xl font-medium tracking-tight text-white mb-3 leading-[1.25]">
            Q3 AI Application Threat Landscape
          </h3>

          <p className="text-neutral-400 text-[14px] leading-[1.65] mb-8 line-clamp-3">
            Our quarterly analysis of the most prevalent attack vectors targeting LLM infrastructure. Includes data on prompt extraction success rates and new evasion techniques.
          </p>

          <div className="mt-auto pt-6 border-t border-red-500/10 flex items-center justify-between group-hover:border-red-500/30 transition-colors">
            <span className="text-[12px] font-semibold text-red-400">Read the Full Report</span>
            <ArrowRight className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ArticleGrid({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <div className="w-full max-w-[85rem] mx-auto px-6 lg:px-12 py-32 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#161616] border border-white/[0.04] shadow-sm flex items-center justify-center">
            <span className="text-2xl text-neutral-600">∅</span>
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No research found</h3>
          <p className="text-neutral-500 text-[14px]">Try adjusting your search query or category filters.</p>
        </div>
      </div>
    );
  }

  // Interleave the Threat Bulletin Card after the 2nd article if there are enough articles
  const renderItems = () => {
    const items: React.ReactNode[] = [];
    articles.forEach((article, index) => {
      items.push(<ArticleCard key={article.slug} article={article} index={index} />);
      if (index === 1 && articles.length > 2) {
        items.push(<ThreatBulletinCard key="threat-bulletin" />);
      }
    });
    return items;
  };

  return (
    <section className="w-full max-w-[85rem] mx-auto px-6 lg:px-12 mb-24 z-10 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderItems()}
      </div>
    </section>
  );
}
