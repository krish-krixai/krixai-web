import React from "react";
import { ShieldAlert, Unlock, Fingerprint, EyeOff, Hash, Users, ArrowRightLeft, Wrench, RefreshCw, Braces } from "lucide-react";

export function ThreatCoverage() {
  const threats = [
    { icon: ShieldAlert, title: "Prompt Injection", description: "Malicious instructions designed to override original system prompts." },
    { icon: Unlock, title: "Jailbreaks", description: "Techniques used to bypass AI safety filters and usage guidelines." },
    { icon: Fingerprint, title: "Prompt Extraction", description: "Attempts to reveal proprietary system instructions or secrets." },
    { icon: EyeOff, title: "Sensitive Data Leakage", description: "Prevents PII, API keys, and credentials from reaching the model." },
    { icon: Hash, title: "Unicode Obfuscation", description: "Detects hidden payloads masked with homoglyphs or encoding tricks." },
    { icon: Users, title: "Role Manipulation", description: "Blocks attempts to force the model into unauthorized personas." },
    { icon: ArrowRightLeft, title: "Indirect Injection", description: "Detects threats embedded in retrieved documents or external content." },
    { icon: Wrench, title: "Tool Abuse", description: "Prevents unauthorized execution of connected plugins or APIs." },
    { icon: RefreshCw, title: "Multi-turn Attacks", description: "Identifies complex attacks spread across conversation history." },
    { icon: Braces, title: "Encoded Payloads", description: "Blocks base64, hex, or custom encoded malicious instructions." }
  ];

  return (
    <section className="relative w-full bg-black py-24 lg:py-32 overflow-hidden flex flex-col items-center border-t border-white/[0.04]">
      <div className="absolute inset-0 bg-[#020202] pointer-events-none" />
      
      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full relative z-10 flex flex-col items-center">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-20">
          <p className="text-[12px] text-neutral-500 mb-5 font-semibold uppercase tracking-[0.2em]">
            Threat Coverage
          </p>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white text-balance leading-[1.1]">
            Comprehensive protection against modern AI attacks.
          </h2>
        </div>

        {/* Threat Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {threats.map((threat, i) => {
            const Icon = threat.icon;
            return (
              <div 
                key={i}
                className="group relative flex flex-col p-6 rounded-[20px] bg-[#050505] border border-white/[0.05] hover:bg-[#080808] hover:border-white/[0.1] transition-all duration-300 ease-out"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-[10px] bg-white/[0.03] border border-white/[0.08] group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-colors duration-300">
                    <Icon className="w-4 h-4 text-neutral-400 group-hover:text-indigo-400 transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  
                  {/* Status Badge */}
                  <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Protected</span>
                  </div>
                </div>

                <h3 className="text-[16px] font-semibold text-white tracking-wide mb-2">
                  {threat.title}
                </h3>
                <p className="text-[13px] text-neutral-400 leading-relaxed">
                  {threat.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
