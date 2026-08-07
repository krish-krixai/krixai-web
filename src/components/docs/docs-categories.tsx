import React from "react";
import Link from "next/link";
import { Zap, Book, Code2, Key, Shield, AlertTriangle, SlidersHorizontal, FileJson, Clock } from "lucide-react";

export function DocsCategories() {
  const categories = [
    {
      title: "Quick Start",
      description: "Learn the basics in under 5 minutes.",
      icon: Zap,
      href: "/docs/quickstart"
    },
    {
      title: "API Reference",
      description: "Complete REST API documentation.",
      icon: Book,
      href: "/docs/api-reference"
    },
    {
      title: "SDKs",
      description: "Python, Node.js and REST examples.",
      icon: Code2,
      href: "/docs/api-reference#code-examples"
    },
    {
      title: "Authentication",
      description: "API keys and authorization.",
      icon: Key,
      href: "/docs/api-reference#authentication"
    },
    {
      title: "Security Concepts",
      description: "Understand krixai's security model. (Coming Soon)",
      icon: Shield,
      href: "#",
      disabled: true
    },
    {
      title: "Attack Categories",
      description: "Every attack krixai detects. (Coming Soon)",
      icon: AlertTriangle,
      href: "#",
      disabled: true
    },
    {
      title: "Policies",
      description: "BLOCK • WARN • ALLOW (Coming Soon)",
      icon: SlidersHorizontal,
      href: "#",
      disabled: true
    },
    {
      title: "Examples",
      description: "Production-ready integration samples. (Coming Soon)",
      icon: FileJson,
      href: "#",
      disabled: true
    },
    {
      title: "Changelog",
      description: "Latest platform updates. (Coming Soon)",
      icon: Clock,
      href: "#",
      disabled: true
    }
  ];

  return (
    <section className="relative w-full bg-black py-20 lg:py-32 border-t border-white/[0.04] overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full relative z-10 flex flex-col">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              cat.disabled ? (
                <div
                  key={idx}
                  className="group relative flex flex-col p-6 rounded-2xl bg-[#050505] border border-white/[0.05] opacity-50 cursor-not-allowed transition-all duration-300 ease-out"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-neutral-400" />
                    </div>
                    <h3 className="text-[16px] font-semibold text-white tracking-wide">
                      {cat.title}
                    </h3>
                  </div>
                  <p className="text-[14px] text-neutral-400 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              ) : (
                <Link
                  key={idx}
                  href={cat.href}
                  className="group relative flex flex-col p-6 rounded-2xl bg-[#050505] border border-white/[0.05] hover:bg-[#080808] hover:border-white/[0.1] transition-all duration-300 ease-out"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all duration-300">
                      <Icon className="w-4 h-4 text-neutral-400 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <h3 className="text-[16px] font-semibold text-white tracking-wide group-hover:text-indigo-300 transition-colors">
                      {cat.title}
                    </h3>
                  </div>
                  <p className="text-[14px] text-neutral-400 leading-relaxed group-hover:text-neutral-300 transition-colors">
                    {cat.description}
                  </p>
                </Link>
              )
            );
          })}
        </div>

      </div>
    </section>
  );
}
