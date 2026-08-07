import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Reference",
  description: "Official REST API reference for the krixai platform.",
};

import { ApiLayout } from "@/components/docs/api-reference/api-layout";
import { ApiHero } from "@/components/docs/api-reference/api-hero";
import { ApiAuth } from "@/components/docs/api-reference/api-auth";
import { ApiEndpointScan } from "@/components/docs/api-reference/api-endpoint-scan";
import { ApiStatusCodes } from "@/components/docs/api-reference/api-status-codes";
import { ApiRateLimits } from "@/components/docs/api-reference/api-rate-limits";
import { ApiCodeExamples } from "@/components/docs/api-reference/api-code-examples";
import { ApiErrors } from "@/components/docs/api-reference/api-errors";
import { ApiBottomNav } from "@/components/docs/api-reference/api-bottom-nav";

export default function ApiReferencePage() {
  return (
    <ApiLayout>
      <ApiHero />
      <ApiAuth />
      <ApiEndpointScan />
      <ApiStatusCodes />
      <ApiRateLimits />
      <ApiCodeExamples />
      <ApiErrors />
      <ApiBottomNav />
    </ApiLayout>
  );
}
