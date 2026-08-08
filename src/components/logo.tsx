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
  const rawMaskId = useId();
  const maskId = rawMaskId.replace(/:/g, "");
  
  return (
    <div className={cn("relative flex items-center", className)}>
      <svg 
        viewBox="0 0 140 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full text-current"
      >
        <defs>
          <mask id={maskId}>
            <rect x="0" y="0" width="140" height="32" fill="white" />
            {/* The laser slice representing deep packet inspection */}
            <line x1="30" y1="28" x2="140" y2="10" stroke="black" strokeWidth="1.5" />
          </mask>
        </defs>

        {/* ICON - The Kinetic Node */}
        <g transform="translate(6, 0) skewX(-12)">
          {/* Stem */}
          <line x1="8" y1="6" x2="8" y2="26" stroke="currentColor" strokeWidth="1.8" />
          {/* Chevron */}
          <line x1="12" y1="16" x2="22" y2="6" stroke="#00D4FF" strokeWidth="1.8" strokeLinecap="square" />
          <line x1="12" y1="16" x2="22" y2="26" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="square" />
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
          mask={`url(#${maskId})`}
        >
          KRIXAI
        </text>
      </svg>
    </div>
  );
}
