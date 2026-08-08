import React from "react";
import { Check, Minus } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COMPARISON_CATEGORIES = [
  {
    category: "DETECTION",
    features: [
      { name: "Prompt Injection (direct)", free: true, starter: true, pro: true, enterprise: true },
      { name: "Prompt Injection (indirect/RAG)", free: true, starter: true, pro: true, enterprise: true },
      { name: "Jailbreak Detection", free: true, starter: true, pro: true, enterprise: true },
      { name: "PII Scanning (input)", free: true, starter: true, pro: true, enterprise: true },
      { name: "PII Scanning (output)", free: false, starter: true, pro: true, enterprise: true },
      { name: "Custom Detection Rules", free: "3 rules", starter: "25 rules", pro: "Unlimited", enterprise: "Unlimited" },
    ]
  },
  {
    category: "CONTROL",
    features: [
      { name: "Shadow Mode", free: true, starter: true, pro: true, enterprise: true },
      { name: "Blocking Mode", free: true, starter: true, pro: true, enterprise: true },
      { name: "Advisory Mode (headers only)", free: false, starter: true, pro: true, enterprise: true },
      { name: "Sensitivity Configuration", free: "Default only", starter: "3 levels", pro: "4 levels + custom", enterprise: "Fully custom" },
      { name: "PII Auto-Redaction", free: false, starter: true, pro: true, enterprise: true },
      { name: "Allow/Block Lists", free: false, starter: true, pro: true, enterprise: true },
    ]
  },
  {
    category: "VISIBILITY",
    features: [
      { name: "Real-Time Dashboard", free: "Basic", starter: "Full", pro: "Full + Analytics", enterprise: "Full + Custom" },
      { name: "Detection Log Retention", free: "3 days", starter: "30 days", pro: "90 days", enterprise: "1 year + export" },
      { name: "Webhook Alerts", free: false, starter: false, pro: true, enterprise: true },
      { name: "API for Log Export", free: false, starter: false, pro: true, enterprise: true },
    ]
  },
  {
    category: "TEAM & ACCESS",
    features: [
      { name: "API Keys (environments)", free: "1", starter: "3", pro: "10", enterprise: "Unlimited" },
      { name: "Team Seats", free: "1", starter: "3", pro: "10", enterprise: "Unlimited" },
      { name: "SSO / SAML", free: false, starter: false, pro: false, enterprise: true },
      { name: "Role-Based Access Control", free: false, starter: false, pro: false, enterprise: true },
      { name: "Custom On-premise Deployment", free: false, starter: false, pro: false, enterprise: true },
    ]
  },
  {
    category: "SUPPORT",
    features: [
      { name: "Community (Discord + Docs)", free: true, starter: true, pro: true, enterprise: true },
      { name: "Email Support", free: false, starter: "48h response", pro: "12h response", enterprise: "4h response" },
      { name: "Dedicated Slack Channel", free: false, starter: false, pro: false, enterprise: true },
      { name: "Onboarding Call", free: false, starter: false, pro: false, enterprise: true },
      { name: "SLA Guarantee", free: false, starter: false, pro: "99.9%", enterprise: "99.99% + data SLA" },
    ]
  }
];

export function ComparisonTable() {
  const renderCell = (value: string | boolean) => {
    if (value === true) return <Check className="w-5 h-5 mx-auto text-[#8B5CF6] drop-shadow-[0_0_12px_rgba(0,212,255,0.6)]" />;
    if (value === false) return <Minus className="w-4 h-4 mx-auto text-neutral-700" />;
    return <span className="text-[14px] text-neutral-300 font-medium tracking-wide">{value}</span>;
  };

  return (
    <div className="w-full max-w-[85rem] mx-auto px-6 lg:px-12">
      <div className="relative border border-white/10 rounded-2xl bg-[#050505] shadow-[0_8px_40px_rgba(0,0,0,0.8)] overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="sticky top-0 z-20 bg-[#050505]/95 backdrop-blur-xl py-6 px-8 font-medium text-[15px] text-white border-r border-white/10 w-1/3 min-w-[240px]">
                Compare All Features
              </th>
              
              <th className="sticky top-0 z-20 bg-[#050505]/95 backdrop-blur-xl py-6 px-6 text-center w-1/6 min-w-[160px] border-r border-white/10">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-medium text-white tracking-wide mb-1">Free</span>
                  <div className="h-6" />
                </div>
              </th>

              <th className="sticky top-0 z-20 bg-[#050505]/95 backdrop-blur-xl py-6 px-6 text-center w-1/6 min-w-[160px] border-r border-white/10">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-medium text-white tracking-wide mb-1">Starter</span>
                  <div className="h-6" />
                </div>
              </th>

              <th className="sticky top-0 z-20 bg-[#000000]/95 backdrop-blur-xl py-6 px-6 text-center w-1/6 min-w-[160px] border-r border-white/10 border-t-2 border-t-[#8B5CF6] relative">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-medium text-[#8B5CF6] tracking-wide mb-2">Pro</span>
                  <div className="px-3 py-1 bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 rounded-full shadow-sm">
                    <span className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-widest">Popular</span>
                  </div>
                </div>
              </th>

              <th className="sticky top-0 z-20 bg-[#050505]/95 backdrop-blur-xl py-6 px-6 text-center w-1/6 min-w-[160px]">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-medium text-white tracking-wide mb-2">Enterprise</span>
                  <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full shadow-sm">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Coming Soon</span>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_CATEGORIES.map((category, catIdx) => (
              <React.Fragment key={catIdx}>
                {/* Category Header Row */}
                <tr className="border-b border-white/10 bg-[#0A0A0A]">
                  <td colSpan={5} className="py-4 px-8 text-[13px] font-bold text-neutral-500 tracking-[0.15em] uppercase">
                    {category.category}
                  </td>
                </tr>
                {/* Feature Rows */}
                {category.features.map((feature, idx) => (
                  <tr 
                    key={`${catIdx}-${idx}`}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors duration-300 group"
                  >
                    <td className="sticky left-0 z-10 bg-[#050505] group-hover:bg-[#0A0A0A] transition-colors duration-300 py-4 px-8 text-[14px] text-neutral-300 border-r border-white/10">
                      {feature.name}
                    </td>
                    <td className="py-4 px-6 text-center border-r border-white/10">
                      {renderCell(feature.free)}
                    </td>
                    <td className="py-4 px-6 text-center border-r border-white/10">
                      {renderCell(feature.starter)}
                    </td>
                    <td className="py-4 px-6 text-center border-r border-white/10 bg-[#000000]/30 group-hover:bg-[#000000]/50 transition-colors duration-300">
                      {renderCell(feature.pro)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {renderCell(feature.enterprise)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
