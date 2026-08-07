"use client";

import React, { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CheckoutModal, BillingDetails } from "./checkout-modal";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PRICING_PLANS = [
  {
    name: "Starter",
    description: "For early-stage AI products getting started with runtime security.",
    priceUsd: "$49",
    priceInr: "₹4,100",
    amountUsd: 4900, // cents
    amountInr: 410000, // paise
    interval: "/month",
    features: [
      "50,000 prompt scans/month",
      "All 8 attack categories",
      "Real-time BLOCK / WARN / ALLOW decisions",
      "Scan logs access",
      "REST API access",
      "Email support"
    ],
    cta: "Get Started",
    highlighted: true,
    comingSoon: false
  },
  {
    name: "Growth",
    description: "For production applications scaling their AI product.",
    priceUsd: "$199",
    priceInr: "₹16,500",
    amountUsd: 19900,
    amountInr: 1650000,
    interval: "/month",
    features: [
      "250,000 prompt scans/month",
      "Everything in Starter",
      "Threat analytics dashboard",
      "Alert system (Email/Webhook)",
      "API usage tracking",
      "Team management (5 seats)",
      "Priority email support"
    ],
    cta: "Get Started",
    highlighted: false,
    comingSoon: false
  },
  {
    name: "Scale",
    description: "For high-volume AI deployments requiring strict control.",
    priceUsd: "$499",
    priceInr: "₹41,500",
    amountUsd: 49900,
    amountInr: 4150000,
    interval: "/month",
    features: [
      "700,000 prompt scans/month",
      "Everything in Growth",
      "Audit logs",
      "Custom policy thresholds",
      "Dedicated onboarding",
      "SLA guarantee",
      "Slack support channel"
    ],
    cta: "Coming Soon",
    highlighted: false,
    comingSoon: true
  },
  {
    name: "Enterprise",
    description: "For custom deployments and advanced security requirements.",
    priceUsd: "Custom",
    priceInr: "Custom",
    amountUsd: 0,
    amountInr: 0,
    interval: "",
    features: [
      "Private / On-prem deployment",
      "Multi-tenant architecture",
      "SSO / SAML",
      "Custom contracts & MSA",
      "SOC 2 reporting",
      "Dedicated account manager"
    ],
    cta: "Coming Soon",
    highlighted: false,
    comingSoon: true
  }
];

interface PricingTableProps {
  isCheckoutEnabled?: boolean;
  isTestMode?: boolean;
}

