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
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-current"
      >
        <mask id="m1-icon-standalone">
          <rect x="-10" y="-10" width="40" height="40" fill="white"/>
          <line x1="9" y1="-5" x2="9" y2="25" stroke="black" strokeWidth="1.5"/>
        </mask>
        <g mask="url(#m1-icon-standalone)" stroke="currentColor" strokeWidth="3.2" strokeLinecap="butt">
          <line x1="4" y1="2" x2="4" y2="20" />
          <line x1="4" y1="11" x2="15" y2="2" />
          <line x1="4" y1="11" x2="15" y2="20" />
        </g>
        <line x1="9" y1="1" x2="9" y2="21" stroke="#2563EB" strokeWidth="1"/>
      </svg>
    </div>
  );
}

export function LogoLockup({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg viewBox="0 0 96 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-current">
        {/* ICON */}
        <g id="r1-icon-lockup">
          <mask id="m1-icon-lockup">
            <rect x="-10" y="-10" width="40" height="40" fill="white"/>
            <line x1="9" y1="-5" x2="9" y2="25" stroke="black" strokeWidth="1.5"/>
          </mask>
          <g mask="url(#m1-icon-lockup)" stroke="currentColor" strokeWidth="3.2" strokeLinecap="butt">
            <line x1="4" y1="2" x2="4" y2="20" />
            <line x1="4" y1="11" x2="15" y2="2" />
            <line x1="4" y1="11" x2="15" y2="20" />
          </g>
          <line x1="9" y1="1" x2="9" y2="21" stroke="#2563EB" strokeWidth="1"/>
        </g>
        
        {/* WORDMARK */}
        <g transform="translate(32, 2)">
          <mask id="m1-wm-lockup">
            <rect x="0" y="-10" width="100" height="40" fill="white"/>
            <line x1="4.5" y1="-5" x2="4.5" y2="25" stroke="black" strokeWidth="1.2"/>
            <line x1="37.5" y1="-5" x2="37.5" y2="25" stroke="black" strokeWidth="1.2"/>
          </mask>
          <g mask="url(#m1-wm-lockup)" stroke="currentColor" strokeWidth="2.2" strokeLinecap="butt" strokeLinejoin="miter" fill="none">
            <line x1="2" y1="1" x2="2" y2="19"/>
            <line x1="2" y1="12" x2="9" y2="5"/>
            <line x1="4.5" y1="9.5" x2="10" y2="19"/>
            
            <line x1="16" y1="6" x2="16" y2="19"/>
            <path d="M 16 9.5 Q 18.5 6 22 6" strokeLinecap="square"/>
            
            <line x1="27" y1="6" x2="27" y2="19"/>
            <line x1="27" y1="1.5" x2="27" y2="2.5" strokeLinecap="square"/>
            
            <line x1="33" y1="6" x2="42" y2="19"/>
            <line x1="42" y1="6" x2="33" y2="19"/>
            
            <path d="M 54 6 L 54 19" />
            <circle cx="49" cy="12.5" r="3.7" />
            
            <line x1="60" y1="6" x2="60" y2="19"/>
            <line x1="60" y1="1.5" x2="60" y2="2.5" strokeLinecap="square"/>
          </g>
          <line x1="4.5" y1="1" x2="4.5" y2="19" stroke="#2563EB" strokeWidth="0.8"/>
          <line x1="37.5" y1="6" x2="37.5" y2="19" stroke="#2563EB" strokeWidth="0.8"/>
        </g>
      </svg>
    </div>
  );
}
