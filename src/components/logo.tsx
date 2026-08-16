import React, { useId } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-current"
      >
        <g transform="translate(4, 0) skewX(-12)">
          {/* Stem */}
          <line x1="8" y1="4" x2="8" y2="28" stroke="currentColor" strokeWidth="1.8" />
          {/* Chevron */}
          <line x1="12" y1="16" x2="22" y2="6" stroke="#00D4FF" strokeWidth="1.8" strokeLinecap="square" />
          <line x1="12" y1="16" x2="22" y2="26" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="square" />
        </g>
      </svg>
    </div>
  );
}

export function LogoLockup({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center gap-1.5", className)}>
      <svg 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-full w-auto text-current"
      >
        <g transform="translate(4, 0) skewX(-12)">
          <line x1="8" y1="4" x2="8" y2="28" stroke="currentColor" strokeWidth="2" />
          <line x1="12" y1="16" x2="22" y2="6" stroke="#00D4FF" strokeWidth="2" strokeLinecap="square" />
          <line x1="12" y1="16" x2="22" y2="26" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="square" />
        </g>
      </svg>
      <span className="font-sans font-extrabold text-[23px] tracking-tight text-current mt-[2px]">
        KRIXAI
      </span>
    </div>
  );
}
