import { DocsHero } from "@/components/docs/docs-hero";
import { DocsTimeline } from "@/components/docs/docs-timeline";
import { DocsCategories } from "@/components/docs/docs-categories";
import { DocsProviders } from "@/components/docs/docs-providers";
import { DocsCodePreview } from "@/components/docs/docs-code-preview";
import { DocsCTA } from "@/components/docs/docs-cta";

export const metadata = {
  title: "Documentation",
  description: "Developer Documentation and API Reference",
};

export default function DocsPage() {
  return (
    <main className="flex-1 w-full flex flex-col bg-black overflow-hidden pt-16 lg:pt-24">
      <DocsHero />
      <DocsTimeline />
      <DocsCategories />
      <DocsProviders />
      <DocsCodePreview />
      <DocsCTA />
    </main>
  );
}
