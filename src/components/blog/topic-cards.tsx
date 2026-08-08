"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Shield, Terminal, Cpu, Zap, Code, Megaphone } from "lucide-react";
export interface Topic {
  title: string;
  iconName: string;
  articleCount: number;
  description: string;
}

// Map string icon names to actual Lucide components
const ICON_MAP: Record<string, React.ElementType> = {
  Shield,
  Terminal,
  Cpu,
  Zap,
  Code,
  Megaphone,
};

export function TopicCards({ topics }: { topics: Topic[] }) {
  return (
    <section className="w-full bg-[#050505] py-24 border-y border-white/[0.04] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-[radial-gradient(ellipse_at_bottom,rgba(99,102,241,0.05),transparent_70%)]" />
      </div>

      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 relative z-10">
        <h2 className="text-3xl font-medium tracking-tight text-white mb-12">
          Browse by Topic
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => {
            const IconComponent = ICON_MAP[topic.iconName] || Code;

            return (
              <Link 
                key={topic.title} 
                href={`/blog/category/${topic.title.toLowerCase().replace(/ /g, '-')}`}
                className="group flex flex-col p-8 bg-black border border-white/[0.06] rounded-2xl hover:bg-white/[0.02] hover:border-white/[0.1] transition-all duration-300"
              >
                <div className="w-12 h-12 bg-white/[0.03] border border-white/[0.05] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 group-hover:text-indigo-400 transition-all duration-300">
                  <IconComponent className="w-6 h-6 text-neutral-400 group-hover:text-indigo-400 transition-colors" />
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-medium text-white group-hover:text-indigo-50 transition-colors">
                    {topic.title}
                  </h3>
                  <span className="bg-white/[0.05] text-neutral-400 text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {topic.articleCount}
                  </span>
                </div>
                
                <p className="text-neutral-500 text-[14px] leading-[1.6] mb-8">
                  {topic.description}
                </p>

                <div className="flex items-center text-white font-semibold text-[13px] mt-auto group/btn">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
