"use client";
import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ResearchHero } from "@/components/blog/research-hero";
import { FeaturedArticle } from "@/components/blog/featured-article";
import { ArticleGrid } from "@/components/blog/article-grid";
import { CategoryCards } from "@/components/blog/category-cards";
import { ResearchCta } from "@/components/blog/research-cta";
import { ResearchOverview } from "@/components/blog/research-overview";
import { ResearchCollections } from "@/components/blog/research-collections";

import { ARTICLES, CATEGORIES } from "@/data/research";

export default function ResearchPage() {
  return (
    <Suspense fallback={<div className="flex-1 w-full bg-[#0A0A0A]" />}>
      <ResearchContent />
    </Suspense>
  );
}

function ResearchContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeDifficulty, setActiveDifficulty] = useState("All");

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      const matchesCategory =
        activeCategory === "All" || article.category === activeCategory;
      const matchesDifficulty =
        activeDifficulty === "All" || article.difficulty === activeDifficulty;

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        q === "" ||
        article.title.toLowerCase().includes(q) ||
        article.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        article.excerpt.toLowerCase().includes(q);

      return matchesCategory && matchesSearch && matchesDifficulty;
    });
  }, [searchQuery, activeCategory, activeDifficulty]);

  const isFiltering = searchQuery !== "" || activeCategory !== "All" || activeDifficulty !== "All";
  const featuredArticle = ARTICLES.find((a) => a.featured);

  return (
    <main className="flex-1 w-full flex flex-col bg-[#0A0A0A] overflow-hidden">
      {/* Hero */}
      <ResearchHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        activeDifficulty={activeDifficulty}
        setActiveDifficulty={setActiveDifficulty}
      />

      {/* Overview Metrics */}
      {!isFiltering && <ResearchOverview />}

      {/* Featured Collections */}
      {!isFiltering && <ResearchCollections />}

      {/* Featured Article */}
      {!isFiltering && featuredArticle && (
        <FeaturedArticle article={featuredArticle} />
      )}

      {/* Search Results Count */}
      {isFiltering && (
        <div className="w-full max-w-[85rem] mx-auto px-6 lg:px-12 mb-6">
          <span className="text-neutral-500 text-[13px] font-medium">
            {filteredArticles.length} {filteredArticles.length === 1 ? "result" : "results"}
          </span>
        </div>
      )}

      {/* Article Grid */}
      <ArticleGrid articles={isFiltering ? filteredArticles : filteredArticles.filter(a => !a.featured)} />

      {/* Categories */}
      {!isFiltering && (
        <CategoryCards categories={CATEGORIES} />
      )}

      {/* Explore CTA */}
      <ResearchCta />
    </main>
  );
}
