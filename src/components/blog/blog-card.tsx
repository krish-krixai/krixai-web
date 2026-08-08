import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/data/blog";

const CATEGORY_COLORS = {
  "Threat Intel": "bg-[#EF4444]",
  "Engineering": "bg-[#3B82F6]",
  "Product": "bg-[#10B981]"
};

export const BlogCard = ({ article }: { article: Article }) => {
  return (
    <Link 
      href={`/blog/${article.slug}`}
      className="group block bg-[#111827] border border-white/5 hover:border-[#8B5CF6]/50 rounded-[16px] p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.1)] hover:-translate-y-1"
    >
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <span className="inline-block uppercase text-[10px] font-bold tracking-widest text-white/80 px-2.5 py-1 rounded-full mb-3" style={{ backgroundColor: CATEGORY_COLORS[article.category] + '40', color: CATEGORY_COLORS[article.category] }}>
            {article.category}
          </span>
          <h3 className="text-[20px] font-semibold text-white leading-tight font-sans mb-3 group-hover:text-[#8B5CF6] transition-colors">
            {article.title}
          </h3>
          <p className="text-[#94A3B8] text-sm line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
        
        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[14px] text-[#64748B]">
            <span>{article.publishDate}</span>
            <span className="w-1 h-1 rounded-full bg-[#64748B]"></span>
            <span>{article.readingTime}</span>
          </div>
          <div className="flex items-center gap-1 text-[#8B5CF6] text-sm font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
            Read <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};
