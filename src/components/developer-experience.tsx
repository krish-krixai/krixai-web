"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Terminal,
  Key,
  ShieldCheck,
  Activity,
  Cpu,
  Zap,
  Layers,
  Server,
  CheckCircle2,
  Copy,
  Check
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ----------------------------------------------------------------------
// DATA
// ----------------------------------------------------------------------

const CODE_SNIPPETS = {
  python: `from krixai import Krixai

# Initialize with your API key
client = Krixai(api_key="YOUR_API_KEY")

# Secure your AI request before it hits the model
response = client.secure(
    prompt=user_input,
    provider="openai",
    model="gpt-4o",
    temperature=0.7
)

if response.is_safe:
    print(response.completion)
else:
    print(f"Blocked: {response.threat_type}")`,
  typescript: `import { Krixai } from '@krixai/sdk';

// Initialize with your API key
const client = new Krixai({ apiKey: 'YOUR_API_KEY' });

// Secure your AI request before it hits the model
const response = await client.secure({
  prompt: userInput,
  provider: 'openai',
  model: 'gpt-4o',
  temperature: 0.7
});

if (response.isSafe) {
  console.log(response.completion);
} else {
  console.log(\`Blocked: \${response.threatType}\`);
}`,
  curl: `curl -X POST https://api.krixai.com/v1/secure \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Translate this to French: Hello",
    "provider": "openai",
    "model": "gpt-4o",
    "temperature": 0.7
  }'`
};

const TIMELINE_STEPS = [
  { id: 1, title: "Install SDK", icon: Terminal, desc: "Add our lightweight package to your project." },
  { id: 2, title: "Add API Key", icon: Key, desc: "Authenticate with zero infrastructure changes." },
  { id: 3, title: "Wrap AI Request", icon: ShieldCheck, desc: "Pass your prompt through our secure endpoint." },
  { id: 4, title: "Block Attacks", icon: Activity, desc: "Get enterprise-grade protection instantly." },
];

const TRUST_CARDS = [
  { title: "Universal SDKs", desc: "Works with Python, TypeScript, Go and REST APIs.", icon: Layers },
  { title: "Ultra-Low Latency", desc: "Designed for production with minimal overhead.", icon: Zap },
  { title: "Flexible Deployment", desc: "Cloud, self-hosted and hybrid environments.", icon: Server },
];

// ----------------------------------------------------------------------
// COMPONENTS
// ----------------------------------------------------------------------

function TypewriterCode({ code, language }: { code: string, language: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayedText("");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentIndex(0);
  }, [code]);

  useEffect(() => {
    if (currentIndex < code.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + code[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 15); // typing speed
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, code]);

  // Syntax highlighting logic (simplified for display)
  const renderHighlightedText = (text: string) => {
    if (language === 'python' || language === 'typescript') {
      return text.split(/(\\n| )/).map((part, i) => {
        if (part === '\n') return <br key={i} />;
        if (part === ' ') return <span key={i}>&nbsp;</span>;

        if (part.startsWith('//') || part.startsWith('#')) return <span key={i} className="text-[#6A737D]">{part}</span>;
        if (['from', 'import', 'const', 'new', 'await', 'if', 'else', 'return'].includes(part)) return <span key={i} className="text-[#F97583]">{part}</span>;
        if (['client', 'response', 'userInput', 'console'].includes(part)) return <span key={i} className="text-[#E1E4E8]">{part}</span>;
        if (['Krixai', 'print'].includes(part)) return <span key={i} className="text-[#B392F0]">{part}</span>;
        if (['secure', 'log'].includes(part)) return <span key={i} className="text-[#79B8FF]">{part}</span>;
        if (part.includes('"') || part.includes("'") || part.includes('\`')) return <span key={i} className="text-[#9ECBFF]">{part}</span>;
        if (!isNaN(Number(part))) return <span key={i} className="text-[#79B8FF]">{part}</span>;
        if (['=', ':', '==', '===', '{', '}', '(', ')', '[', ']', '.', ','].includes(part)) return <span key={i} className="text-[#E1E4E8]">{part}</span>;

        return <span key={i} className="text-[#E1E4E8]">{part}</span>;
      });
    }

    // cURL simplified
    return text.split(/(\\n| )/).map((part, i) => {
      if (part === '\n') return <br key={i} />;
      if (part === ' ') return <span key={i}>&nbsp;</span>;
      if (part === 'curl') return <span key={i} className="text-[#B392F0]">{part}</span>;
      if (part.startsWith('-')) return <span key={i} className="text-[#F97583]">{part}</span>;
      if (part.startsWith('"') || part.startsWith("'")) return <span key={i} className="text-[#9ECBFF]">{part}</span>;
      return <span key={i} className="text-[#E1E4E8]">{part}</span>;
    });
  };

  return (
    <div className="font-mono text-[13px] leading-[1.6] text-neutral-300">
      {renderHighlightedText(displayedText)}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="inline-block w-1.5 h-3.5 bg-indigo-400 ml-0.5 align-middle"
      />
    </div>
  );
}

