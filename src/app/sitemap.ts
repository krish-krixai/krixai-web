import { MetadataRoute } from "next";
import { ARTICLES as RESEARCH_ARTICLES, CATEGORIES as RESEARCH_CATEGORIES } from "@/data/research";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.krixaisecurity.com";

  // Public static routes
  const staticRoutes = [
    "",
    "/company",
    "/contact",
    "/playground",
    "/pricing",
    "/privacy",
    "/product",
    "/research",
    "/security",
    "/terms",
    "/auth/sign-in",
    "/auth/sign-up",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Research articles
  const researchRoutes = RESEARCH_ARTICLES.map((article) => ({
    url: `${baseUrl}/research/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Research categories
  const researchCategories = RESEARCH_CATEGORIES.map((category) => ({
    url: `${baseUrl}/research/category/${category.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...researchRoutes, ...researchCategories];
}
