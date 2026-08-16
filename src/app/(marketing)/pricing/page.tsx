import { Metadata } from "next";
export const metadata: Metadata = { 
  title: "Pricing",
  description: "Compare Krixai pricing plans. Choose the right security layer for your AI product as you scale, with transparent pricing for startups to enterprises.",
  alternates: { canonical: "/pricing" },
  openGraph: { url: "/pricing" }
};

import { PricingTable } from "@/components/pricing-table";
import { getRazorpayConfig } from "@/utils/razorpay-config";

export default function PricingPage() {
  let isCheckoutEnabled = false;
  let isTestMode = false;

  try {
    const config = getRazorpayConfig();
    isCheckoutEnabled = config.isCheckoutEnabled;
    isTestMode = config.mode === 'test';
  } catch (err: any) {
    console.error("Razorpay config error on pricing page:", err.message);
  }

  return (
    <main className="flex-1 w-full flex flex-col bg-black overflow-hidden pt-16 lg:pt-20">
      <PricingTable 
        isCheckoutEnabled={isCheckoutEnabled}
        isTestMode={isTestMode}
      />
    </main>
  );
}
