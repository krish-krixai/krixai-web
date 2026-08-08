"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Book, Shield, FileCode, Mail } from "lucide-react";

export function ResearchCta() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="w-full bg-black py-24 border-t border-white/[0.04]">
      <div className="max-w-[85rem] mx-auto px-6 lg:px-12">
        <div className="flex flex-col gap-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-medium tracking-tight text-white">
            Continue Exploring Krixai
          </h2>
          <p className="text-neutral-400 text-[15px] lg:text-[16px] max-w-2xl leading-[1.6]">
            Deepen your understanding of AI runtime security through our documentation, threat intelligence reports, and product capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <Link href="/research/category/threat-intel" className="group flex flex-col p-6 bg-[#0A0A0A] border border-white/[0.06] rounded-xl hover:bg-[#111111] hover:border-white/[0.1] transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-white font-medium text-[16px] mb-2">Threat Intelligence</h3>
            <p className="text-neutral-500 text-[13px] leading-[1.5] mb-6 flex-1">
              Read the latest quarterly threat report on AI application vulnerabilities.
            </p>
            <div className="flex items-center text-neutral-400 text-[12px] font-medium group-hover:text-white transition-colors">
              <span>View Reports</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2 */}
          <Link href="/dashboard" className="group flex flex-col p-6 bg-[#0A0A0A] border border-white/[0.06] rounded-xl hover:bg-[#111111] hover:border-white/[0.1] transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
              <ActivityIcon className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-white font-medium text-[16px] mb-2">Runtime Firewall</h3>
            <p className="text-neutral-500 text-[13px] leading-[1.5] mb-6 flex-1">
              Discover how Krixai intercepts malicious prompts before they reach the model.
            </p>
            <div className="flex items-center text-neutral-400 text-[12px] font-medium group-hover:text-white transition-colors">
              <span>Explore Product</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3 */}
          <Link href="https://docs.krixaisecurity.com" className="group flex flex-col p-6 bg-[#0A0A0A] border border-white/[0.06] rounded-xl hover:bg-[#111111] hover:border-white/[0.1] transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5">
              <FileCode className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-white font-medium text-[16px] mb-2">Engineering Docs</h3>
            <p className="text-neutral-500 text-[13px] leading-[1.5] mb-6 flex-1">
              Technical documentation for implementing Krixai into your AI stack.
            </p>
            <div className="flex items-center text-neutral-400 text-[12px] font-medium group-hover:text-white transition-colors">
              <span>Read Docs</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4 - Newsletter */}
          <div className="flex flex-col p-6 bg-[#0A0A0A] border border-white/[0.06] rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
              <Mail className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-white font-medium text-[16px] mb-2">Research Digest</h3>
            <p className="text-neutral-500 text-[13px] leading-[1.5] mb-6 flex-1">
              Receive updates when we publish new engineering deep dives.
            </p>
            
            {submitted ? (
              <div className="text-emerald-400 text-[12px] font-medium mt-auto">
                Subscribed successfully.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-auto">
                <input
                  type="email"
                  required
                  placeholder="engineer@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] text-white rounded-lg py-2 px-3 text-[12px] placeholder:text-neutral-600 focus:outline-none focus:border-white/[0.2]"
                />
                <button type="submit" className="w-full bg-white text-black text-[12px] font-semibold py-2 rounded-lg hover:bg-neutral-200 transition-colors">
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

function ActivityIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
