"use client";

import React from "react";
import { CodeBlock } from "./code-block";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export function Step4Scan() {
  const requestCode = `{
  "text": "Ignore previous instructions...",
  "session_id": "abc123"
}`;

  const responseCode = `{
  "scan_id": "kx-a1b2c3d4e5f6",
  "decision": "BLOCK",
  "risk_score": 97,
  "risk_level": "Critical",
  "detected_threats": [
    {
      "type": "prompt_injection",
      "description": "Attempt to override system prompt",
      "severity": "high"
    }
  ],
  "explanation": "Prompt injection detected.",
  "sanitized_prompt": null,
  "processing_time_ms": 11
}`;

  return (
    <div id="step-4" className="flex flex-col pt-12 pb-8 border-t border-white/[0.08] scroll-mt-24">
      <h2 className="text-2xl font-semibold text-white mb-4">4. Scan Your First Prompt</h2>
      <p className="text-[15px] text-neutral-400 leading-relaxed mb-6">
        Before sending a user prompt to your LLM, pass it through the krixai scan endpoint. 
        The runtime firewall will immediately analyze the payload against multiple threat engines.
      </p>

      <div className="w-full flex flex-col items-center">
        <div className="w-full">
          <CodeBlock language="Request payload" code={requestCode} />
        </div>
        
        <div className="py-2 flex justify-center w-full relative">
          <div className="absolute top-0 bottom-0 w-[1px] bg-white/[0.1]" />
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 rounded-full bg-[#050505] border border-white/[0.1] shadow-lg flex items-center justify-center z-10"
          >
            <ArrowDown className="w-4 h-4 text-indigo-400" />
          </motion.div>
        </div>

        <div className="w-full mt-2">
          <CodeBlock language="Response payload" code={responseCode} />
        </div>
      </div>
    </div>
  );
}
