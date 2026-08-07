"use client";

import React from "react";
import { FileText, ShieldAlert, BookOpen, Layers } from "lucide-react";

export function ResearchOverview() {
  return (
    <section className="w-full bg-[#0A0A0A] py-12 border-b border-white/[0.04]">
      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-12 divide-x divide-white/[0.04]">
          
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-neutral-500 mb-1">
                <FileText className="w-4 h-4 text-white" />
                <span className="text-[12px] font-bold uppercase tracking-widest text-white">Research Articles</span>
              </div>
              <div className="text-3xl font-medium text-white tracking-tight">24</div>
              <p className="text-[11px] text-neutral-500 font-medium mt-1">Updated weekly</p>
            </div>

            <div className="flex flex-col gap-1 pl-6 lg:pl-12">
              <div className="flex items-center gap-2 text-neutral-500 mb-1">
                <ShieldAlert className="w-4 h-4 text-white" />
                <span className="text-[12px] font-bold uppercase tracking-widest text-white">Threat Reports</span>
              </div>
              <div className="text-3xl font-medium text-white tracking-tight">8</div>
              <p className="text-[11px] text-neutral-500 font-medium mt-1">Original research</p>
            </div>

            <div className="flex flex-col gap-1 pl-6 lg:pl-12">
              <div className="flex items-center gap-2 text-neutral-500 mb-1">
                <BookOpen className="w-4 h-4 text-white" />
                <span className="text-[12px] font-bold uppercase tracking-widest text-white">Engineering Guides</span>
              </div>
              <div className="text-3xl font-medium text-white tracking-tight">12</div>
              <p className="text-[11px] text-neutral-500 font-medium mt-1">Continuously maintained</p>
            </div>

            <div className="flex flex-col gap-1 pl-6 lg:pl-12">
              <div className="flex items-center gap-2 text-neutral-500 mb-1">
                <Layers className="w-4 h-4 text-white" />
                <span className="text-[12px] font-bold uppercase tracking-widest text-white">Architecture Papers</span>
              </div>
              <div className="text-3xl font-medium text-white tracking-tight">4</div>
              <p className="text-[11px] text-neutral-500 font-medium mt-1">Peer reviewed internally</p>
            </div>

        </div>
      </div>
    </section>
  );
}
