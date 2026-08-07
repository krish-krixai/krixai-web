"use client";

import React, { useEffect, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TOCItem {
  id: string;
  label: string;
}

const TOC_ITEMS: TOCItem[] = [
  { id: "step-1", label: "1. Get an API Key" },
  { id: "step-2", label: "2. Install SDK" },
  { id: "step-3", label: "3. Initialize the Client" },
  { id: "step-4", label: "4. Scan Your First Prompt" },
  { id: "step-5", label: "5. Handle the Response" },
  { id: "step-6", label: "6. Forward Safe Requests" },
  { id: "best-practices", label: "Best Practices" },
  { id: "next-steps", label: "Next Steps" },
];

export function QuickstartLayout({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveId] = useState<string>("step-1");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${(totalScroll / windowHeight) * 100}`;
      setScrollProgress(Number(scroll));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle intersection observer for TOC
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    TOC_ITEMS.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-black">
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-indigo-500 z-50 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full flex pt-32 pb-24">
        
        {/* Main Content */}
        <div className="w-full lg:w-[70%] lg:pr-16 flex flex-col">
          {children}
        </div>

        {/* Sticky Table of Contents (Desktop only) */}
        <div className="hidden lg:block w-[30%]">
          <div className="sticky top-32 flex flex-col">
            <h4 className="text-[12px] font-semibold text-neutral-500 uppercase tracking-widest mb-6">
              On this page
            </h4>
            <nav className="flex flex-col space-y-3 border-l border-white/[0.08]">
              {TOC_ITEMS.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={cn(
                      "text-[14px] pl-4 transition-colors duration-200 border-l-[2px] -ml-[1px]",
                      isActive
                        ? "text-indigo-400 border-indigo-400 font-medium"
                        : "text-neutral-500 border-transparent hover:text-neutral-300"
                    )}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>

      </div>
    </div>
  );
}
