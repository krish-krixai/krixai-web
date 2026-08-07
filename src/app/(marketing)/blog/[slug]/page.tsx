import { redirect } from "next/navigation";
import { ARTICLES } from "@/data/blog";

export async function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/research/${slug}`);
}
