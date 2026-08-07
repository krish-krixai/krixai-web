import React from "react";
import { Check, Minus } from "lucide-react";

const COMPARISON_FEATURES = [
  { name: "Monthly Price", starter: "$49", growth: "$199", scale: "$499", enterprise: "Custom" },
  { name: "Prompt Scans", starter: "50,000", growth: "250,000", scale: "700,000", enterprise: "Unlimited" },
  { name: "Attack Categories", starter: "All 8", growth: "All 8", scale: "All 8", enterprise: "All 8" },
  { name: "Runtime Decisions", starter: "Real-time", growth: "Real-time", scale: "Real-time", enterprise: "Real-time" },
  { name: "REST API", starter: true, growth: true, scale: true, enterprise: true },
  { name: "Scan Logs", starter: true, growth: true, scale: true, enterprise: true },
  { name: "Threat Analytics", starter: false, growth: true, scale: true, enterprise: true },
  { name: "Alerts", starter: false, growth: "Email/Webhook", scale: "Email/Webhook", enterprise: "Email/Webhook" },
  { name: "Team Members", starter: "1", growth: "5", scale: "Unlimited", enterprise: "Unlimited" },
  { name: "Audit Logs", starter: false, growth: false, scale: true, enterprise: true },
  { name: "Custom Policies", starter: false, growth: false, scale: true, enterprise: true },
  { name: "Slack Support", starter: false, growth: false, scale: true, enterprise: true },
  { name: "Dedicated Onboarding", starter: false, growth: false, scale: true, enterprise: true },
  { name: "SLA", starter: false, growth: false, scale: "99.99%", enterprise: "Custom" },
  { name: "Private Deployment", starter: false, growth: false, scale: false, enterprise: true },
  { name: "SSO / SAML", starter: false, growth: false, scale: false, enterprise: true },
  { name: "Dedicated Account Manager", starter: false, growth: false, scale: false, enterprise: true },
];

export function ComparisonTable() {
  const renderCell = (value: string | boolean) => {
    if (value === true) return <Check className="w-5 h-5 mx-auto text-indigo-400 drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]" />;
    if (value === false) return <Minus className="w-4 h-4 mx-auto text-neutral-600" />;
    return <span className="text-[15px] text-white font-semibold tracking-wide">{value}</span>;
  };

  return (
    <div className="w-full max-w-[85rem] mx-auto px-6 lg:px-12">
      <div className="relative border border-white/[0.08] rounded-3xl bg-[#0a0a0a] shadow-[0_8px_40px_rgba(0,0,0,0.8)] overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-xl py-6 px-8 font-semibold text-[16px] text-neutral-400 border-r border-white/[0.08] w-1/3 min-w-[240px]">
                Features
              </th>
              
              <th className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-xl py-6 px-6 text-center w-1/6 min-w-[160px] border-r border-white/[0.08] bg-indigo-500/[0.03]">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-indigo-400 tracking-wide mb-1">Starter</span>
                  <div className="h-6" /> {/* Spacer to match badges */}
                </div>
              </th>

              <th className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-xl py-6 px-6 text-center w-1/6 min-w-[160px] border-r border-white/[0.08]">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-white tracking-wide mb-1">Growth</span>
                  <div className="h-6" /> {/* Spacer to match badges */}
                </div>
              </th>

              <th className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-xl py-6 px-6 text-center w-1/6 min-w-[160px] border-r border-white/[0.08]">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-white tracking-wide mb-2">Scale</span>
                  <div className="px-3 py-1 bg-white/[0.04] border border-white/10 rounded-full shadow-sm">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Coming Soon</span>
                  </div>
                </div>
              </th>

              <th className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-xl py-6 px-6 text-center w-1/6 min-w-[160px]">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-white tracking-wide mb-2">Enterprise</span>
                  <div className="px-3 py-1 bg-white/[0.04] border border-white/10 rounded-full shadow-sm">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Coming Soon</span>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_FEATURES.map((feature, idx) => (
              <tr 
                key={idx}
                className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03] transition-all duration-300 group"
              >
                <td className="sticky left-0 z-10 bg-[#0a0a0a] group-hover:bg-[#111] transition-colors duration-300 py-5 px-8 text-[15px] font-medium text-neutral-300 border-r border-white/[0.08]">
                  {feature.name}
                </td>
                <td className="py-5 px-6 text-center bg-indigo-500/[0.02] group-hover:bg-indigo-500/[0.05] transition-colors duration-300">
                  {renderCell(feature.starter)}
                </td>
                <td className="py-5 px-6 text-center">
                  {renderCell(feature.growth)}
                </td>
                <td className="py-5 px-6 text-center">
                  {renderCell(feature.scale)}
                </td>
                <td className="py-5 px-6 text-center">
                  {renderCell(feature.enterprise)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
