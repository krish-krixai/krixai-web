import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Krixai.",
};

const Section = ({ num, children }: { num?: string, children: React.ReactNode }) => (
  <div className="flex flex-col md:flex-row gap-2 md:gap-8 mb-8 group">
    {num && <div className="md:w-16 text-[#64748B] font-mono text-sm shrink-0 pt-1 group-hover:text-white transition-colors">{num}</div>}
    {!num && <div className="md:w-16 shrink-0" />}
    <div className="flex-1 text-[#A1A1AA] leading-[1.9] text-[17px] font-medium">
      {children}
    </div>
  </div>
);

const Heading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold text-white tracking-tight mt-20 mb-8 border-b border-white/10 pb-4">
    {children}
  </h2>
);

const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold text-white tracking-tight mt-12 mb-6">
    {children}
  </h3>
);

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#000000] pt-32 pb-32 px-6 font-sans">
      <div className="max-w-[800px] mx-auto">
        <div className="mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-[#64748B] text-sm font-medium uppercase tracking-widest">Last updated: August 2026</p>
        </div>

        <div className="text-[#A1A1AA] leading-[1.9] text-[17px] font-medium space-y-6 mb-16">
          <p>
            Krixai ("Krixai," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect information when you use our AI security service, API, dashboard, and website (collectively, the "Service").
          </p>
          <p>
            As a security company, we hold ourselves to the highest standards of data handling. <span className="text-white font-semibold">We process your data to protect it, not to exploit it.</span>
          </p>
        </div>

        <Heading>1. Information We Collect</Heading>
        
        <SubHeading>1A. Account Information</SubHeading>
        <Section num="1.1">
          When you create an account, we collect:
          <ul className="list-disc pl-6 mt-4 space-y-2 text-[#94A3B8]">
            <li>Email address</li>
            <li>Name (optional)</li>
            <li>Company name (optional)</li>
            <li>Password (hashed, never stored in plaintext)</li>
            <li>Billing information (processed and stored by Stripe; we do not store credit card numbers)</li>
          </ul>
        </Section>

        <SubHeading>1B. Usage Data</SubHeading>
        <Section num="1.2">
          We automatically collect:
          <ul className="list-disc pl-6 mt-4 space-y-2 text-[#94A3B8]">
            <li>API request metadata (timestamps, endpoints called, HTTP status codes)</li>
            <li>Detection events (category, sub-type, confidence score, action taken)</li>
            <li>Request and response sizes (byte counts, not content)</li>
            <li>Latency measurements</li>
            <li>IP addresses of API callers</li>
            <li>Dashboard access logs (pages viewed, features used)</li>
          </ul>
        </Section>

        <SubHeading>1C. Data Processed in Transit (Not Stored)</SubHeading>
        <Section num="1.3">
          When you use Krixai's proxy or scan endpoints, the following data is <span className="text-white font-semibold">processed in real-time but NOT stored</span>:
          <ul className="list-disc pl-6 mt-4 space-y-2 text-[#94A3B8]">
            <li>The content of your prompts (user messages, system prompts)</li>
            <li>The content of LLM responses</li>
            <li>Your LLM provider API keys</li>
          </ul>
        </Section>

        <div className="my-16 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(139,92,246,0.1)]">
          <h3 className="text-[#8B5CF6] text-lg font-semibold mt-0 mb-3 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Core Security Principle
          </h3>
          <p className="m-0 text-[#E2E8F0] leading-relaxed">
            We explicitly architect our systems to avoid storing sensitive AI payload data. We do not want your prompts, and we do not store them.
          </p>
        </div>

        <Heading>2. What We Do NOT Collect or Store</Heading>
        <div className="text-[#A1A1AA] leading-[1.9] text-[17px] font-medium mb-8">
          <p>This section exists because, as a security proxy, we want to be explicit about boundaries:</p>
        </div>
        
        <div className="overflow-x-auto my-8 mb-16">
          <table className="w-full text-left border-collapse rounded-xl overflow-hidden shadow-lg border border-white/10">
            <thead className="bg-[#111827]">
              <tr>
                <th className="px-6 py-5 text-white font-semibold border-b border-white/5 text-sm uppercase tracking-wider">Data</th>
                <th className="px-6 py-5 text-white font-semibold border-b border-white/5 text-sm uppercase tracking-wider">Stored?</th>
                <th className="px-6 py-5 text-white font-semibold border-b border-white/5 text-sm uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-[#050505] divide-y divide-white/5">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-5 font-medium text-white">Prompt content</td>
                <td className="px-6 py-5"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EF4444]/10 text-[#EF4444] text-xs font-bold uppercase tracking-widest"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> No</span></td>
                <td className="px-6 py-5 text-sm text-[#94A3B8] leading-relaxed">Processed in memory for scanning. Never written to disk or database.</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-5 font-medium text-white">LLM responses</td>
                <td className="px-6 py-5"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EF4444]/10 text-[#EF4444] text-xs font-bold uppercase tracking-widest"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> No</span></td>
                <td className="px-6 py-5 text-sm text-[#94A3B8] leading-relaxed">Processed in memory for output scanning. Never stored.</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-5 font-medium text-white">LLM API keys</td>
                <td className="px-6 py-5"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EF4444]/10 text-[#EF4444] text-xs font-bold uppercase tracking-widest"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> No</span></td>
                <td className="px-6 py-5 text-sm text-[#94A3B8] leading-relaxed">Passed through in memory. Never logged. (Unless using Key Vault, then AES-256 encrypted).</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-5 font-medium text-white">Detection text</td>
                <td className="px-6 py-5"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EF4444]/10 text-[#EF4444] text-xs font-bold uppercase tracking-widest"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> No</span></td>
                <td className="px-6 py-5 text-sm text-[#94A3B8] leading-relaxed">Logs contain metadata (category, confidence) but never the actual text that triggered it.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Heading>3. How We Use Your Information</Heading>
        <Section num="3.1">
          We use the information we collect to:
          <ul className="list-disc pl-6 mt-4 space-y-3 text-[#94A3B8]">
            <li>Provide the Service (scan requests, detect threats)</li>
            <li>Authenticate your API requests</li>
            <li>Display detection events in your dashboard</li>
            <li>Process payments via Stripe</li>
            <li>Send critical service notifications</li>
            <li>Improve detection accuracy using aggregate, anonymized metadata</li>
          </ul>
        </Section>
        
        <Section num="3.2">
          <span className="text-white font-semibold">We do NOT use your information to:</span>
          <ul className="mt-4 space-y-3 text-[#94A3B8]">
            <li className="flex items-center gap-3"><svg className="text-[#EF4444] shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> Train AI/ML models on your prompt content</li>
            <li className="flex items-center gap-3"><svg className="text-[#EF4444] shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> Sell or share your data with third parties</li>
            <li className="flex items-center gap-3"><svg className="text-[#EF4444] shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> Profile you or your users for advertising</li>
          </ul>
        </Section>

        <Heading>4. Threat Intelligence</Heading>
        <Section num="4.1">Krixai may offer an opt-in program where anonymized detection patterns (not content) are aggregated across customers to improve detection models.</Section>
        <Section num="4.2">This program is <span className="text-white font-semibold">strictly opt-in</span>. You will never be enrolled automatically.</Section>
        <Section num="4.3">If you opt in, only detection metadata is used. The actual content of the prompt or response is never included.</Section>
        <Section num="4.4">You may opt out at any time from your dashboard.</Section>

        <Heading>5. Data Retention</Heading>
        <Section num="5.1">
          <ul className="space-y-4 text-[#94A3B8]">
            <li><span className="text-white font-semibold block mb-1">Account information:</span> Retained until account deletion + 30 days.</li>
            <li><span className="text-white font-semibold block mb-1">Detection logs:</span> Retained per your plan (3 days – 1 year) and automatically deleted.</li>
            <li><span className="text-white font-semibold block mb-1">Request content:</span> Retained for <strong>0 seconds</strong>. Processed in real-time, never persisted.</li>
          </ul>
        </Section>

        <Heading>6. Data Security</Heading>
        <Section num="6.1">
          We implement the following security measures to protect your data:
          <ul className="list-disc pl-6 mt-4 space-y-3 text-[#94A3B8]">
            <li><span className="text-white">Encryption in transit:</span> All data is transmitted over TLS 1.3</li>
            <li><span className="text-white">Encryption at rest:</span> All stored data is encrypted using AES-256</li>
            <li><span className="text-white">Access control:</span> Internal access restricted to authorized personnel</li>
            <li><span className="text-white">Infrastructure:</span> Hosted on SOC2-certified cloud infrastructure</li>
          </ul>
        </Section>

        <Heading>7. Sub-Processors</Heading>
        <Section num="7.1">
          We use the following third-party services to operate Krixai:
          <ul className="list-disc pl-6 mt-4 space-y-3 text-[#94A3B8]">
            <li><span className="text-white">Stripe:</span> Payment processing</li>
            <li><span className="text-white">Railway / Fly.io:</span> Infrastructure hosting</li>
            <li><span className="text-white">Cloudflare:</span> DNS, DDoS protection, CDN</li>
            <li><span className="text-white">Upstash:</span> Rate limiting (Redis)</li>
            <li><span className="text-white">Resend:</span> Transactional & newsletter email</li>
          </ul>
        </Section>

        <Heading>8. Your Rights</Heading>
        <Section num="8.1">Depending on your jurisdiction, you may have the right to access, rectify, erase, restrict, or object to the processing of your personal data. To exercise any of these rights, contact us at hello@krixai.com. We will respond within 30 days.</Section>

        <Heading>9. International Data</Heading>
        <Section num="9.1">Krixai processes data in the United States. If you are located outside the United States, your data will be transferred to and processed in the United States.</Section>

        <Heading>10. Children's Privacy</Heading>
        <Section num="10.1">The Service is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children.</Section>

        <Heading>11. Cookies</Heading>
        <Section num="11.1">We use only essential cookies required for the Service to function, such as authentication sessions. We do not use analytics cookies, advertising cookies, or third-party tracking cookies.</Section>

        <Heading>12. Changes</Heading>
        <Section num="12.1">We may update this Privacy Policy from time to time. We will notify you of material changes via email or a notice on the Service at least 30 days before they take effect.</Section>

        <div className="mt-24 pt-8 border-t border-white/10 flex items-center justify-between">
          <p className="text-[#A1A1AA] font-medium">Questions?</p>
          <a href="mailto:hello@krixai.com" className="text-[#8B5CF6] hover:text-[#00D4FF] font-medium transition-colors">hello@krixai.com</a>
        </div>

      </div>
    </div>
  );
}
