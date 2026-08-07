import { Metadata } from "next";
import { CheckCircle2, Shield, Lock, AlertTriangle, Mail, Database } from "lucide-react";

export const metadata: Metadata = {
  title: "Security & Trust",
  description: "How Krixai handles your data and protects your infrastructure.",
};

export default function SecurityPage() {
  return (
    <main className="flex-1 w-full flex flex-col bg-black overflow-hidden pt-32 lg:pt-40 min-h-screen">
      <div className="max-w-[65rem] mx-auto px-6 lg:px-12 w-full relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-start max-w-2xl mb-24">
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-medium tracking-tight text-white text-balance leading-[1.1] mb-6">
            Security & Trust
          </h1>
          <p className="text-lg lg:text-[19px] text-neutral-400 max-w-xl leading-[1.6] font-normal tracking-wide">
            How Krixai handles your data and protects your infrastructure.
          </p>
        </div>

        <div className="space-y-16 lg:space-y-24 mb-32">
          
          {/* Section 1 - Data We Process */}
          <section className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div className="w-full md:w-1/3 shrink-0">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Database className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-[20px] font-medium text-white">Data We Process</h2>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <ul className="space-y-4">
                {[
                  "Prompt text submitted for scanning",
                  "Scan decision (ALLOW/WARN/BLOCK)",
                  "Risk score and attack category",
                  "Timestamp and API key identifier (not the key itself)"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-neutral-500 mr-3 shrink-0 mt-0.5" />
                    <span className="text-[16px] text-neutral-300 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 2 - Data We Do NOT Store */}
          <section className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div className="w-full md:w-1/3 shrink-0">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-[20px] font-medium text-white">Data We Do NOT Store</h2>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <ul className="space-y-4">
                {[
                  "Prompt content is not retained beyond 30 days",
                  "Your prompts are never used to train our models",
                  "We do not sell or share your data with third parties"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                    <span className="text-[16px] text-neutral-300 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 3 - Security Practices */}
          <section className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div className="w-full md:w-1/3 shrink-0">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <Lock className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-[20px] font-medium text-white">Security Practices</h2>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <ul className="space-y-4">
                {[
                  "All data encrypted in transit using TLS 1.3",
                  "API keys stored as hashed values"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-neutral-500 mr-3 shrink-0 mt-0.5" />
                    <span className="text-[16px] text-neutral-300 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 4 - Failure Behavior */}
          <section className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div className="w-full md:w-1/3 shrink-0">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <h2 className="text-[20px] font-medium text-white">Failure Behavior</h2>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <div className="p-6 rounded-2xl bg-[#050505] border border-white/[0.05]">
                <p className="text-[16px] text-neutral-300 leading-relaxed">
                  Krixai is designed to fail-open: if our service is unavailable, your requests pass through to your LLM provider without interruption.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 - Contact */}
          <section className="flex flex-col md:flex-row gap-8 md:gap-16 pt-8 border-t border-white/[0.04]">
            <div className="w-full md:w-1/3 shrink-0">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-10 h-10 rounded-full bg-neutral-500/10 flex items-center justify-center border border-neutral-500/20">
                  <Mail className="w-5 h-5 text-neutral-400" />
                </div>
                <h2 className="text-[20px] font-medium text-white">Contact</h2>
              </div>
            </div>
            <div className="w-full md:w-2/3 space-y-6">
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">Security Issues</span>
                <a href="mailto:security@krixaisecurity.com" className="text-[16px] text-blue-400 hover:text-blue-300 transition-colors">
                  security@krixaisecurity.com
                </a>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">Responsible Disclosure</span>
                <span className="text-[16px] text-neutral-300 leading-relaxed">
                  If you discover a vulnerability in Krixai, please email <a href="mailto:security@krixaisecurity.com" className="text-emerald-400 hover:text-emerald-300 transition-colors">security@krixaisecurity.com</a>.
                </span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
