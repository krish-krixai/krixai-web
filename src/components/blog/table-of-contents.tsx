"use client";

import React, { useEffect, useState } from "react";
import type { ArticleSection } from "@/data/research";

export function TableOfContents({ sections }: { sections: ArticleSection[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -66% 0px" } // trigger when near top of screen
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  if (!sections.length) return null;

  return (
    <div className="flex flex-col gap-4 relative">
      {/* Decorative Line */}
      <div className="absolute left-0 top-1 bottom-1 w-px bg-white/[0.04]" />

      <h3 className="text-white font-medium text-[15px] mb-2 pl-4">On this page</h3>
      
      <ul className="flex flex-col gap-3">
        {sections.map((section) => {
          const isActive = activeId === section.id;
          return (
            <li key={section.id} className="relative">
              {isActive && (
                <div className="absolute left-[-1px] top-1 bottom-1 w-[2px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              )}
              <a
                href={`#${section.id}`}
                className={`block pl-4 text-[14px] transition-colors duration-300 ${
                  isActive ? "text-white font-medium" : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {section.title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
