import { redirect } from "next/navigation";
import { TOPICS } from "@/data/blog";

export async function generateStaticParams() {
  return TOPICS.map((topic) => ({
    category: topic.title.toLowerCase().replace(/ /g, '-'),
  }));
}

export default async function CategoryRedirectPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  redirect(`/research/category/${category}`);
}
