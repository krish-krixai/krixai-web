import Link from "next/link";
import { Category } from "@/data/research";
import { ArrowRight } from "lucide-react";

export function CategoryCards({ categories }: { categories: Category[] }) {
  return (
    <section className="w-full max-w-[85rem] mx-auto px-6 lg:px-12 mb-24 relative z-10">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-[14px] font-bold tracking-[0.2em] uppercase text-white">Research Directories</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/[0.08] to-transparent" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/research/category/${category.id}`}
            className="group block p-6 bg-[#111111] border border-white/[0.04] rounded-xl hover:bg-[#161616] hover:border-white/[0.1] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium text-[16px] tracking-wide">
                  {category.name}
                </h3>
                <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <p className="text-neutral-500 text-[13px] leading-[1.6] line-clamp-2 mt-auto">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
