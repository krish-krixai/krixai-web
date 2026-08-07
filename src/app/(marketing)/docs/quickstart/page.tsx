import { Metadata } from "next";

import { QuickstartLayout } from "@/components/docs/quickstart/quickstart-layout";
import { QuickstartHero } from "@/components/docs/quickstart/quickstart-hero";
import { Step1ApiKey } from "@/components/docs/quickstart/step-1-apikey";
import { Step2Install } from "@/components/docs/quickstart/step-2-install";
import { Step3Init } from "@/components/docs/quickstart/step-3-init";
import { Step4Scan } from "@/components/docs/quickstart/step-4-scan";
import { Step5Handle } from "@/components/docs/quickstart/step-5-handle";
import { Step6Forward } from "@/components/docs/quickstart/step-6-forward";
import { BestPractices } from "@/components/docs/quickstart/best-practices";
import { NextSteps } from "@/components/docs/quickstart/next-steps";
import { QuickstartCTA } from "@/components/docs/quickstart/quickstart-cta";

export const metadata: Metadata = {
  title: "Quick Start",
  description: "Integrate krixai in under 5 minutes.",
};

export default function QuickstartPage() {
  return (
    <QuickstartLayout>
      <QuickstartHero />
      <Step1ApiKey />
      <Step2Install />
      <Step3Init />
      <Step4Scan />
      <Step5Handle />
      <Step6Forward />
      <BestPractices />
      <NextSteps />
      <QuickstartCTA />
    </QuickstartLayout>
  );
}