export function PricingTable({ isCheckoutEnabled = false, isTestMode = false }: PricingTableProps) {
  const [isIndia, setIsIndia] = useState<boolean | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<typeof PRICING_PLANS[0] | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setIsIndia(tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta');
    } catch (e) {
      setIsIndia(false);
    }
  }, []);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = (plan: typeof PRICING_PLANS[0]) => {
    if (plan.comingSoon) return;
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSubmit = async (details: BillingDetails) => {
    if (!selectedPlan) return;
    
    setLoadingPlan(selectedPlan.name);
    
    const isSdkLoaded = await loadRazorpay();
    if (!isSdkLoaded) {
      alert("Failed to load payment gateway. Please check your internet connection.");
      setLoadingPlan(null);
      return;
    }

    try {
      // Create order on our backend
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency: "INR",
          plan_name: selectedPlan.name,
          billing_details: details
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      setIsCheckoutOpen(false); // Close modal on success

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "Krixai Inc.",
        description: `${selectedPlan.name} Plan Subscription`,
        order_id: data.order_id,
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          try {
            // Verify payment
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan_name: selectedPlan.name
              })
            });
            
            const verifyData = await verifyRes.json();
            
            if (verifyRes.ok && verifyData.success) {
              alert("Payment successful! Your subscription is active.");
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Verification error", err);
            alert("Something went wrong during verification.");
          }
        },
        theme: {
          color: "#6366f1"
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paymentObject = new (window as any).Razorpay(options);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      paymentObject.on("payment.failed", function (response: any) {
        alert("Payment failed: " + response.error.description);
      });
      
      paymentObject.open();
      
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className="relative w-full bg-black py-24 lg:py-32 overflow-hidden flex flex-col items-center">
      {isTestMode && (
        <div className="absolute top-0 left-0 right-0 w-full bg-amber-500/90 text-black py-1.5 text-center text-xs font-bold uppercase tracking-wider z-50 flex items-center justify-center">
          Test payments only
        </div>
      )}
      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full relative z-10 flex flex-col items-center">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-medium tracking-tight text-white text-balance leading-[1.1] mb-6">
            Pricing built for production.
          </h1>
          <p className="text-lg lg:text-[19px] text-neutral-400 max-w-2xl leading-[1.6] font-normal tracking-wide">
            Predictable, usage-based pricing. Secure your AI infrastructure today.
            <br />
            <span className="text-sm text-neutral-500 mt-2 block">Note: Indian prices exclude 18% GST. International billing via sales contact only.</span>
          </p>
          
          {/* Trust Row */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-8">
            {[
              "No credit card required",
              "Cancel anytime",
              "Instant API access",
              "Secure payments"
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-2 text-[13px] text-neutral-400">
                <Check className="w-3.5 h-3.5 text-neutral-500" strokeWidth={2.5} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8 w-full mb-16 items-stretch">
          {PRICING_PLANS.map((plan, i) => (
            <div 
              key={i}
              className={cn(
                "relative flex flex-col p-8 rounded-[var(--radius-lg)] border transition-all duration-300 h-full",
                plan.highlighted 
                  ? "bg-[var(--color-surface-hover)] border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.15)]" 
                  : "bg-[var(--color-surface)] border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]"
              )}
            >
              {plan.comingSoon && (
                <div className="absolute -top-3 right-6 px-3 py-1 bg-gradient-to-b from-neutral-800 to-neutral-900 border border-white/[0.1] shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] rounded-full z-10 flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-neutral-300 uppercase tracking-[0.1em] drop-shadow-sm">Coming Soon</span>
                </div>
              )}

              <div className="flex flex-col flex-1">
                <div className="xl:min-h-[140px] flex flex-col">
                  <h3 className="text-xl font-semibold text-white tracking-wide mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted leading-relaxed pr-2">
                    {plan.description}
                  </p>
                </div>
                
                <div className="xl:min-h-[90px] flex items-baseline mb-6">
                  <span className="text-4xl font-medium tracking-tight text-white leading-none">
                    {isIndia === null ? "..." : isIndia ? plan.priceInr : plan.priceUsd}
                  </span>
                  {plan.interval && (
                    <span className="text-sm font-medium text-muted ml-1.5">{plan.interval}</span>
                  )}
                </div>

                <div className="w-full h-[1px] bg-[var(--color-border)] mb-6" />

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-white/[0.05] border border-[var(--color-border)] flex items-center justify-center shrink-0 mt-[2px] mr-3">
                        <Check className="w-3 h-3 text-neutral-300" strokeWidth={2.5} />
                      </div>
                      <span className="text-sm text-neutral-300 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto">
                <button 
                  onClick={() => handleCheckout(plan)}
                  disabled={plan.comingSoon || loadingPlan === plan.name || (!isCheckoutEnabled && !plan.comingSoon)}
                  className={cn(
                    "w-full min-h-[44px] rounded-[var(--radius-md)] text-sm font-semibold transition-all duration-300 flex items-center justify-center tracking-wide",
                    (plan.comingSoon || (!isCheckoutEnabled && !plan.comingSoon))
                      ? "bg-white/[0.02] border border-white/[0.04] text-neutral-600 cursor-not-allowed"
                      : plan.highlighted
                        ? "bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_4px_14px_rgba(99,102,241,0.3)]"
                        : "bg-white text-black hover:bg-neutral-200"
                  )}
                >
                {loadingPlan === plan.name ? (
                  <Loader2 className="w-5 h-5 animate-spin text-current" />
                ) : !isCheckoutEnabled && !plan.comingSoon ? (
                  "Payments are temporarily unavailable"
                ) : (
                  plan.cta
                )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Separated Plan Notes */}
        <div className="mt-4 text-xs text-muted leading-relaxed text-center font-medium max-w-2xl mx-auto">
          * For the Starter plan, when your 50,000 monthly prompt scans are used, scanning pauses until the next billing cycle. Need more capacity? Contact us at <a href="mailto:sales@krixaisecurity.com" className="text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2">sales@krixaisecurity.com</a>
        </div>

      </div>
      
      {selectedPlan && (
        <CheckoutModal 
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)} 
          planName={selectedPlan.name}
          basePrice={selectedPlan.amountInr}
          onSubmit={handlePaymentSubmit}
          loading={loadingPlan === selectedPlan.name}
        />
      )}
    </section>
  );
}
