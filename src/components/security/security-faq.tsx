"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function SecurityFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How much latency does Krixai add?",
      answer: "Our Rust-based inspection engine typically adds sub-second overhead per request on standard workloads. We operate globally distributed edge nodes to ensure proximity to your application and LLM providers."
    },
    {
      question: "Which models are supported?",
      answer: "krixai is completely model-agnostic. Because we inspect the prompt before it reaches the inference layer, we support OpenAI, Anthropic, Gemini, Groq, local open-source models, and any custom architecture."
    },
    {
      question: "Does krixai store prompts?",
      answer: "By default, krixai processes prompts in-memory and does not store the payload. If you opt-in to logging for audit purposes, prompts can be heavily redacted for PII before storage, or you can deploy our on-premise solution."
    },
    {
      question: "Can I deploy on-prem?",
      answer: "Yes, our Enterprise plan includes options for private VPC or completely air-gapped on-premise deployments via Docker or Kubernetes."
    },
    {
      question: "How does risk scoring work?",
      answer: "Every prompt passes through multiple detection engines (heuristics, ML models, and threat intel). Each engine outputs a confidence score which is aggregated into a final Risk Score (0-100). Your custom Policy Engine then decides whether to BLOCK, WARN, or ALLOW based on that score."
    }
  ];

  return (
    <section className="relative w-full bg-black py-24 lg:py-32 flex flex-col items-center border-t border-white/[0.04]">
      <div className="max-w-[48rem] mx-auto px-6 lg:px-12 w-full flex flex-col">
        
        <div className="flex flex-col text-left mb-12">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-4">
            Frequently asked questions
          </h2>
          <p className="text-[16px] text-neutral-400">
            Everything you need to know about krixai security.
          </p>
        </div>

        <div className="flex flex-col border-t border-white/[0.04]">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="border-b border-white/[0.04]">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-left group"
                >
                  <span className={cn(
                    "text-[16px] font-medium transition-colors duration-200",
                    isOpen ? "text-white" : "text-neutral-300 group-hover:text-white"
                  )}>
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={cn(
                      "w-4 h-4 text-neutral-500 transition-transform duration-300",
                      isOpen ? "rotate-180 text-white" : ""
                    )} 
                  />
                </button>
                <div 
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-[200px] pb-6 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <p className="text-[14px] text-neutral-400 leading-relaxed pr-8">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
