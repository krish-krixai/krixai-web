"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FAQS = [
  {
    question: "How are requests counted?",
    answer: "Each API call to Krixai counts as one request — whether through proxy mode (/v1/chat/completions) or standalone scan (/v1/scan). A single proxied request that scans both input and output counts as one request, not two. Streaming responses count the same as non-streaming."
  },
  {
    question: "What happens when I exceed my included requests?",
    answer: "Free plan: Requests beyond 10,000 are passed through to your LLM unscanned (fail-open). Your app continues to work — you just lose Krixai protection until the next billing cycle. We'll notify you at 80% usage.\n\nStarter & Pro: Overage requests are automatically scanned and billed at your plan's overage rate. No interruption, no cutoff. You'll see real-time usage in your dashboard."
  },
  {
    question: "Do I need a credit card for the Free plan?",
    answer: "No. Sign up with just an email. You won't be asked for a card unless you upgrade."
  },
  {
    question: "Can I switch plans mid-month?",
    answer: "Yes. Upgrades take effect immediately — you get the new plan's features and request quota right away (prorated). Downgrades take effect at the start of your next billing cycle."
  },
  {
    question: "Do you store or train on my data?",
    answer: "No. Krixai processes your requests in real-time and does not store the content of your prompts or model responses. Detection logs contain metadata only: timestamps, detection categories, confidence scores, and actions taken — never the actual text. We never use customer data for model training."
  },
  {
    question: "Does Krixai store my LLM API keys?",
    answer: "No. When you pass your LLM provider key via the Authorization header, it exists in memory only for the duration of the request and is never written to disk, logged, or stored. If you use our key vault feature, keys are encrypted at rest using AES-256 and are only decrypted in memory at request time."
  },
  {
    question: "What if Krixai goes down? Will my AI app break?",
    answer: "No. Krixai is designed to fail-open. If our service is unavailable, requests are routed directly to your LLM provider. Your application continues to function normally — you temporarily lose Krixai's protection, but you never experience downtime because of us. Pro and Enterprise plans include uptime SLAs."
  },
  {
    question: "Is there a long-term contract?",
    answer: "No. All plans are month-to-month. Cancel anytime from your dashboard."
  }
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full bg-black py-24 lg:py-32 overflow-hidden flex flex-col items-center">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.05),transparent_70%)] pointer-events-none" />

      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full relative z-10 flex flex-col items-center">

        {/* Section Header */}
        <p className="text-[12px] text-neutral-500 mb-4 font-semibold uppercase tracking-[0.2em] text-center">
          Frequently Asked Questions
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-medium tracking-tight text-white leading-[1.15] mb-12 text-center max-w-2xl">
          Everything you need to know before integrating Krixai.
        </h2>

        {/* Accordion Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={cn(
                  "border rounded-2xl overflow-hidden transition-all duration-300 h-fit",
                  isOpen ? "bg-[#000000] border-[#8B5CF6]/30 shadow-[0_0_20px_rgba(0,212,255,0.1)]" : "bg-[#050505] border-white/10 hover:border-white/20 hover:bg-[#0A0A0A]"
                )}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-6 flex items-start justify-between text-left focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 focus:rounded-2xl"
                  aria-expanded={isOpen}
                >
                  <span className={cn(
                    "font-medium text-[15px] sm:text-base pr-4 transition-colors leading-snug",
                    isOpen ? "text-[#8B5CF6]" : "text-white"
                  )}>
                    {faq.question}
                  </span>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors mt-[-2px]",
                    isOpen ? "bg-[#8B5CF6]/10" : "bg-white/5"
                  )}>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform duration-300",
                      isOpen ? "text-[#8B5CF6] rotate-180" : "text-neutral-400"
                    )} />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 text-neutral-300 leading-relaxed text-[15px] whitespace-pre-wrap">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
