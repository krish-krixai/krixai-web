import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read the latest news, product updates, and AI security engineering deep dives from Krixai.",
  alternates: { canonical: "/blog" },
  openGraph: { url: "/blog" }
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
