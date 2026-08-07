import React from "react";
import { KeyRound, ShieldAlert, Activity, EyeOff } from "lucide-react";

export function BestPractices() {
  const practices = [
    {
      icon: KeyRound,
      title: "Never expose API keys",
      desc: "Store your krixai API keys securely in backend environment variables. Never bundle them in client-side code."
    },
    {
      icon: ShieldAlert,
      title: "Inspect every prompt",
      desc: "Ensure 100% of user-generated content passes through the firewall before reaching the model."
    },
    {
      icon: Activity,
      title: "Monitor risk scores",
      desc: "Use the dashboard to track aggregate risk scores and adjust your policy thresholds over time."
    },
    {
      icon: EyeOff,
      title: "Log blocked requests",
      desc: "Maintain an audit trail of blocked requests to identify malicious actors or refine edge cases."
    }
  ];

  return (
    <div id="best-practices" className="flex flex-col pt-16 pb-12 border-t border-white/[0.08] scroll-mt-24">
      <h2 className="text-2xl font-semibold text-white mb-2">Best Practices</h2>
      <p className="text-[15px] text-neutral-400 leading-relaxed mb-8">
        Keep these principles in mind as you deploy krixai into production environments.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {practices.map((practice, i) => {
          const Icon = practice.icon;
          return (
            <div key={i} className="flex flex-col p-5 rounded-xl bg-[#050505] border border-white/[0.05]">
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-4">
                <Icon className="w-4 h-4 text-neutral-400" />
              </div>
              <h3 className="text-[14px] font-semibold text-white mb-2">{practice.title}</h3>
              <p className="text-[13px] text-neutral-400 leading-relaxed">
                {practice.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
