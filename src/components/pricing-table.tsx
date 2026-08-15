"use client";

import React, { useState, useEffect } from "react";
import { Check, Loader2, ArrowRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CheckoutModal, BillingDetails } from "./checkout-modal";
import Link from "next/link";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PRICING_PLANS = [
  {
    name: "Free",
    priceDisplay: "$0",
    interval: "/month",
    priceInrDisplay: "₹0",
    tagline: "For developers evaluating Krixai",
    description: "Get started with full prompt injection and jailbreak detection. No credit card required.",
    belowPrice: "",
    amountUsd: 0,
    amountInr: 0,
    features: [
      "10,000 requests /mo",
      "All detection categories",
      "Basic real-time dashboard",
      "3-day log retention",
      "1 environment & 1 seat",
      "Community support"
    ],
    cta: "Get Started Free",
    ctaAction: "free",
    style: "ghost",
    highlighted: false,
    comingSoon: false
  },
  {
    name: "Starter",
    priceDisplay: "$49",
    interval: "/month",
    priceInrDisplay: "₹4,100",
    tagline: "For teams launching AI in production",
    description: "Everything you need to go from shadow mode to full production blocking. 30-day audit logs included.",
    belowPrice: "Includes 100k requests. Then $0.002/request.",
    amountUsd: 4900,
    amountInr: 410000,
    features: [
      "100,000 requests /mo",
      "3 custom detection rules",
      "Full real-time dashboard",
      "30-day log retention",
      "3 environments & 3 seats",
      "48h email support"
    ],
    cta: "Start 14-Day Free Trial",
    ctaAction: "signup",
    style: "ghost-cyan",
    highlighted: false,
    comingSoon: false
  },
  {
    name: "Pro",
    badge: "MOST POPULAR",
    priceDisplay: "$199",
    interval: "/month",
    priceInrDisplay: "₹16,500",
    tagline: "For teams scaling AI across products",
    description: "Unlimited custom rules, 90-day audit trail, and priority support. Built for DevSecOps teams that need full visibility and control.",
    belowPrice: "Includes 1M requests. Then $0.001/request.",
    amountUsd: 19900,
    amountInr: 1650000,
    features: [
      "1,000,000 requests /mo",
      "Unlimited custom rules",
      "Real-time dashboard",
      "90-day log retention",
      "10 environments & 10 seats",
      "12h priority support"
    ],
    cta: "Start 14-Day Free Trial",
    ctaAction: "signup",
    style: "primary-glow",
    highlighted: true,
    comingSoon: false
  },
  {
    name: "Enterprise",
    priceDisplay: "COMING SOON",
    interval: "",
    priceInrDisplay: "COMING SOON",
    tagline: "",
    description: "Everything in Pro, plus:",
    belowPrice: "",
    amountUsd: 0,
    amountInr: 0,
    features: [
      "Unlimited requests",
      "SSO / SAML",
      "SLA guarantee",
      "Dedicated support",
      "Custom deployment",
      "Annual contracts"
    ],
    cta: "Join Waitlist",
    ctaAction: "waitlist",
    style: "ghost",
    extraLine: "We're incorporating soon. Get notified.",
    highlighted: false,
    comingSoon: true
  }
];

interface PricingTableProps {
  isCheckoutEnabled?: boolean;
  isTestMode?: boolean;
}

