import React from "react";

export function ApiRateLimits() {
  const limits = [
    { plan: "Starter", reqSec: "50 / sec", reqMonth: "50,000" },
    { plan: "Growth", reqSec: "500 / sec", reqMonth: "250,000" },
    { plan: "Scale", reqSec: "1,500 / sec", reqMonth: "700,000" },
    { plan: "Enterprise", reqSec: "Custom", reqMonth: "Custom" }
  ];

  return (
    <div id="rate-limits" className="flex flex-col pt-12 pb-16 border-t border-white/[0.08] scroll-mt-32">
      <h2 className="text-2xl font-semibold text-white mb-4">Rate Limits</h2>
      <p className="text-[15px] text-neutral-400 leading-relaxed mb-8">
        Rate limits are applied at the organizational level based on your active subscription plan. 
        If you exceed your rate limit, the API will return a <code className="text-neutral-300">429 Too Many Requests</code> response.
      </p>

      <div className="w-full border border-white/[0.08] rounded-xl overflow-hidden bg-[#050505]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="sticky top-0 bg-black/80 backdrop-blur-md py-4 px-6 text-[12px] font-semibold text-neutral-400 uppercase tracking-widest w-1/3">Plan</th>
              <th className="sticky top-0 bg-black/80 backdrop-blur-md py-4 px-6 text-[12px] font-semibold text-neutral-400 uppercase tracking-widest w-1/3 border-l border-white/[0.04]">Requests / Second</th>
              <th className="sticky top-0 bg-black/80 backdrop-blur-md py-4 px-6 text-[12px] font-semibold text-neutral-400 uppercase tracking-widest w-1/3 border-l border-white/[0.04]">Included Scans / Month</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {limits.map((item, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6">
                  <span className="text-[14px] font-medium text-white">{item.plan}</span>
                </td>
                <td className="py-4 px-6 text-[14px] font-mono text-neutral-300">
                  {item.reqSec}
                </td>
                <td className="py-4 px-6 text-[14px] font-mono text-neutral-300">
                  {item.reqMonth}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
