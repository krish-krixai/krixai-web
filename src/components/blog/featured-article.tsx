"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, User, Calendar, BookOpen, Activity } from "lucide-react";
import type { Article } from "@/data/research";
import { getCategoryById } from "@/data/research";
import { ThreatMatrixVis, PolicyEngineVis, DetectionTimelineVis, AgentGraphVis } from "./visuals";

const BADGE_COLOR_MAP: Record<string, string> = {
  blue: "text-blue-400 border-blue-500/20 bg-blue-500/10",
  red: "text-red-400 border-red-500/20 bg-red-500/10",
  emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  purple: "text-purple-400 border-purple-500/20 bg-purple-500/10",
  amber: "text-amber-400 border-amber-500/20 bg-amber-500/10",
};

export function FeaturedArticle({ article }: { article: Article }) {
  if (!article) return null;

  const category = getCategoryById(article.category);
  const badgeColor = category ? BADGE_COLOR_MAP[category.color] : "";

  // Assign a visual based on category/tags for variety
  let Visual = ThreatMatrixVis;
  if (article.category === "threat-intelligence") Visual = DetectionTimelineVis;
  if (article.category === "engineering") Visual = PolicyEngineVis;
  if (article.category === "research") Visual = AgentGraphVis;

  return (
    <section className="w-full max-w-[85rem] mx-auto px-6 lg:px-12 mb-24 z-10 relative mt-[-30px]">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-[14px] font-bold tracking-[0.2em] uppercase text-white">Featured Publication</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/[0.08] to-transparent" />
      </div>

      <Link href={`/research/${article.slug}`} className="block group">
        <div className="relative w-full rounded-2xl overflow-hidden bg-[#161616] border border-white/[0.04] flex flex-col-reverse lg:flex-row transition-all duration-500 hover:border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.6)]">

          {/* Content (70%) */}
          <div className="w-full lg:w-[65%] p-8 lg:p-14 flex flex-col justify-center relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] border px-3 py-1 rounded-md ${badgeColor}`}>
                {category?.name}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] border px-3 py-1 rounded-md text-neutral-400 border-white/[0.08] bg-white/[0.02]">
                {article.difficulty}
              </span>
              <div className="flex items-center gap-1.5 text-neutral-500 text-[12px] font-medium ml-2">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                <span>Updated: {article.lastUpdated || article.publishDate}</span>
              </div>
            </div>

            <h3 className="text-3xl lg:text-[2.75rem] font-medium tracking-tight text-white mb-6 leading-[1.15] group-hover:text-neutral-200 transition-colors text-balance">
              {article.title}
            </h3>

            <p className="text-neutral-400 text-[16px] lg:text-lg leading-[1.7] mb-10 max-w-2xl">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-white/[0.04]">
              <div className="flex items-center gap-x-6 gap-y-3 text-neutral-500 text-[13px] font-medium">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-neutral-600" />
                  <span className="text-neutral-300">{article.author.name}</span>
                </div>
                <div className="flex items-center gap-1.5 hidden sm:flex">
                  <Calendar className="w-4 h-4 text-neutral-600" />
                  <span>Published {article.publishDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-neutral-600" />
                  <span>{article.readingTime} read</span>
                </div>
              </div>

              <div className="flex items-center text-[13px] font-semibold tracking-wide bg-white text-black px-5 py-2.5 rounded-lg group-hover:bg-neutral-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <BookOpen className="w-4 h-4 mr-2" />
                <span>Read Full Paper</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Visualization (30%) */}
          <div className="w-full lg:w-[35%] relative min-h-[250px] lg:min-h-full border-b lg:border-b-0 lg:border-l border-white/[0.04] bg-[#050505]">
            <Visual className="opacity-60 group-hover:opacity-100 transition-opacity duration-700" color={category?.color as any} />
          </div>

        </div>
      </Link>
    </section>
  );
}
