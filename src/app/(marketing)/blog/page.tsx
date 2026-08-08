"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ARTICLES } from "@/data/blog";
import { BlogCard } from "@/components/blog/blog-card";
import { NewsletterSignup } from "@/components/blog/newsletter-signup";
import { motion } from "framer-motion";
import { clsx } from "clsx";

const CATEGORY_COLORS = {
  "Threat Intel": "bg-[#EF4444]",
  "Engineering": "bg-[#3B82F6]",
  "Product": "bg-[#10B981]"
};

export default function BlogIndexPage() {
  const [filter, setFilter] = useState<"All" | "Threat Intel" | "Engineering" | "Product">("All");

  const featuredPost = ARTICLES.find(a => a.featured);
  const otherPosts = ARTICLES.filter(a => !a.featured && (filter === "All" || a.category === filter));

  return (
    <div className="min-h-screen bg-[#000000] pt-32 pb-24 px-6 font-sans">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight">Krixai Blog</h1>
          <p className="text-xl text-[#94A3B8] max-w-2xl leading-relaxed">
            Research, threats, and product updates from the Krixai security team.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          {["All", "Threat Intel", "Engineering", "Product"].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category as any)}
              className={clsx(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                filter === category 
                  ? "bg-white/10 text-white border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]" 
                  : "bg-transparent text-[#94A3B8] border-transparent hover:text-white hover:bg-white/5"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Post (only show if 'All' or matches filter) */}
        {featuredPost && (filter === "All" || filter === featuredPost.category) && (
          <Link 
            href={`/blog/${featuredPost.slug}`}
            className="group block relative overflow-hidden rounded-[24px] border border-white/10 bg-[#111827] mb-12 hover:border-[#8B5CF6]/40 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="p-8 md:p-12 md:w-2/3 relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-block uppercase text-[12px] font-bold tracking-widest text-white/90 px-3 py-1.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[featuredPost.category] + '40', color: CATEGORY_COLORS[featuredPost.category] }}>
                  {featuredPost.category}
                </span>
                <span className="text-[#64748B] text-[14px]">{featuredPost.publishDate}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-[#8B5CF6] transition-colors font-sans">
                {featuredPost.title}
              </h2>
              <p className="text-lg text-[#94A3B8] mb-8 leading-relaxed max-w-xl">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-2 text-white font-medium">
                Read article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            {/* Abstract visual for featured post */}
            <div className="hidden md:block absolute top-0 right-0 bottom-0 w-1/3 overflow-hidden">
              <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#8B5CF6]/10 blur-[100px] rounded-full group-hover:bg-[#8B5CF6]/20 transition-colors duration-700" />
              <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-64 h-64 border border-white/5 rounded-full rotate-45 group-hover:rotate-90 transition-transform duration-1000 ease-in-out" />
              <div className="absolute right-10 top-1/2 -translate-y-1/2 w-48 h-48 border border-[#8B5CF6]/10 rounded-full -rotate-45 group-hover:-rotate-90 transition-transform duration-1000 ease-in-out" />
            </div>
          </Link>
        )}

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {otherPosts.map((post, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={post.slug}
            >
              <BlogCard article={post} />
            </motion.div>
          ))}
        </div>

        {/* Newsletter */}
        <NewsletterSignup />
        
      </div>
    </div>
  );
}
