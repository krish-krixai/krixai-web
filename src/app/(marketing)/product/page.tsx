import { Metadata } from "next";
export const metadata: Metadata = { 
  title: "Product",
  description: "Secure your AI applications against prompt injection, PII leakage, and adversarial attacks. Explore Krixai's enterprise features, integrations, and deployment options.",
  alternates: { canonical: "/product" },
  openGraph: { url: "/product" }
};

import { Integrations } from "@/components/integrations";
import { DeveloperExperience } from "@/components/developer-experience";
import { Placeholder } from "@/components/placeholder";

export default function ProductPage() {
  return (
    <main className="flex-1 w-full flex flex-col bg-black overflow-hidden pt-16 lg:pt-24">
      <div className="max-w-[85rem] mx-auto px-6 lg:px-8 pt-12 pb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-white mb-4">
          The Enterprise AI Security Layer
        </h1>
        <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
          Comprehensive protection against prompt injection, data exfiltration, and adversarial attacks.
        </p>
      </div>
      <Integrations />
      <DeveloperExperience />
      <Placeholder title="Architecture Diagram" height="500px" />
      <Placeholder title="Deployment" height="400px" />
      <Placeholder title="Enterprise Features" height="500px" />
      <Placeholder title="Ready to secure your AI?" description="Product CTA Section" height="300px" />
    </main>
  );
}
