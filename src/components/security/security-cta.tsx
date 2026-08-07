import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SecurityCTA() {
  return (
    <section className="relative w-full bg-black py-32 lg:py-48 overflow-hidden flex flex-col items-center border-t border-white/[0.04]">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[300px] bg-indigo-500/10 blur-[120px] pointer-events-none" />
      
      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full relative z-10 flex flex-col items-center justify-center text-center">
        
        <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-medium tracking-tight text-white text-balance leading-[1.1] mb-6">
          Ready to secure every prompt?
        </h2>
        <p className="text-lg lg:text-[21px] text-neutral-400 max-w-2xl leading-[1.6] font-normal tracking-wide mb-12">
          Start protecting your AI application in minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center w-full sm:w-auto">
          <Link 
            href="/pricing"
            className="w-full sm:w-auto bg-white hover:bg-neutral-200 text-black px-8 py-3.5 rounded-full text-[14px] font-semibold transition-all duration-300 shadow-[0_4px_14px_rgba(255,255,255,0.1)] flex items-center justify-center"
          >
            Get Started
          </Link>
          <Link 
            href="/contact"
            className="w-full sm:w-auto bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] text-white px-8 py-3.5 rounded-full text-[14px] font-medium transition-all duration-300 flex items-center justify-center group"
          >
            <span>Book Demo</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
