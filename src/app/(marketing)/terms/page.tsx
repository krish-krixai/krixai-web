import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Krixai.",
};

const Section = ({ num, children }: { num: string, children: React.ReactNode }) => (
  <div className="flex flex-col md:flex-row gap-2 md:gap-8 mb-8 group">
    <div className="md:w-16 text-[#64748B] font-mono text-sm shrink-0 pt-1 group-hover:text-white transition-colors">{num}</div>
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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#000000] pt-32 pb-32 px-6 font-sans">
      <div className="max-w-[800px] mx-auto">
        <div className="mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Terms of Service</h1>
          <p className="text-[#64748B] text-sm font-medium uppercase tracking-widest">Last updated: August 2026</p>
        </div>

        <div className="text-[#A1A1AA] leading-[1.9] text-[17px] font-medium space-y-6 mb-16">
          <p>
            These Terms of Service ("Terms") govern your access to and use of Krixai's services, including our API, dashboard, documentation, and website (collectively, the "Service"), operated by Krixai ("Krixai," "we," "us," or "our").
          </p>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you are using the Service on behalf of an organization, you represent that you have authority to bind that organization to these Terms.
          </p>
        </div>

        <Heading>1. Account Terms</Heading>
        <Section num="1.1">You must provide a valid email address to create an account.</Section>
        <Section num="1.2">You are responsible for maintaining the security of your account credentials and API keys. Krixai is not liable for any loss or damage resulting from unauthorized use of your account.</Section>
        <Section num="1.3">You must be at least 18 years old or the age of legal majority in your jurisdiction to use the Service.</Section>
        <Section num="1.4">A single account may not be shared by multiple people. Each individual user must have their own account. A single account may be used to create multiple API keys for different environments (e.g., development, staging, production).</Section>
        <Section num="1.5">You are responsible for all activity that occurs under your account, including API usage by your applications.</Section>

        <Heading>2. Description of Service</Heading>
        <Section num="2.1">Krixai provides an AI security service that scans requests and responses to and from large language model (LLM) APIs for potential security threats, including but not limited to prompt injection, jailbreak attempts, and personally identifiable information (PII) leakage.</Section>
        <Section num="2.2">Krixai operates as a proxy or standalone scanning API. When used in proxy mode, Krixai forwards your requests to your designated LLM provider using credentials you supply. Krixai does not provide LLM inference services directly.</Section>
        <Section num="2.3">Krixai's detection is provided on a best-effort basis. While we strive for high accuracy, no security system can guarantee detection of all threats. Krixai is not liable for threats that pass through the Service undetected.</Section>

        <Heading>3. API Usage</Heading>
        <Section num="3.1">You may access the Service only through the documented API endpoints and SDKs. Automated access is permitted and expected.</Section>
        <Section num="3.2">You must not attempt to circumvent rate limits, usage quotas, or other restrictions associated with your plan.</Section>
        <Section num="3.3">You must not use the Service to scan, process, or transmit content that is illegal under applicable law.</Section>
        <Section num="3.4">You must not reverse-engineer, decompile, or attempt to extract the detection models, algorithms, or source code of the Service.</Section>
        <Section num="3.5">You must not resell access to the Service without prior written agreement from Krixai.</Section>

        <Heading>4. Your LLM Provider Credentials</Heading>
        <Section num="4.1">When using Krixai in proxy mode, you supply your own API keys for your LLM provider (e.g., OpenAI, Anthropic, Google). These credentials are used solely to forward your requests to your designated provider.</Section>
        <Section num="4.2"><span className="text-white font-semibold">Krixai does not store your LLM provider API keys.</span> Keys provided via request headers are held in memory only for the duration of the request and are never written to disk or included in logs. If you use our optional key vault feature, keys are encrypted at rest using AES-256 and decrypted only in memory at request time.</Section>
        <Section num="4.3">You are solely responsible for your relationship with your LLM provider, including compliance with their terms of service, usage policies, and billing.</Section>
        <Section num="4.4">Krixai is not responsible for charges incurred with your LLM provider as a result of requests proxied through the Service.</Section>

        <Heading>5. Payment and Billing</Heading>
        <Section num="5.1">The Free plan is available at no cost, subject to the usage limits specified on our pricing page.</Section>
        <Section num="5.2">Paid plans (Starter, Pro, Enterprise) are billed monthly in advance. Overage charges for requests exceeding your plan's included quota are billed in arrears at the end of each billing cycle.</Section>
        <Section num="5.3">All fees are stated in US Dollars (USD) and are exclusive of applicable taxes. You are responsible for any taxes associated with your use of the Service.</Section>
        <Section num="5.4">Payment is processed through our third-party payment provider (Stripe). By subscribing to a paid plan, you agree to Stripe's terms of service.</Section>
        <Section num="5.5"><span className="text-white font-semibold">Refunds:</span> If you are unsatisfied with the Service, you may request a refund within 14 days of your first paid subscription. Refunds are not available for subsequent billing periods. Overage charges are non-refundable.</Section>
        <Section num="5.6">Krixai reserves the right to change pricing with 30 days' advance notice. Price changes will take effect at the start of your next billing cycle following the notice period.</Section>
        <Section num="5.7">If payment fails, we will attempt to charge your payment method up to 3 times over 10 days. If payment continues to fail, your account will be downgraded to the Free plan.</Section>

        <Heading>6. Service Availability</Heading>
        <Section num="6.1">Krixai targets 99.9% uptime for paid plans, measured monthly, excluding scheduled maintenance.</Section>
        <Section num="6.2"><span className="text-white font-semibold">Fail-Open Design:</span> In the event of a Krixai service disruption, the Service is designed to fail open — requests will be passed directly to your LLM provider without scanning. Your application will not experience downtime due to Krixai unavailability.</Section>
        <Section num="6.3">Scheduled maintenance will be announced at least 48 hours in advance via email and our status page.</Section>

        <Heading>7. Data Handling</Heading>
        <Section num="7.1">For detailed information about how Krixai processes and handles your data, please refer to our <a href="/privacy" className="text-[#8B5CF6] hover:text-[#00D4FF] transition-colors">Privacy Policy</a>.</Section>
        <Section num="7.2"><span className="text-white font-semibold">In summary:</span> Krixai processes request and response content in real-time for security scanning purposes. We do not store the content of your prompts or model responses. Detection logs contain metadata only (timestamps, detection categories, confidence scores, actions taken).</Section>
        <Section num="7.3">Krixai does not use customer data to train detection models unless you explicitly opt in to our anonymized threat intelligence program.</Section>

        <Heading>8. Intellectual Property</Heading>
        <Section num="8.1">Krixai retains all rights, title, and interest in the Service, including all software, models, algorithms, documentation, and trademarks.</Section>
        <Section num="8.2">You retain all rights to your data, including the content of requests and responses that pass through the Service.</Section>
        <Section num="8.3">Krixai does not claim any ownership rights over your data.</Section>

        <Heading>9. Limitation of Liability</Heading>
        <Section num="9.1"><span className="uppercase text-[14px] leading-relaxed block">TO THE MAXIMUM EXTENT PERMITTED BY LAW, KRIXAI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, BUSINESS OPPORTUNITIES, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.</span></Section>
        <Section num="9.2"><span className="uppercase text-[14px] leading-relaxed block">KRIXAI'S TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR IN CONNECTION WITH THESE TERMS SHALL NOT EXCEED THE AMOUNTS PAID BY YOU TO KRIXAI IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.</span></Section>
        <Section num="9.3"><span className="uppercase text-[14px] leading-relaxed block">THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE." KRIXAI MAKES NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</span></Section>
        <Section num="9.4">Krixai does not warrant that the Service will detect all security threats, prevent all data leakage, or be error-free. You acknowledge that no security system provides absolute protection.</Section>

        <Heading>10. Termination</Heading>
        <Section num="10.1">You may cancel your account at any time from your dashboard or by emailing hello@krixai.com. Cancellation takes effect at the end of your current billing period.</Section>
        <Section num="10.2">Krixai may suspend or terminate your account if you violate these Terms, engage in abusive behavior, or fail to pay applicable fees.</Section>
        <Section num="10.3">Upon termination, your right to access the Service ceases immediately. Detection logs associated with your account will be retained for the period specified in your plan, after which they will be deleted.</Section>
        <Section num="10.4">Sections 8, 9, and 11 survive termination of these Terms.</Section>

        <Heading>11. General</Heading>
        <Section num="11.1"><span className="text-white font-semibold">Modifications:</span> We may update these Terms from time to time. We will notify you of material changes via email or a notice on the Service at least 30 days before they take effect. Continued use of the Service after changes take effect constitutes acceptance of the updated Terms.</Section>
        <Section num="11.2"><span className="text-white font-semibold">Severability:</span> If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.</Section>
        <Section num="11.3"><span className="text-white font-semibold">Entire Agreement:</span> These Terms, together with the Privacy Policy, constitute the entire agreement between you and Krixai regarding the Service.</Section>

        <div className="mt-24 pt-8 border-t border-white/10 flex items-center justify-between">
          <p className="text-[#A1A1AA] font-medium">Questions?</p>
          <a href="mailto:hello@krixai.com" className="text-[#8B5CF6] hover:text-[#00D4FF] font-medium transition-colors">hello@krixai.com</a>
        </div>

      </div>
    </div>
  );
}
