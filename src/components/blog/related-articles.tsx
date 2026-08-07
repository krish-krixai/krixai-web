import Link from "next/link";
import { ArrowRight, FileText, BookOpen, FileCode } from "lucide-react";
import type { Article } from "@/data/research";
import { getRelatedArticles } from "@/data/research";

export function RelatedArticles({ currentArticle }: { currentArticle: Article }) {
  const related = getRelatedArticles(currentArticle, 3);

  if (related.length === 0) return null;

  return (
    <section className="w-full mt-16 pt-16 border-t border-white/[0.04]">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-[14px] font-bold tracking-[0.2em] uppercase text-white">Connected Knowledge Base</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/[0.08] to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* We will show 2 related articles, and 1 docs link */}
        {related.slice(0, 2).map((article) => (
          <Link
            key={article.slug}
            href={`/research/${article.slug}`}
            className="group flex flex-col p-6 bg-[#161616] border border-white/[0.04] rounded-xl hover:border-white/[0.1] transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-neutral-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Research Article</span>
            </div>
            <h3 className="text-white font-medium text-[16px] mb-3 group-hover:text-neutral-200 transition-colors leading-[1.4]">
              {article.title}
            </h3>
            <p className="text-neutral-500 text-[13px] leading-[1.6] line-clamp-2 mt-auto">
              {article.excerpt}
            </p>
          </Link>
        ))}

        {/* Engineering Docs CTA */}
        <Link
          href="/docs"
          className="group flex flex-col p-6 bg-gradient-to-br from-[#111111] to-[#0A0A0A] border border-white/[0.04] rounded-xl hover:border-white/[0.1] transition-all duration-300"
        >
          <div className="flex items-center gap-2 mb-4">
            <FileCode className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Implementation Guide</span>
          </div>
          <h3 className="text-white font-medium text-[16px] mb-3 group-hover:text-neutral-200 transition-colors leading-[1.4]">
            Engineering Documentation
          </h3>
          <p className="text-neutral-500 text-[13px] leading-[1.6] line-clamp-2 mt-auto">
            Ready to implement? Read the technical integration guide for Krixai's runtime firewall.
          </p>
          <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center justify-between text-[12px] font-medium text-purple-400">
            <span>View Docs</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </section>
  );
}
