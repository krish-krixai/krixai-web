"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
export interface ProductUpdate {
  version: string;
  date: string;
  features: string[];
}

export function ProductUpdates({ updates }: { updates: ProductUpdate[] }) {
  return (
    <section className="w-full max-w-[85rem] mx-auto px-6 lg:px-12 py-24 relative z-10">
      
      <div className="flex flex-col md:flex-row gap-16">
        
        {/* Left Column: Context */}
        <div className="w-full md:w-1/3">
          <div className="sticky top-32">
            <h2 className="text-3xl font-medium tracking-tight text-white mb-4">
              Latest Updates
            </h2>
            <span className="inline-flex items-center gap-2 text-neutral-500 font-semibold text-[14px] cursor-not-allowed mt-2">
              Changelog <span className="text-[10px] uppercase tracking-widest text-indigo-400/80 bg-indigo-500/10 px-2 py-0.5 rounded-full">Coming Soon</span>
            </span>
          </div>
        </div>

        {/* Right Column: Timeline */}
        <div className="w-full md:w-2/3 relative">
          
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-[9.5rem] top-2 bottom-2 w-px bg-white/[0.04]" />

          <div className="flex flex-col gap-12">
            {updates.map((update, index) => (
              <div key={update.version} className="relative flex flex-col md:flex-row gap-8 md:gap-16 group">
                
                {/* Meta Column (Date / Status) */}
                <div className="md:w-32 flex md:justify-end shrink-0 pt-1 pl-12 md:pl-0">
                  <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-1 text-[12px] font-medium uppercase tracking-widest text-neutral-500">
                    <span className="text-white">{update.version}</span>
                    <span className="hidden md:inline text-white/[0.2]">—</span>
                    <span className="text-indigo-400/80">{update.date}</span>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-[9.5rem] top-1.5 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-white/[0.1] border-2 border-black group-hover:bg-indigo-500 group-hover:shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-300" />

                {/* Content Box */}
                <div className="flex-1 bg-[#0A0A0A] border border-white/[0.04] p-8 rounded-2xl ml-12 md:ml-0 group-hover:border-white/[0.1] transition-colors duration-300">
                  <h3 className="text-lg font-medium text-white mb-6">
                    What&apos;s new in {update.version}
                  </h3>
                  
                  <ul className="flex flex-col gap-4">
                    {update.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-neutral-400 text-[15px] leading-[1.6]">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
