import { Metadata } from "next";
export const metadata: Metadata = { title: "Product" };

import { Integrations } from "@/components/integrations";
import { DeveloperExperience } from "@/components/developer-experience";
import { Placeholder } from "@/components/placeholder";

export default function ProductPage() {
  return (
    <main className="flex-1 w-full flex flex-col bg-black overflow-hidden pt-16 lg:pt-24">
      {/* Start with Integrations since it was moved here, but normally there's a hero. 
          The instructions didn't specify a Hero for Product, just to move Integrations & DX first. */}
      <Integrations />
      <DeveloperExperience />
      <Placeholder title="Architecture Diagram" height="500px" />
      <Placeholder title="Deployment" height="400px" />
      <Placeholder title="Enterprise Features" height="500px" />
      <Placeholder title="Ready to secure your AI?" description="Product CTA Section" height="300px" />
    </main>
  );
}
