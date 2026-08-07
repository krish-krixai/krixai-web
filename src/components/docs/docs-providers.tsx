import React from "react";
import { MarqueeItems } from "@/components/marquee-logos";

export function DocsProviders() {
  return (
    <section className="relative w-full bg-black py-20 overflow-hidden border-t border-white/[0.04]">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[100px] bg-indigo-500/5 blur-[80px] pointer-events-none" />

      <div className="w-full max-w-[90rem] mx-auto relative z-10 flex flex-col items-center">
        
        <h2 className="text-[12px] font-semibold text-neutral-500 uppercase tracking-[0.25em] mb-10 text-center px-4">
          Works with your AI stack
        </h2>

        {/* Infinite Scroll Container */}
        <div className="relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            <div className="flex items-center gap-10 md:gap-12 pr-10 md:pr-12">
              <MarqueeItems />
              <MarqueeItems />
            </div>
            <div className="flex items-center gap-10 md:gap-12 pr-10 md:pr-12">
              <MarqueeItems />
              <MarqueeItems />
            </div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 80s linear infinite;
        }
      `}} />
    </section>
  );
}
