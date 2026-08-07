import { Metadata } from "next";
export const metadata: Metadata = { title: "Pricing" };

import { PricingTable } from "@/components/pricing-table";
import { ComparisonTable } from "@/components/comparison-table";
import { PricingCTA } from "@/components/pricing-cta";
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
    <main className="flex-1 w-full flex flex-col bg-black overflow-hidden pt-16 lg:pt-24">
      <PricingTable 
        isCheckoutEnabled={isCheckoutEnabled}
        isTestMode={isTestMode}
      />
      
      {/* Compare Plans Section */}
      <section className="w-full py-24 lg:py-32 flex flex-col items-center border-t border-white/[0.04]">
        <div className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-5">
            Compare plans
          </h2>
          <p className="text-[16px] text-neutral-400 max-w-2xl leading-relaxed">
            Choose the right security layer for your AI product as you scale.
          </p>
        </div>
        <ComparisonTable />
      </section>

      <PricingCTA />
    </main>
  );
}
