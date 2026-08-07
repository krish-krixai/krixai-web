import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function ApiBottomNav() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full pt-16 pb-12 mt-8 border-t border-white/[0.08] gap-4">
      
      {/* Previous */}
      <Link 
        href="/docs/quickstart" 
        className="w-full sm:w-1/2 group flex flex-col p-6 rounded-xl bg-[#050505] border border-white/[0.05] hover:bg-white/[0.02] hover:border-white/[0.1] transition-all duration-200"
      >
        <span className="text-[12px] font-semibold text-neutral-500 uppercase tracking-widest mb-2 flex items-center">
          <ArrowLeft className="w-3.5 h-3.5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Previous
        </span>
        <span className="text-[16px] font-medium text-white group-hover:text-indigo-300 transition-colors">
          Quick Start
        </span>
      </Link>

      {/* Next (Disabled for now) */}
      <div 
        className="w-full sm:w-1/2 group flex flex-col items-end text-right p-6 rounded-xl bg-[#050505] border border-white/[0.05] opacity-50 cursor-not-allowed"
      >
        <span className="text-[12px] font-semibold text-neutral-500 uppercase tracking-widest mb-2 flex items-center justify-end">
          Next
          <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
        </span>
        <span className="text-[16px] font-medium text-white group-hover:text-indigo-300 transition-colors">
          Python SDK
        </span>
      </div>

    </div>
  );
}
