import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Calendar, Clock, User, Shield, CheckCircle2, Activity, Layers } from "lucide-react";
import { ARTICLES, getCategoryById, getCategoryName } from "@/data/research";
import { ResearchCta } from "@/components/blog/research-cta";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { SocialShare } from "@/components/blog/social-share";
import { RelatedArticles } from "@/components/blog/related-articles";

const DIFFICULTY_STYLE: Record<string, string> = {
  Beginner: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20",
  Intermediate: "text-amber-400 bg-amber-500/10 border border-amber-500/20",
  Advanced: "text-red-400 bg-red-500/10 border border-red-500/20",
};

const CATEGORY_COLOR: Record<string, string> = {
  blue: "text-blue-400",
  red: "text-red-400",
  emerald: "text-emerald-400",
  purple: "text-purple-400",
  amber: "text-amber-400",
};

export async function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/research/${slug}` }
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const category = getCategoryById(article.category);
  const catColor = category ? CATEGORY_COLOR[category.color] : "text-neutral-400";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.krixaisecurity.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Research",
        "item": "https://www.krixaisecurity.com/research"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": getCategoryName(article.category),
        "item": `https://www.krixaisecurity.com/research/category/${article.category}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": article.title,
        "item": `https://www.krixaisecurity.com/research/${article.slug}`
      }
    ]
  };

  return (
    <main className="flex-1 w-full flex flex-col bg-black relative selection:bg-white/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />

      {/* Header - Obsidian Black */}
      <section className="w-full bg-black">
        <div className="max-w-[85rem] mx-auto px-6 lg:px-12 pt-32 pb-16 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[12px] font-medium text-neutral-500 mb-12">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-neutral-700" />
            <Link href="/research" className="hover:text-white transition-colors">Research</Link>
            <ChevronRight className="w-3 h-3 text-neutral-700" />
            <Link href={`/research/category/${article.category}`} className={`hover:text-white transition-colors ${catColor}`}>
              {getCategoryName(article.category)}
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-700" />
            <span className="text-neutral-400 truncate max-w-[200px] sm:max-w-none">{article.title}</span>
          </nav>

          <div className="flex flex-col gap-6 max-w-4xl">
            {/* Category + Difficulty */}
            <div className="flex items-center gap-3">
              <span className={`text-[11px] font-bold tracking-[0.2em] uppercase ${catColor}`}>
                {getCategoryName(article.category)}
              </span>
              <span className={`text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded-md ${DIFFICULTY_STYLE[article.difficulty]}`}>
                {article.difficulty}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-medium tracking-tight text-white leading-[1.15] text-balance">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg lg:text-xl text-neutral-400 leading-[1.6] max-w-3xl">
              {article.excerpt}
            </p>

            {/* Meta */}
            <div className="flex flex-col border-b border-white/[0.04] pb-8 mb-8">
              <h3 className="text-white font-medium text-[15px] mb-4">Metadata</h3>
              <div className="flex flex-col gap-3 text-[13px] text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 w-20">Published</span>
                  <span className="text-neutral-300 font-medium">{article.publishDate}</span>
                </div>
                {article.lastUpdated && (
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500 w-20">Updated</span>
                    <span className="text-neutral-300 font-medium">{article.lastUpdated}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 w-20">Difficulty</span>
                  <span className="text-emerald-400 font-medium">{article.difficulty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 w-20">Time</span>
                  <span className="text-neutral-300 font-medium">{article.readingTime}</span>
                </div>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-col border-b border-white/[0.04] pb-8 mb-8">
              <h3 className="text-white font-medium text-[15px] mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-neutral-400" />
                Verification
              </h3>
              <div className="flex flex-col gap-3">
                {article.reviewedBy && (
                  <div className="flex items-start gap-2 bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-[12px] font-semibold text-white">Peer Reviewed</span>
                      <span className="text-[11px] text-neutral-500 leading-tight">{article.reviewedBy}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2 bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-lg">
                  <Activity className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold text-white">Runtime Tested</span>
                    <span className="text-[11px] text-neutral-500 leading-tight">Verified against live models</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-lg">
                  <Layers className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold text-white">Enterprise Ready</span>
                    <span className="text-[11px] text-neutral-500 leading-tight">Production architecture</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Area - Deep Graphite Background */}
      <section className="w-full bg-[#0A0A0A] py-16 lg:py-24 relative z-10 border-t border-white/[0.02]">
        <div className="max-w-[85rem] mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            
            {/* Sidebar TOC */}
            <aside className="w-full lg:w-[220px] shrink-0 sticky top-32 hidden lg:block">
              <TableOfContents sections={article.sections || []} />
            </aside>

            {/* Main Content - Editorial Charcoal Reading Surface */}
            <article className="flex-1 max-w-[680px] bg-[#111111] p-8 lg:p-16 rounded-2xl border border-white/[0.03] shadow-2xl mx-auto lg:mx-0">
              {article.sections?.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-32 mb-20 last:mb-0">
                  <h2 className="text-2xl lg:text-[1.85rem] font-medium tracking-tight text-neutral-100 mb-8 leading-[1.3] mt-10">
                    {section.title}
                  </h2>
                  <div className="flex flex-col gap-8 text-[16px] lg:text-[1.125rem] leading-[1.9] text-neutral-300 font-normal">
                    {section.content.map((paragraph, i) => (
                      <p key={i} className="text-justify-none">{paragraph}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Subtle CTA at article end */}
              <div className="mt-20 pt-10 border-t border-white/[0.04]">
                <p className="text-neutral-300 text-[15px] leading-[1.6] mb-5 font-medium">
                  Protect your AI application with the Krixai Runtime Firewall.
                </p>
                <div className="flex items-center gap-4">
                  <Link
                    href="/contact"
                    className="text-black text-[13px] font-semibold bg-white border border-transparent px-5 py-2.5 rounded-lg hover:bg-neutral-200 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all"
                  >
                    Request a Demo
                  </Link>
                  <Link
                    href="/research"
                    className="text-neutral-400 text-[13px] font-medium hover:text-white transition-colors"
                  >
                    Read More Research →
                  </Link>
                </div>
              </div>

              <div className="mt-12">
                <SocialShare url={`/research/${article.slug}`} title={article.title} />
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Related Articles - Back to Obsidian Black */}
      <div className="bg-black pt-24 pb-12">
        <RelatedArticles currentArticle={article} />
      </div>

      {/* Explore CTA */}
      <ResearchCta />
    </main>
  );
}
