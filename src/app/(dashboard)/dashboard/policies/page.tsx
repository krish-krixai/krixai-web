import { AppContainer } from "@/components/layout/app-container";
import React from "react";
import { PoliciesClient } from "@/components/dashboard/policies-client";

export const metadata = {
  title: "Policies",
  description: "Define how krixai evaluates, blocks and allows AI requests across your organization.",
};

export default function PoliciesPage() {
  return (
    <AppContainer className="py-8 min-h-[calc(100vh-64px)] flex flex-col">
      <PoliciesClient />
    </AppContainer>
  );
}
