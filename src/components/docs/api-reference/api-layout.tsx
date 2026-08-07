"use client";

import React, { useEffect, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LEFT_NAV_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "authentication", label: "Authentication" },
  { id: "base-url", label: "Base URL" },
  { id: "post-scan", label: "POST /scan" },
  { id: "request-body", label: "Request Body" },
  { id: "response", label: "Response" },
  { id: "field-reference", label: "Field Reference" },
  { id: "status-codes", label: "HTTP Status Codes" },
  { id: "rate-limits", label: "Rate Limits" },
  { id: "code-examples", label: "Code Examples" },
  { id: "sdk-examples", label: "SDK Examples" },
  { id: "errors", label: "Errors" },
];

const RIGHT_TOC_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "authentication", label: "Authentication" },
  { id: "post-scan", label: "POST /scan" },
  { id: "request-body", label: "Request" },
  { id: "response", label: "Response" },
  { id: "field-reference", label: "Fields" },
  { id: "errors", label: "Errors" },
  { id: "rate-limits", label: "Rate Limits" },
  { id: "code-examples", label: "Examples" },
];

export function ApiLayout({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveId] = useState<string>("overview");

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

    LEFT_NAV_ITEMS.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-black">
      <div className="max-w-[100rem] mx-auto px-6 lg:px-12 w-full flex pt-32 pb-24">
        
        {/* LEFT SIDEBAR (API Navigation) */}
        <div className="hidden lg:block w-[20%] pr-8 xl:pr-12 border-r border-white/[0.04]">
          <div className="sticky top-32 flex flex-col">
            <h4 className="text-[12px] font-semibold text-neutral-500 uppercase tracking-widest mb-6">
              API Reference
            </h4>
            <nav className="flex flex-col space-y-3">
              {LEFT_NAV_ITEMS.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={cn(
                      "text-[14px] transition-colors duration-200",
                      isActive
                        ? "text-indigo-400 font-medium"
                        : "text-neutral-500 hover:text-neutral-300"
                    )}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>

        {/* CENTER COLUMN (Documentation Content) */}
        <div className="w-full lg:w-[60%] lg:px-12 xl:px-16 flex flex-col min-h-screen">
          {children}
        </div>

        {/* RIGHT SIDEBAR (Sticky TOC) */}
        <div className="hidden lg:block w-[20%] pl-8 xl:pl-12 border-l border-white/[0.04]">
          <div className="sticky top-32 flex flex-col">
            <h4 className="text-[12px] font-semibold text-neutral-500 uppercase tracking-widest mb-6">
              On this page
            </h4>
            <nav className="flex flex-col space-y-3 border-l border-white/[0.08]">
              {RIGHT_TOC_ITEMS.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={cn(
                      "text-[13px] pl-4 transition-colors duration-200 border-l-[2px] -ml-[1px]",
                      isActive
                        ? "text-white border-white font-medium"
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
