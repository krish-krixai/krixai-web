import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CATEGORIES, getArticlesByCategory, getCategoryById } from "@/data/research";
import type { CategoryId } from "@/data/research";
import { ArticleGrid } from "@/components/blog/article-grid";
import { ResearchCta } from "@/components/blog/research-cta";

const CATEGORY_COLOR: Record<string, string> = {
  blue: "text-blue-400",
  red: "text-red-400",
  emerald: "text-emerald-400",
  purple: "text-purple-400",
  amber: "text-amber-400",
};

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    category: cat.id,
  }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryId } = await params;
  const category = getCategoryById(categoryId as CategoryId);

  if (!category) {
    notFound();
  }

  const articles = getArticlesByCategory(category.id);
  const catColor = CATEGORY_COLOR[category.color] || "text-neutral-400";

  return (
    <main className="flex-1 w-full flex flex-col bg-[#0A0A0A] overflow-hidden">
      {/* Header */}
      <section className="relative w-full bg-[#0A0A0A] pt-32 pb-14 overflow-hidden border-b border-white/[0.04]">
        <div className="max-w-[85rem] mx-auto px-6 lg:px-12 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[12px] font-medium text-neutral-500 mb-10">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/research" className="hover:text-white transition-colors">Research</Link>
            <ChevronRight className="w-3 h-3" />
            <span className={catColor}>{category.name}</span>
          </nav>

          <h1 className={`text-4xl sm:text-5xl font-medium tracking-tight leading-[1.1] mb-4 ${catColor}`}>
            {category.name}
          </h1>
          <p className="text-neutral-400 text-base leading-[1.6] max-w-2xl mb-4">
            {category.description}
          </p>
          <span className="text-neutral-500 text-[13px] font-medium">
            {articles.length} {articles.length === 1 ? "article" : "articles"}
          </span>
        </div>
      </section>

      {/* Articles */}
      <div className="pt-12">
        <ArticleGrid articles={articles} />
      </div>

      {/* Explore CTA */}
      <ResearchCta />
    </main>
  );
}
