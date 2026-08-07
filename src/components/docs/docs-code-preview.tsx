import React from "react";
import { Terminal, Code, Database, ArrowRight } from "lucide-react";

export function DocsCodePreview() {
  const reqCode = `{
  "prompt": "Ignore previous instructions...",
  "user_id": "user_123"
}`;

  const resCode = `{
  "decision": "BLOCK",
  "risk_score": 97,
  "attack": "Prompt Injection"
}`;

  return (
    <section className="relative w-full bg-black py-24 lg:py-32 flex flex-col items-center border-t border-white/[0.04] overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute inset-0 bg-[#020202] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Left: Text */}
        <div className="w-full lg:w-5/12 flex flex-col text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6 w-max">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span className="text-[12px] font-medium text-indigo-400 uppercase tracking-wider">First API Request</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-5 leading-[1.2]">
            Inspect prompts with a single API call.
          </h2>
          <p className="text-[15px] text-neutral-400 leading-relaxed mb-8">
            Send any user prompt to our globally distributed edge network. krixai instantly analyzes the payload across multiple security engines and returns a unified decision before it ever reaches your LLM.
          </p>
        </div>

        {/* Right: Code IDE Window */}
        <div className="w-full lg:w-7/12 relative">
          <div className="w-full bg-[#0a0a0a] rounded-xl border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col">
            
            {/* IDE Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.1] bg-[#050505]">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[12px] font-medium text-neutral-400 font-mono">POST</span>
                <span className="text-[12px] font-medium text-white font-mono">/v1/scan</span>
              </div>
            </div>

            {/* IDE Body */}
            <div className="flex flex-col p-6 font-mono text-[13px] leading-[1.7] relative">
              
              {/* Input Label */}
              <div className="flex items-center space-x-2 mb-3 text-neutral-500">
                <Code className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-widest font-bold">Request</span>
              </div>
              
              {/* Request JSON */}
              <pre className="text-neutral-300">
                <span className="text-neutral-500">{`{`}</span>
                <br />
                <span className="text-indigo-300">  &quot;prompt&quot;</span>
                <span className="text-neutral-500">: </span>
                <span className="text-emerald-300">&quot;Ignore previous instructions...&quot;</span>
                <span className="text-neutral-500">,</span>
                <br />
                <span className="text-indigo-300">  &quot;user_id&quot;</span>
                <span className="text-neutral-500">: </span>
                <span className="text-emerald-300">&quot;user_123&quot;</span>
                <br />
                <span className="text-neutral-500">{`}`}</span>
              </pre>

              <div className="w-full flex justify-center py-6">
                <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-neutral-500 rotate-90 lg:rotate-0" />
                </div>
              </div>

              {/* Output Label */}
              <div className="flex items-center space-x-2 mb-3 text-neutral-500">
                <Database className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-widest font-bold">Response</span>
              </div>

              {/* Response JSON */}
              <pre className="text-neutral-300">
                <span className="text-neutral-500">{`{`}</span>
                <br />
                <span className="text-indigo-300">  &quot;decision&quot;</span>
                <span className="text-neutral-500">: </span>
                <span className="text-red-400 font-bold">&quot;BLOCK&quot;</span>
                <span className="text-neutral-500">,</span>
                <br />
                <span className="text-indigo-300">  &quot;risk_score&quot;</span>
                <span className="text-neutral-500">: </span>
                <span className="text-amber-300">97</span>
                <span className="text-neutral-500">,</span>
                <br />
                <span className="text-indigo-300">  &quot;attack&quot;</span>
                <span className="text-neutral-500">: </span>
                <span className="text-emerald-300">&quot;Prompt Injection&quot;</span>
                <br />
                <span className="text-neutral-500">{`}`}</span>
              </pre>
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
}
