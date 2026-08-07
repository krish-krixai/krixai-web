import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export function DocsHero() {
  return (
    <section className="relative w-full pt-32 lg:pt-40 pb-20 bg-black overflow-hidden flex flex-col justify-center items-center text-center">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] bg-indigo-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full relative z-10 flex flex-col items-center">
        
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span className="text-[12px] font-medium text-indigo-400 uppercase tracking-wider">Developer Documentation</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] font-medium tracking-tight text-white leading-[1.1] mb-6 max-w-4xl text-balance">
          Everything you need to integrate krixai.
        </h1>
        
        <p className="text-lg lg:text-[19px] text-neutral-400 max-w-2xl leading-[1.6] font-normal tracking-wide mb-10">
          Protect your AI applications in minutes using our API, SDKs and runtime security platform.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link 
            href="/docs/quickstart"
            className="w-full sm:w-auto bg-white text-black px-8 py-3.5 rounded-full text-[14px] font-semibold hover:scale-[1.03] transition-all duration-300 shadow-[0_4px_14px_rgba(255,255,255,0.15)] flex items-center justify-center"
          >
            Quick Start
          </Link>
          <Link 
            href="/docs/api-reference"
            className="w-full sm:w-auto bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] text-white px-8 py-3.5 rounded-full text-[14px] font-medium transition-all duration-300 flex items-center justify-center group"
          >
            <span>API Reference</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
