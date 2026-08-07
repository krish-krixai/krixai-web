import { AppContainer } from "@/components/layout/app-container";
import React from "react";
import { BillingClient } from "@/components/dashboard/billing-client";

export const metadata = {
  title: "Billing | krixai",
  description: "Manage your subscription, payment methods and invoices.",
};

export default function BillingPage() {
  return (
    <AppContainer className="py-8 min-h-[calc(100vh-64px)] flex flex-col">
      <BillingClient />
    </AppContainer>
  );
}
