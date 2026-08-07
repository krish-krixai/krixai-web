export type PlanName = "Starter" | "Growth" | "Scale" | "FREE";
export type Currency = "INR" | "USD";

export interface PlanConfig {
  name: PlanName;
  priceINR: number; // in paise
  priceUSD: number; // in cents
  scans: number;
}

export const PLAN_CATALOG: Record<string, PlanConfig> = {
  FREE: {
    name: "FREE",
    priceINR: 0,
    priceUSD: 0,
    scans: 0,
  },
  Starter: {
    name: "Starter",
    priceINR: 410000, // ₹4,100
    priceUSD: 4900,   // $49
    scans: 50000,
  },
  Growth: {
    name: "Growth",
    priceINR: 1650000, // ₹16,500
    priceUSD: 19900,   // $199
    scans: 250000,
  },
  Scale: {
    name: "Scale",
    priceINR: 4150000, // ₹41,500
    priceUSD: 49900,   // $499
    scans: 700000,
  },
};

export function getPlanPrice(planName: string, currency: string): number | null {
  const plan = PLAN_CATALOG[planName];
  if (!plan) return null;
  if (currency === "INR") return plan.priceINR;
  if (currency === "USD") return plan.priceUSD;
  return null;
}
