import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function QuickstartCTA() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 mt-16 border-t border-white/[0.08] text-center">
      <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-4">
        Need more examples?
      </h3>
      <p className="text-[15px] text-neutral-400 mb-8 max-w-md">
        Read the full API Reference for advanced integration scenarios, error handling, and webhooks.
      </p>
      <Link 
        href="/docs/api-reference"
        className="group flex items-center bg-white text-black px-6 py-3 rounded-full text-[13px] font-semibold hover:scale-[1.03] transition-all duration-300 shadow-[0_4px_14px_rgba(255,255,255,0.15)]"
      >
        Open API Docs
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
