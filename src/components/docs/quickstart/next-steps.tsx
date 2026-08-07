import React from "react";
import Link from "next/link";
import { Key, Book, Code2, AlertTriangle, SlidersHorizontal, ArrowRight } from "lucide-react";

export function NextSteps() {
  const links = [
    { title: "Authentication", icon: Key, href: "/docs/api-reference#authentication" },
    { title: "API Reference", icon: Book, href: "/docs/api-reference" },
    { title: "SDKs", icon: Code2, href: "/docs/api-reference#code-examples" },
    { title: "Attack Categories", icon: AlertTriangle, href: "#", disabled: true },
    { title: "Policies", icon: SlidersHorizontal, href: "#", disabled: true },
  ];

  return (
    <div id="next-steps" className="flex flex-col pt-16 pb-12 border-t border-white/[0.08] scroll-mt-24">
      <h2 className="text-2xl font-semibold text-white mb-2">Next Steps</h2>
      <p className="text-[15px] text-neutral-400 leading-relaxed mb-6">
        Dive deeper into the platform capabilities or explore our comprehensive API documentation.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {links.map((link, i) => {
          const Icon = link.icon;
          return link.disabled ? (
            <div 
              key={i} 
              className="group flex items-center justify-between p-4 rounded-xl bg-[#050505] border border-white/[0.05] opacity-50 cursor-not-allowed transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4 text-neutral-400" />
                <span className="text-[14px] font-medium text-neutral-300">
                  {link.title} <span className="text-[10px] text-neutral-500 ml-1">(Coming Soon)</span>
                </span>
              </div>
            </div>
          ) : (
            <Link 
              key={i} 
              href={link.href}
              className="group flex items-center justify-between p-4 rounded-xl bg-[#050505] border border-white/[0.05] hover:bg-white/[0.03] hover:border-white/[0.1] transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                <span className="text-[14px] font-medium text-neutral-300 group-hover:text-white transition-colors">
                  {link.title}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
