import { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { CodeSnippet } from "@/components/landing/code-snippet";
import { FeatureCards } from "@/components/landing/feature-cards";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Demo } from "@/components/landing/demo";
import { BottomCta } from "@/components/landing/bottom-cta";

export const metadata: Metadata = { 
  title: "Krixai - Enterprise AI Security Layer",
  description: "Secure every AI request in milliseconds. Detect prompt injection, jailbreaks, and PII leakage before they reach your LLM."
};

export default function Home() {
  return (
    <main className="flex-1 w-full flex flex-col items-center bg-[#0A0E1A] overflow-hidden selection:bg-white/10 selection:text-white pb-0 mb-0">
      <Hero />
      <CodeSnippet />
      <FeatureCards />
      <HowItWorks />
      <Demo />
      <BottomCta />
    </main>
  );
}
