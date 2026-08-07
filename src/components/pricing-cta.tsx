import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PricingCTA() {
  return (
    <section className="relative w-full bg-black py-24 lg:py-32 overflow-hidden flex flex-col items-center border-t border-white/[0.04]">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full relative z-10 flex flex-col items-center justify-center text-center">
        
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white text-balance leading-[1.1] mb-6">
          Ready to secure your AI product?
        </h2>
        <p className="text-lg lg:text-[19px] text-neutral-400 max-w-2xl leading-[1.6] font-normal tracking-wide mb-12">
          The fastest way to add runtime security to your LLM application. No long onboarding. No sales call required.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center w-full sm:w-auto">
          <Link 
            href="/dashboard"
            className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-3.5 rounded-full text-[14px] font-semibold transition-all duration-300 shadow-[0_4px_14px_rgba(99,102,241,0.3)] flex items-center justify-center"
          >
            Get Started
          </Link>
          <Link 
            href="/contact"
            className="w-full sm:w-auto bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] text-white px-8 py-3.5 rounded-full text-[14px] font-medium transition-all duration-300 flex items-center justify-center group"
          >
            <span>Contact Sales</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
