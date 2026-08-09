import { Metadata } from "next";
export const metadata: Metadata = { title: "Pricing" };

import { PricingTable } from "@/components/pricing-table";
import { ComparisonTable } from "@/components/comparison-table";
import { Faq } from "@/components/faq";
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

  const ADD_ONS = [
    { name: "Extended log retention (+90 days)", price: "$29/mo", available: "Starter, Pro" },
    { name: "Additional API keys (per 5 keys)", price: "$19/mo", available: "Starter, Pro" },
    { name: "Additional team seats (per 5 seats)", price: "$19/mo", available: "Starter, Pro" },
    { name: "Priority support upgrade (12h → 4h)", price: "$99/mo", available: "Pro" },
    { name: "Dedicated onboarding session", price: "$299 one-time", available: "Starter, Pro" }
  ];

  return (
    <main className="flex-1 w-full flex flex-col bg-black overflow-hidden pt-16 lg:pt-20">
      <PricingTable 
        isCheckoutEnabled={isCheckoutEnabled}
        isTestMode={isTestMode}
      />
      
      {/* Compare Plans Section */}
      <section className="w-full py-24 lg:py-32 flex flex-col items-center border-t border-white/10">
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

      {/* FAQ Section */}
      <Faq />

      {/* Add-Ons Section */}
      <section className="w-full pb-32 flex flex-col items-center px-6 lg:px-12">
        <div className="max-w-[85rem] w-full flex flex-col mb-12">
          <h2 className="text-3xl font-medium tracking-tight text-white mb-2">
            Available Add-Ons
          </h2>
          <p className="text-[16px] text-neutral-400">
            For customers who need specific extras without jumping tiers.
          </p>
        </div>

        <div className="max-w-[85rem] w-full relative group">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-[#8B5CF6]/0 via-[#8B5CF6]/20 to-[#8B5CF6]/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative border border-white/10 rounded-2xl bg-[#050505] overflow-x-auto shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
            <table className="w-full text-left text-sm text-neutral-300 min-w-[700px]">
              <thead className="bg-[#000000] border-b border-[#8B5CF6]/20 text-xs uppercase tracking-widest text-[#8B5CF6] font-semibold">
                <tr>
                  <th className="px-8 py-5">Add-On Feature</th>
                  <th className="px-8 py-5">Monthly Price</th>
                  <th className="px-8 py-5 text-right">Available On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ADD_ONS.map((addon, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.03] transition-colors duration-300">
                    <td className="px-8 py-5 font-medium text-white text-[15px]">{addon.name}</td>
                    <td className="px-8 py-5 text-[#8B5CF6] font-medium text-[15px]">{addon.price}</td>
                    <td className="px-8 py-5 text-right text-neutral-400 text-[15px]">{addon.available}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