function LiveResultCard() {
  const [latency, setLatency] = useState(11);
  const [risk, setRisk] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => (prev === 11 ? 14 : prev === 14 ? 12 : 11));
      setRisk(prev => (prev === 12 ? 15 : prev === 15 ? 13 : 12));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="w-full bg-[#050505] border border-white/[0.06] rounded-2xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent pointer-events-none" />

      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.04]">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[13px] font-medium text-emerald-400 tracking-wide">Request Protected</span>
        </div>
        <div className="flex items-center space-x-1.5 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-1">
          <Cpu className="w-3 h-3 text-neutral-400" />
          <span className="text-[10px] font-medium text-neutral-300">OpenAI</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-1">Risk Score</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-medium text-white tabular-nums tracking-tight">{risk}</span>
            <span className="text-[10px] text-neutral-500">/100</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-1">Latency Added</span>
          <span className="text-xl font-medium text-white tabular-nums tracking-tight">{latency} ms</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-1">Threats</span>
          <span className="text-xl font-medium text-white tabular-nums tracking-tight">0</span>
        </div>
      </div>
    </motion.div>
  );
}

export function DeveloperExperience() {
  const [activeTab, setActiveTab] = useState<"python" | "typescript" | "curl">("python");
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full bg-black py-24 lg:py-32 overflow-hidden flex flex-col items-center border-t border-white/[0.04]">
      {/* Premium Minimal Background */}
      <div className="absolute inset-0 bg-[#020202] pointer-events-none" />
      <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

      <div
        ref={containerRef}
        className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full relative z-10 flex flex-col items-center"
      >

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left w-full mb-16 lg:mb-20"
        >
          <p className="text-[12px] text-neutral-500 mb-5 font-semibold uppercase tracking-[0.2em]">
            Developer Experience
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-[3.25rem] font-medium tracking-tight text-white text-balance leading-[1.1] mb-5">
            Protect your AI in minutes, not weeks.
          </h2>
          <p className="text-lg lg:text-[19px] text-neutral-400 max-w-2xl leading-[1.6] font-normal tracking-wide">
            Add krixai between your application and any LLM using a lightweight SDK or API. No architecture rewrite required.
          </p>
        </motion.div>

        {/* Main Split Layout */}
        <div className="flex flex-col lg:flex-row w-full gap-12 lg:gap-16 mb-20">

          {/* LEFT: Code Editor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full relative group"
          >
            {/* Editor Glow (Removed for clarity) */}
            <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-3xl pointer-events-none" />

            <div className="bg-[#050505] border border-white/10 rounded-3xl overflow-hidden relative z-10 flex flex-col h-[400px] lg:h-[460px]">

              {/* Editor Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04] bg-white/[0.01]">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-white/[0.1] border border-white/[0.1]" />
                  <div className="w-3 h-3 rounded-full bg-white/[0.1] border border-white/[0.1]" />
                  <div className="w-3 h-3 rounded-full bg-white/[0.1] border border-white/[0.1]" />
                </div>

                {/* Tabs */}
                <div className="flex items-center space-x-1 bg-white/[0.03] rounded-lg p-1 border border-white/[0.04]">
                  {(['python', 'typescript', 'curl'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-[11px] font-medium transition-all duration-200 capitalize",
                        activeTab === tab
                          ? "bg-white/[0.08] text-white shadow-sm"
                          : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.04]"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopy}
                  className="p-1.5 text-neutral-500 hover:text-white hover:bg-white/[0.05] rounded-md transition-colors"
                  aria-label="Copy code"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Editor Body */}
              <div className="flex-1 p-6 overflow-y-auto overflow-x-auto bg-[#050505]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <TypewriterCode code={CODE_SNIPPETS[activeTab]} language={activeTab} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Timeline & Live Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[420px] shrink-0 flex flex-col justify-between space-y-8"
          >
            {/* Timeline */}
            <div className="flex flex-col relative pl-4">
              <div className="absolute left-[27px] top-4 bottom-4 w-[1px] bg-white/[0.06]" />

              {TIMELINE_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                    className="relative flex items-start mb-8 last:mb-0 group cursor-default"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#050505] border border-white/10 flex items-center justify-center relative z-10 shrink-0 group-hover:border-white/30 group-hover:bg-white/5 transition-colors duration-300">
                      <Icon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors duration-300" />
                    </div>

                    <div className="ml-5 flex flex-col pt-0.5">
                      <span className="text-[14px] font-medium text-white mb-1">{step.title}</span>
                      <span className="text-[13px] text-neutral-500 group-hover:text-neutral-400 transition-colors duration-300 leading-relaxed max-w-[280px]">
                        {step.desc}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Live Result Card */}
            <LiveResultCard />

          </motion.div>

        </div>

        {/* BOTTOM ROW: Trust Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {TRUST_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="flex flex-col p-6 rounded-[20px] bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.02] hover:border-white/[0.06] transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-4">
                  <Icon className="w-4 h-4 text-neutral-400" />
                </div>
                <h3 className="text-[14px] font-medium text-white mb-2">{card.title}</h3>
                <p className="text-[13px] text-neutral-500 leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
