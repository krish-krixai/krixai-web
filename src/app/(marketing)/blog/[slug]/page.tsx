import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { ARTICLES } from "@/data/blog";
import { NewsletterSignup } from "@/components/blog/newsletter-signup";

export async function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const CATEGORY_COLORS: Record<string, string> = {
    "Threat Intel": "#EF4444",
    "Engineering": "#3B82F6",
    "Product": "#10B981"
  };

  return (
    <div className="min-h-screen bg-[#000000] pt-32 pb-24 px-6">
      <div className="max-w-[720px] mx-auto">
        
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-[#94A3B8] hover:text-white transition-colors text-sm font-medium mb-12"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span 
              className="inline-block uppercase text-[12px] font-bold tracking-widest px-3 py-1.5 rounded-full" 
              style={{ backgroundColor: CATEGORY_COLORS[article.category] + '20', color: CATEGORY_COLORS[article.category] }}
            >
              {article.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-[40px] font-extrabold text-[#FFFFFF] mb-6 leading-[1.2] font-sans tracking-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-6 text-[#64748B] text-[14px]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{article.publishDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{article.readingTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white">
                {article.author.charAt(0)}
              </div>
              <span className="text-white/80">{article.author}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <article className="prose prose-invert prose-lg max-w-none mb-24">
          {article.sections.map((section, idx) => (
            <div key={section.id} className="mb-12">
              {idx > 0 && <h2 className="text-2xl font-bold text-white mb-6 mt-12">{section.title}</h2>}
              {idx === 0 && <p className="text-xl text-white/90 leading-[1.8] font-medium mb-8">{section.title}</p>}
              
              <div className="space-y-6 text-[#94A3B8] text-[18px] leading-[1.8] font-sans font-normal">
                {section.content.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>

              {section.codeSnippet && (
                <div className="mt-8 mb-4 rounded-[12px] overflow-hidden border border-white/10 bg-[#111827]">
                  <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5 flex items-center justify-between text-xs text-neutral-400 font-mono">
                    <span>{section.language === 'json' ? 'response.json' : section.language === 'python' ? 'main.py' : 'terminal'}</span>
                    <span className="uppercase">{section.language}</span>
                  </div>
                  <pre className="p-6 text-sm font-mono text-[#E2E8F0] overflow-x-auto">
                    <code>{section.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </article>

        {/* Divider */}
        <hr className="border-white/10 mb-16" />

        {/* Newsletter Footer */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-3">Liked this post?</h3>
          <p className="text-[#94A3B8]">Join the Krixai Threat Brief for more security research.</p>
        </div>
        <NewsletterSignup />

      </div>
    </div>
  );
}
