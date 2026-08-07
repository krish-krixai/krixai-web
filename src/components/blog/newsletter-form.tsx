"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="w-full bg-[#0A0A0A] py-20 border-t border-white/[0.04]">
      <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
        <div className="max-w-xl">
          <h3 className="text-xl font-medium tracking-tight text-white mb-2">
            Krixai Research Digest
          </h3>
          <p className="text-neutral-400 text-[14px] leading-[1.6] mb-6">
            Runtime security research, threat intelligence updates, and engineering deep dives. No marketing. Published when we have something worth reading.
          </p>

          {submitted ? (
            <div className="flex items-center gap-2 text-emerald-400 text-[14px] font-medium bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-lg w-fit">
              <span>Subscribed. We will be in touch.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <input
                type="email"
                required
                className="flex-1 max-w-xs bg-white/[0.03] border border-white/[0.08] text-white rounded-lg py-2.5 px-4 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-white/[0.15] focus:border-white/[0.15] transition-all text-[13px] font-medium shadow-sm"
                placeholder="engineer@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="bg-white text-black px-5 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                Subscribe
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
