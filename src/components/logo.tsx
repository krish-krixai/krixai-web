import React from "react";
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
        <defs>
          <linearGradient id="krixai-standalone-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <g transform="translate(4, 0) skewX(-12)">
          {/* Stem */}
          <line x1="8" y1="4" x2="8" y2="28" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
          {/* Top Beam */}
          <line x1="15" y1="15" x2="26" y2="4" stroke="url(#krixai-standalone-gradient)" strokeWidth="6" strokeLinecap="round" />
          {/* Bottom Beam */}
          <line x1="15" y1="17" x2="26" y2="28" stroke="url(#krixai-standalone-gradient)" strokeWidth="6" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

export function LogoLockup({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <svg 
        viewBox="0 0 140 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full text-current"
      >
        <defs>
          <linearGradient id="krixai-lockup-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <mask id="text-slice">
            <rect x="0" y="0" width="140" height="32" fill="white" />
            {/* The laser slice representing deep packet inspection */}
            <line x1="40" y1="26" x2="140" y2="12" stroke="black" strokeWidth="1.2" />
          </mask>
        </defs>

        {/* ICON - The Kinetic Node */}
        <g transform="translate(6, 0) skewX(-12)">
          {/* Stem */}
          <line x1="8" y1="6" x2="8" y2="26" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
          {/* Top Beam */}
          <line x1="14" y1="15" x2="24" y2="6" stroke="url(#krixai-lockup-gradient)" strokeWidth="5.5" strokeLinecap="round" />
          {/* Bottom Beam */}
          <line x1="14" y1="17" x2="24" y2="26" stroke="url(#krixai-lockup-gradient)" strokeWidth="5.5" strokeLinecap="round" />
        </g>

        {/* WORDMARK - The Inspected Core */}
        <text 
          x="44" 
          y="24.5" 
          fontFamily="var(--font-geist-sans), Inter, system-ui, sans-serif" 
          fontWeight="800" 
          fontSize="23" 
          fill="currentColor" 
          letterSpacing="-0.03em"
          mask="url(#text-slice)"
        >
          KRIXAI
        </text>
      </svg>
    </div>
  );
}
