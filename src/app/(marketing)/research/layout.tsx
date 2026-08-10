import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Security Research | krixai",
  description: "Explore in-depth research, threat intelligence, and insights from the Krixai security team on prompt injections and LLM vulnerabilities.",
  alternates: { canonical: "/research" },
  openGraph: { url: "/research" }
};

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
