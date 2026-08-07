import React from "react";
import { OnboardingClient } from "@/components/onboarding/onboarding-client";

export const metadata = {
  title: "Onboarding | krixai",
  description: "Set up your workspace and secure your AI infrastructure.",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#000] text-white selection:bg-indigo-500/30 font-sans">
      <OnboardingClient />
    </div>
  );
}
