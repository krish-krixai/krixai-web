import { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { CodeSnippet } from "@/components/landing/code-snippet";
import { FeatureCards } from "@/components/landing/feature-cards";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Demo } from "@/components/landing/demo";
import { BottomCta } from "@/components/landing/bottom-cta";

export const metadata: Metadata = {
  title: {
    absolute: "Krixai — AI Security in 2 Lines of Code"
  },
  description: "Secure every AI request in milliseconds. Detect prompt injection, jailbreaks, and PII leakage before they reach your LLM. Prevent adversarial attacks on your generative AI applications.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    url: "/"
  }
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.krixaisecurity.com/#organization",
        "name": "Krixai",
        "url": "https://www.krixaisecurity.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.krixaisecurity.com/logo.png"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://www.krixaisecurity.com/#website",
        "url": "https://www.krixaisecurity.com",
        "name": "Krixai",
        "publisher": {
          "@id": "https://www.krixaisecurity.com/#organization"
        }
      }
    ]
  };

  return (
    <main className="flex-1 w-full flex flex-col items-center bg-[#000000] overflow-hidden selection:bg-[#8B5CF6]/20 selection:text-white pb-0 mb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <FeatureCards />
      <HowItWorks />
      <Demo />
      <BottomCta />
    </main>
  );
}
