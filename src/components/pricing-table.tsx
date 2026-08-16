"use client";

import React, { useState, useEffect } from "react";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { CheckoutModal, BillingDetails } from "./checkout-modal";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PRICING_PLANS = [
  {
    name: "Free",
    priceDisplay: "$0",
    interval: "/month",
    description: "For developers evaluating Krixai",
    belowPrice: "",
    amountUsd: 0,
    amountInr: 0,
    features: [
      "10,000 requests/mo",
      "All detection categories",
      "Basic dashboard",
      "3-day log retention",
      "1 API key",
      "Community support"
    ],
    cta: "Get Started Free →",
    ctaLink: "/auth/sign-up",
    ctaAction: "signup",
    highlighted: false,
  },
  {
    name: "Pro",
    priceDisplay: "$49",
    interval: "/month",
    description: "For teams running AI in production",
    belowPrice: "Includes 100k requests. Then $0.002/request.",
    amountUsd: 4900,
    amountInr: 410000,
    features: [
      "Everything in Free, plus:",
      "500,000 requests/mo",
      "5 API keys",
      "30-day log retention",
      "Full dashboard",
      "Email support (48h)"
    ],
    cta: "Upgrade to Pro →",
    ctaLink: "/auth/sign-up?plan=pro",
    ctaAction: "checkout",
    highlighted: true,
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
  const [authWorkspaceId, setAuthWorkspaceId] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndWorkspace = async () => {
      try {
        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: membership } = await supabase
            .from('workspace_members')
            .select('workspace_id')
            .eq('user_id', session.user.id)
            .limit(1)
            .single();
            
          if (membership) {
            setAuthWorkspaceId(membership.workspace_id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user workspace", err);
      } finally {
        setIsAuthLoading(false);
      }
    };
    
    fetchUserAndWorkspace();
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
    if (plan.ctaAction === "checkout") {
      if (isAuthLoading) return; // Prevent clicks while checking auth state
      
      if (authWorkspaceId) {
        setSelectedPlan(plan);
        setIsCheckoutOpen(true);
      } else {
        window.location.href = plan.ctaLink;
      }
    }
  };

  const handlePaymentSubmit = async (details: BillingDetails, totalAmountPaise: number) => {
    if (!selectedPlan || !authWorkspaceId) return;
    
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
          billing_details: details,
          workspace_id: authWorkspaceId,
          amount: totalAmountPaise
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
                workspace_id: authWorkspaceId,
                plan_name: selectedPlan.name
              })
            });
            
            const verifyData = await verifyRes.json();
            
            if (verifyRes.ok && verifyData.success) {
              alert("Payment successful! Your subscription is active.");
              window.location.href = "/dashboard/billing";
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

  const renderCTA = (plan: typeof PRICING_PLANS[0]) => {
    const isLoading = loadingPlan === plan.name || (plan.ctaAction === "checkout" && isAuthLoading);
    const baseClasses = "w-full min-h-[44px] rounded-md text-sm font-semibold transition-all duration-300 flex items-center justify-center tracking-wide group";
    
    let styleClasses = "";
    if (plan.highlighted) {
      styleClasses = "bg-white text-black hover:bg-neutral-200";
    } else {
      styleClasses = "bg-transparent border border-white/20 text-white hover:bg-white/5";
    }

    if (plan.ctaAction === "checkout") {
      return (
        <button 
          onClick={() => handleCheckout(plan)}
          disabled={!isCheckoutEnabled || isLoading}
          className={cn(baseClasses, styleClasses, (!isCheckoutEnabled || isLoading) && "opacity-50 cursor-not-allowed")}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : plan.cta}
        </button>
      );
    } else {
      return (
        <Link href={plan.ctaLink} className={cn(baseClasses, styleClasses)}>
          {plan.cta}
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
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg lg:text-[19px] text-neutral-400 max-w-2xl leading-[1.6] font-normal tracking-wide">
            Protect every AI request.
            <br />
            <span className="text-sm text-neutral-500 mt-2 block">Cancel anytime.</span>
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8 max-w-4xl mx-auto w-full items-stretch">
          {PRICING_PLANS.map((plan, i) => (
            <div 
              key={i}
              className={cn(
                "relative flex flex-col p-8 rounded-2xl border transition-all duration-300 h-full",
                plan.highlighted 
                  ? "bg-[#050505] border-[#8B5CF6]/50 shadow-[0_0_30px_rgba(139,92,246,0.15)] z-10" 
                  : "bg-[#050505] border-white/10 hover:bg-[#0A0A0A]"
              )}
            >
              <div className="flex flex-col flex-1">
                <div className="mb-6">
                  <h3 className={cn("text-2xl font-medium tracking-wide mb-2", plan.highlighted ? "text-white" : "text-white")}>{plan.name}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {plan.description}
                  </p>
                </div>
                
                <div className="flex items-baseline mb-2 items-center">
                  <span className="text-5xl font-medium tracking-tight text-white leading-none">
                    {plan.priceDisplay}
                  </span>
                  <span className="text-sm font-medium text-neutral-500 ml-2">{plan.interval}</span>
                </div>
                
                <div className="h-6 mb-6">
                  {plan.belowPrice && (
                    <p className="text-xs text-neutral-400 font-mono">{plan.belowPrice}</p>
                  )}
                </div>

                <ul className="space-y-4 mb-8 flex-1 border-t border-white/10 pt-8 mt-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-[2px] mr-3">
                        <Check className={cn("w-3 h-3", plan.highlighted ? "text-[#8B5CF6]" : "text-neutral-300")} strokeWidth={2.5} />
                      </div>
                      <span className={cn("text-sm", feature === "Everything in Free, plus:" ? "text-white font-medium" : "text-neutral-300")}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-4">
                {renderCTA(plan)}
              </div>
            </div>
          ))}
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
