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
    question: "What is Krixai?",
    answer: "Krixai is a runtime AI security firewall that inspects prompts before they reach your LLM. It acts as a middle layer, analyzing incoming requests for threats and returning ALLOW, WARN, or BLOCK decisions based on your policies."
  },
  {
    question: "Which AI providers are supported?",
    answer: "Krixai is entirely provider-agnostic. Because it sits between your application backend and the LLM via a standard REST API, it works with any AI provider you choose to use, including OpenAI, Anthropic, Google Gemini, Cohere, and others."
  },
  {
    question: "How long does integration take?",
    answer: "Most developers can integrate Krixai into their existing application flow in just a few minutes using our straightforward REST API endpoints. You only need to pass the prompt to our API before sending it to your model."
  },
  {
    question: "Does Krixai store my prompts?",
    answer: "Prompt data is temporarily cached for processing and retained for a maximum of 30 days solely for the purpose of populating your workspace's threat logs. Your prompts are never used to train our models."
  },
  {
    question: "What attacks can Krixai detect?",
    answer: "Krixai detects prompt injections, jailbreak attempts, adversarial attacks, and sensitive data leakage (PII) before they can reach your underlying model or compromise your system."
  },
  {
    question: "Will Krixai slow down my application?",
    answer: "Krixai is engineered for low-latency runtime security. Our inspection engine is highly optimized to ensure that adding the security layer introduces minimal overhead to your request pipeline."
  },
  {
    question: "What happens when a threat is detected?",
    answer: "When an incoming prompt is flagged, Krixai issues an immediate ALLOW, WARN, or BLOCK decision. You can configure how strict these decisions should be using customizable workspace policies."
  },
  {
    question: "Can I use Krixai in production?",
    answer: "Yes, Krixai is designed to be highly reliable and fail-open by default—meaning if Krixai is temporarily unavailable, your requests can be configured to pass through without breaking your application."
  }
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full bg-black py-24 lg:py-32 overflow-hidden flex flex-col items-center border-t border-white/[0.04]">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.05),transparent_70%)] pointer-events-none" />

      <div className="max-w-[48rem] mx-auto px-6 lg:px-8 w-full relative z-10 flex flex-col items-center">

        {/* Section Header */}
        <p className="text-[12px] text-neutral-500 mb-4 font-semibold uppercase tracking-[0.2em] text-center">
          Frequently Asked Questions
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-medium tracking-tight text-neutral-50 text-balance leading-[1.15] mb-6 text-center">
          Everything you need to know before integrating Krixai.
        </h2>
        <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-12" />

        {/* Accordion */}
        <div className="w-full space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={cn(
                  "border rounded-2xl overflow-hidden transition-all duration-300",
                  isOpen ? "bg-white/[0.04] border-white/10" : "bg-transparent border-white/[0.04] hover:border-white/[0.08]"
                )}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:rounded-2xl"
                  aria-expanded={isOpen}
                >
                  <span className={cn(
                    "font-medium text-[15px] sm:text-base pr-4 transition-colors",
                    isOpen ? "text-white" : "text-neutral-300"
                  )}>
                    {faq.question}
                  </span>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
                    isOpen ? "bg-white/10" : "bg-white/[0.03]"
                  )}>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-neutral-400 transition-transform duration-300",
                      isOpen ? "rotate-180" : ""
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
                      <div className="px-6 pb-6 text-neutral-400 leading-[1.6] text-[15px]">
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
