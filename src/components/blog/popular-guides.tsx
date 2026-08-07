"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import type { Guide } from "@/data/blog";

export function PopularGuides({ guides }: { guides: Guide[] }) {
  return (
    <section className="w-full bg-black py-24 relative">
      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row gap-16">
        
        {/* Left Column: Heading & Context */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-32">
            <div className="w-12 h-12 bg-white/[0.03] border border-white/[0.08] rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-medium tracking-tight text-white mb-4">
              Popular Guides
            </h2>
            <p className="text-neutral-400 text-[16px] leading-[1.6]">
              Deep-dive technical resources and step-by-step guides for securing your AI infrastructure.
            </p>
          </div>
        </div>

        {/* Right Column: Guides List */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          {guides.map((guide, index) => (
            <Link 
              key={guide.slug}
              href={`/blog/${guide.slug}`}
              className="group block p-8 rounded-2xl bg-[#0A0A0A] border border-white/[0.04] hover:bg-white/[0.02] hover:border-white/[0.1] transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 text-neutral-500 text-[12px] font-medium tracking-widest uppercase">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span className="w-4 h-px bg-white/[0.1]" />
                    <span>{guide.readingTime} read</span>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2 group-hover:text-indigo-400 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-neutral-400 text-[14px] leading-[1.6]">
                    {guide.summary}
                  </p>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center group-hover:bg-indigo-500 group-hover:border-indigo-500 group-hover:scale-110 transition-all duration-300 shrink-0">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