export function PricingTable({ isCheckoutEnabled = false, isTestMode = false }: PricingTableProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<typeof PRICING_PLANS[0] | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Usage Calculator State
  const [requests, setRequests] = useState(250000);

  // Usage Calculator State
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
    if (plan.ctaAction === "checkout") {
      if (plan.comingSoon) return;
      setSelectedPlan(plan);
      setIsCheckoutOpen(true);
    }
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

      setIsCheckoutOpen(false);

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "Krixai Inc.",
        description: `${selectedPlan.name} Plan Subscription`,
        order_id: data.order_id,
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          try {
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
          color: "#8B5CF6"
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

  // Calculator Logic
  const calcStarterOverage = Math.max(0, requests - 100000);
  const calcStarterCost = 49 + (calcStarterOverage * 0.002);
  const calcProOverage = Math.max(0, requests - 1000000);
  const calcProCost = 199 + (calcProOverage * 0.001);
  
  const recommendedPlan = calcProCost <= calcStarterCost ? "Pro" : "Starter";
  const currentCost = recommendedPlan === "Pro" ? calcProCost : calcStarterCost;
  const savings = recommendedPlan === "Pro" ? calcStarterCost - calcProCost : 0;

  const renderCTA = (plan: typeof PRICING_PLANS[0]) => {
    const isLoading = loadingPlan === plan.name;
    const baseClasses = "w-full min-h-[44px] rounded-md text-sm font-semibold transition-all duration-300 flex items-center justify-center tracking-wide group";
    
    let styleClasses = "";
    if (plan.style === "primary-glow") {
      styleClasses = "bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-black shadow-[0_0_20px_rgba(0,212,255,0.4)]";
    } else if (plan.style === "ghost-cyan") {
      styleClasses = "bg-transparent border border-[#8B5CF6]/40 text-[#8B5CF6] hover:bg-[#8B5CF6]/10";
    } else {
      styleClasses = "bg-transparent border border-white/20 text-white hover:bg-white/5";
    }

    if (plan.ctaAction === "checkout") {
      return (
        <button 
          onClick={() => handleCheckout(plan)}
          disabled={!isCheckoutEnabled || isLoading}
          className={cn(baseClasses, styleClasses, !isCheckoutEnabled && "opacity-50 cursor-not-allowed")}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <>
              {plan.cta}
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      );
    } else if (plan.ctaAction === "sales") {
      return (
        <a href="mailto:sales@krixaisecurity.com" className={cn(baseClasses, styleClasses)}>
          {plan.cta}
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </a>
      );
    } else if (plan.ctaAction === "waitlist") {
      return (
        <form className="w-full flex flex-col gap-2" onSubmit={(e) => { e.preventDefault(); alert("Thanks for joining the waitlist!"); }}>
          <input type="email" placeholder="Enter your email" required className="w-full min-h-[44px] rounded-md border border-white/20 bg-white/5 px-4 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-colors" />
          <button type="submit" className={cn(baseClasses, styleClasses)}>
            {plan.cta}
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      );
    } else {
      return (
        <Link href="/auth/sign-up" className={cn(baseClasses, styleClasses)}>
          {plan.cta}
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Link>
      );
    }
  };

  return (
    <section className="relative w-full bg-black pb-24 lg:pb-32 overflow-hidden flex flex-col items-center">
      {isTestMode && (
        <div className="absolute top-0 left-0 right-0 w-full bg-amber-500/90 text-black py-1.5 text-center text-xs font-bold uppercase tracking-wider z-50 flex items-center justify-center">
          Test payments only
        </div>
      )}
      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full relative z-10 flex flex-col items-center">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-medium tracking-tight text-white text-balance leading-[1.1] mb-6">
            Simple, Usage-Based Pricing
          </h1>
          <p className="text-lg lg:text-[19px] text-neutral-400 max-w-2xl leading-[1.6] font-normal tracking-wide">
            Protect every AI request. Pay only for what you use.
            <br />
            <span className="text-sm text-neutral-500 mt-2 block">Cancel anytime.</span>
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-6 w-full mb-24 items-stretch">
          {PRICING_PLANS.map((plan, i) => (
            <div 
              key={i}
              className={cn(
                "relative flex flex-col p-8 rounded-2xl border transition-all duration-300 h-full",
                plan.highlighted 
                  ? "bg-[#000000] border-[#8B5CF6]/40 shadow-[0_0_30px_rgba(0,212,255,0.15)] xl:scale-[1.03] z-10" 
                  : "bg-[#050505] border-white/10 hover:bg-[#0A0A0A]"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#8B5CF6]/20 border border-[#8B5CF6]/50 rounded-full z-10">
                  <span className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider">{plan.badge}</span>
                </div>
              )}

              <div className="flex flex-col flex-1">
                <div className="mb-6">
                  <h3 className={cn("text-xl font-medium tracking-wide mb-2", plan.highlighted ? "text-[#8B5CF6]" : "text-white")}>{plan.name}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed min-h-[40px]">
                    {plan.tagline}
                  </p>
                </div>
                
                <div className="flex items-baseline mb-2 min-h-[48px] items-center">
                  {plan.comingSoon ? (
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                      Coming Soon
                    </span>
                  ) : (
                    <>
                      <span className="text-5xl font-medium tracking-tight text-white leading-none">
                        {plan.priceDisplay}
                      </span>
                      {plan.interval && (
                        <span className="text-sm font-medium text-neutral-500 ml-2">{plan.interval}</span>
                      )}
                    </>
                  )}
                </div>
                
                {plan.belowPrice && (
                  <p className="text-xs text-neutral-400 mb-6 font-mono">{plan.belowPrice}</p>
                )}
                {!plan.belowPrice && <div className="mb-6 h-[16px]" />}

                <p className="text-sm text-neutral-300 leading-relaxed mb-8 border-b border-white/10 pb-8 min-h-[100px]">
                  {plan.description}
                </p>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-[2px] mr-3">
                        <Check className={cn("w-3 h-3", plan.highlighted ? "text-[#8B5CF6]" : "text-neutral-300")} strokeWidth={2.5} />
                      </div>
                      <span className="text-sm text-neutral-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto flex flex-col gap-3">
                {renderCTA(plan)}
                {plan.extraLine && (
                  <p className="text-xs text-center text-neutral-500">{plan.extraLine}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Usage Calculator */}
        <div className="w-full max-w-4xl mx-auto bg-[#050505] border border-white/10 rounded-2xl p-8 lg:p-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
            <div>
              <h3 className="text-2xl font-medium text-white mb-2">Estimate Your Monthly Cost</h3>
              <p className="text-neutral-400 text-sm">See how your cost scales with your application's growth.</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-medium text-white">${currentCost.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}<span className="text-lg text-neutral-500">/mo</span></div>
              <div className="text-sm font-medium text-[#8B5CF6] mt-1">Recommended: {recommendedPlan} Plan</div>
            </div>
          </div>

          <div className="mb-12">
            <div className="flex justify-between text-sm text-neutral-400 mb-4">
              <span>Monthly AI Requests</span>
              <span className="text-white font-mono">{requests.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="2000000"
              step="10000"
              value={requests}
              onChange={(e) => setRequests(parseInt(e.target.value))}
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
            />
            <div className="flex justify-between text-xs text-neutral-500 mt-2">
              <span>10k</span>
              <span>2M+</span>
            </div>
          </div>

          <div className="bg-[#000000] border border-[#8B5CF6]/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-sm text-neutral-300">
              {recommendedPlan === "Pro" ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">💡</span>
                    <strong className="text-white">Smart Upgrade</strong>
                  </div>
                  <p>You'd pay <span className="text-red-400 line-through">${calcStarterCost.toLocaleString()}</span> on Starter overage.</p>
                  <p className="text-[#8B5CF6] font-medium mt-1">You save ${savings.toLocaleString()}/mo by switching to Pro.</p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <Check className="w-4 h-4 text-[#8B5CF6]" />
                    <strong className="text-white">Starter Plan Details</strong>
                  </div>
                  <p>Base: $49/mo + {calcStarterOverage.toLocaleString()} overage × $0.002 = ${calcStarterCost.toLocaleString()}/mo</p>
                </>
              )}
            </div>
            
            <button 
              onClick={() => handleCheckout(PRICING_PLANS.find(p => p.name === recommendedPlan)!)}
              className="px-6 py-3 bg-white text-black hover:bg-neutral-200 font-semibold rounded-md text-sm whitespace-nowrap transition-colors"
            >
              Start Free Trial on {recommendedPlan}
            </button>
          </div>
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
