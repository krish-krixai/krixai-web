"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Server,
  Terminal,
  Database,
  Cpu,
  Code2,
  Globe,
  ShieldCheck,
  LockOpen,
  Rocket,
  CheckCircle2,
  Box,
  Layers,
  Cloud,
  Network
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ----------------------------------------------------------------------
// DATA
// ----------------------------------------------------------------------

const APPS = [
  { id: "python", name: "Python", icon: Terminal, type: "Language", desc: "Native Python SDK" },
  { id: "node", name: "Node.js", icon: Code2, type: "Runtime", desc: "NPM Package Integration" },
  { id: "fastapi", name: "FastAPI", icon: Globe, type: "Framework", desc: "Middleware Integration" },
  { id: "go", name: "Go", icon: Box, type: "Language", desc: "Go Module Integration" },
  { id: "java", name: "Java", icon: Database, type: "Language", desc: "Maven Dependency" },
];

const MODELS = [
  { id: "openai", name: "OpenAI", icon: Cloud, type: "Provider", desc: "Direct API Integration" },
  { id: "claude", name: "Claude", icon: Network, type: "Provider", desc: "Anthropic API Integration" },
  { id: "gemini", name: "Gemini", icon: Cpu, type: "Provider", desc: "Google AI Integration" },
  { id: "groq", name: "Groq", icon: Server, type: "Provider", desc: "LPU Inference Engine" },
  { id: "openrouter", name: "OpenRouter", icon: Globe, type: "Routing", desc: "Unified API Access" },
  { id: "azure", name: "Azure OpenAI", icon: Cloud, type: "Enterprise", desc: "Azure Native Integration" },
  { id: "bedrock", name: "AWS Bedrock", icon: Database, type: "Enterprise", desc: "AWS Native Integration" },
];

const INTEGRATIONS_DATA = {
  providers: ["OpenAI", "Anthropic", "Gemini", "Groq", "OpenRouter", "Azure OpenAI", "AWS Bedrock"],
  frameworks: ["LangChain", "LlamaIndex", "Vercel AI SDK", "Semantic Kernel", "Haystack"],
  languages: ["Python", "TypeScript", "Node.js", "Go", "Java"]
};

// ----------------------------------------------------------------------
// ANIMATION VARIANTS (STAGGERED REVEAL)
// ----------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: "easeOut" as const }
  }
};

// ----------------------------------------------------------------------
// COMPONENTS
// ----------------------------------------------------------------------

function SvgConnection({
  reverse = false,
  isActive = false
}: {
  reverse?: boolean;
  isActive?: boolean;
}) {
  const pathId = reverse ? "path-reverse" : "path-forward";
  const startColor = "rgba(59, 130, 246, 0.4)"; // Semantic Blue

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-visible pointer-events-none">
      <svg className="w-full h-[120px] overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 120">
        <path
          id={pathId}
          d={reverse
            ? "M 100,60 C 70,60 30,60 0,60"
            : "M 0,60 C 30,60 70,60 100,60"
          }
          fill="none"
          stroke={isActive ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)"}
          strokeWidth="1"
          className="transition-colors duration-500"
        />

        {/* Animated Packets */}
        <motion.circle r="1.5" fill={startColor} style={{ filter: "drop-shadow(0 0 4px currentColor)" }}>
          <animateMotion
            dur={reverse ? "3s" : "2.5s"}
            repeatCount="indefinite"
            path={reverse ? "M 100,60 C 70,60 30,60 0,60" : "M 0,60 C 30,60 70,60 100,60"}
          />
        </motion.circle>

        <motion.circle r="1.5" fill={startColor} style={{ filter: "drop-shadow(0 0 4px currentColor)" }}>
          <animateMotion
            dur={reverse ? "3s" : "2.5s"}
            begin={reverse ? "1.5s" : "1.25s"}
            repeatCount="indefinite"
            path={reverse ? "M 100,60 C 70,60 30,60 0,60" : "M 0,60 C 30,60 70,60 100,60"}
          />
        </motion.circle>
      </svg>
    </div>
  );
}

export function Integrations() {
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const isLeftActive = APPS.some(a => a.id === activeHover);
  const isRightActive = MODELS.some(m => m.id === activeHover);

  return (
    <section className="relative w-full bg-black py-20 lg:py-28 overflow-hidden flex flex-col items-center border-t border-white/[0.04]">
      {/* Refined Background - Less noise, more depth */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

      <motion.div
        ref={containerRef}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full relative z-10 flex flex-col items-center"
      >

        {/* 1. Section Header & Badges */}
        <motion.div variants={itemVariants} className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Badge icon={LockOpen} text="No Vendor Lock-In" />
            <Badge icon={Layers} text="Works Across Every Major LLM" />
            <Badge icon={Rocket} text="Deploy in Minutes" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-[3.25rem] font-medium tracking-tight text-white text-balance leading-[1.1]">
            Works with the AI stack you already use.
          </h2>
          <p className="text-lg lg:text-[19px] text-neutral-400 max-w-2xl leading-[1.6] font-normal tracking-wide mt-5">
            Protect every AI request without changing your existing infrastructure. Deploy krixai in front of your models and continue building with the tools your team already knows.
          </p>
        </motion.div>

        {/* PRIMARY VISUAL: Architecture Diagram (Scaled up ~10%) */}
        <div className="w-full flex justify-center mb-24">
          <div className="relative flex flex-col lg:flex-row items-center justify-between w-full max-w-[1100px] gap-8 lg:gap-0">

            {/* 3. Left: AI Application Nodes */}
            <motion.div variants={itemVariants} className="flex flex-col w-full lg:w-[280px] bg-[#030303] backdrop-blur-xl border border-white/[0.06] rounded-[24px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] relative z-20 transition-all duration-500">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <Server className="w-4 h-4 text-neutral-400" />
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold text-white tracking-wide">Your AI App</h3>
                  <p className="text-[11px] text-neutral-500">Any Language / Framework</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {APPS.map((app) => (
                  <IntegrationNode
                    key={app.id}
                    item={app}
                    onHover={setActiveHover}
                    isActive={activeHover === app.id}
                  />
                ))}
              </div>
            </motion.div>

            {/* 7. Connection Left to Center */}
            <motion.div variants={itemVariants} className="hidden lg:flex flex-1 items-center justify-center relative h-32 px-2 z-10">
              <SvgConnection isActive={isLeftActive} />
            </motion.div>

            {/* 2. Center: Krixai Gateway (Focal Point) */}
            <motion.div variants={itemVariants} className="flex flex-col items-center justify-center w-full lg:w-[320px] relative z-30 shrink-0">
              {/* Reduced glow brightness, increased depth */}
              <div className={cn(
                "absolute inset-0 bg-blue-500/5 blur-[40px] rounded-full pointer-events-none transition-opacity duration-700",
                (isLeftActive || isRightActive) ? "opacity-100" : "opacity-0"
              )} />

              <div className={cn(
                "w-full bg-[#050505] rounded-3xl p-8 relative overflow-hidden transition-all duration-700 border",
                (isLeftActive || isRightActive) ? "border-blue-500/40 scale-[1.01]" : "border-white/10"
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />

                <div className="flex flex-col items-center text-center relative z-10">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-[20px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center relative backdrop-blur-md">
                      <ShieldCheck className="w-7 h-7 text-blue-400" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white tracking-tight mb-2">krixai Gateway</h3>
                  <p className="text-[13px] text-blue-200/60 leading-relaxed font-medium">
                    One unified endpoint.<br />Zero latency impact.<br />Infinite security.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 7. Connection Center to Right */}
            <motion.div variants={itemVariants} className="hidden lg:flex flex-1 items-center justify-center relative h-32 px-2 z-10">
              <SvgConnection reverse isActive={isRightActive} />
            </motion.div>

            {/* 3. Right: LLM Provider Nodes */}
            <motion.div variants={itemVariants} className="flex flex-col w-full lg:w-[280px] bg-[#030303] backdrop-blur-xl border border-white/[0.06] rounded-[24px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] relative z-20 transition-all duration-500">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <Cpu className="w-4 h-4 text-neutral-400" />
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold text-white tracking-wide">LLM Providers</h3>
                  <p className="text-[11px] text-neutral-500">Universal Support</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {MODELS.slice(0, 5).map((model) => (
                  <IntegrationNode
                    key={model.id}
                    item={model}
                    onHover={setActiveHover}
                    isActive={activeHover === model.id}
                  />
                ))}
              </div>
            </motion.div>

            {/* Mobile connections fallback */}
            <div className="flex lg:hidden w-full items-center justify-center my-[-20px] z-10 opacity-30">
              <div className="h-12 w-[1px] bg-gradient-to-b from-white/10 via-white/20 to-white/10" />
            </div>

          </div>
        </div>

        {/* SECONDARY VISUAL: Integrations Grid (Staggered rows) */}
        <motion.div variants={itemVariants} className="w-full max-w-[1100px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* 4, 5, 6. Categories */}
            <CategoryColumn title="LLM Providers" items={INTEGRATIONS_DATA.providers} delay={0.1} />
            <CategoryColumn title="Frameworks" items={INTEGRATIONS_DATA.frameworks} delay={0.2} />
            <CategoryColumn title="Languages" items={INTEGRATIONS_DATA.languages} delay={0.3} />
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

function Badge({ icon: Icon, text }: { icon: React.ElementType, text: string }) {
  return (
    <div className="flex items-center space-x-2 bg-white/[0.02] border border-white/[0.06] rounded-full px-3.5 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
      <Icon className="w-3.5 h-3.5 text-neutral-400" strokeWidth={2} />
      <span className="text-[11px] font-medium text-neutral-300 tracking-wide uppercase">{text}</span>
    </div>
  );
}

function IntegrationNode({
  item,
  onHover,
  isActive
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any,
  onHover: (id: string | null) => void,
  isActive: boolean
}) {
  const Icon = item.icon;

  return (
    <div
      className="relative group"
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className={cn(
        "flex items-center space-x-3 bg-white/[0.015] border rounded-[14px] px-4 py-2.5 transition-all duration-300 ease-out cursor-default",
        isActive ? "bg-white/[0.06] border-white/[0.15] scale-[1.03] shadow-[0_8px_20px_rgba(0,0,0,0.3)]" : "border-white/[0.03] hover:border-white/[0.08]"
      )}>
        <Icon className={cn(
          "w-4 h-4 transition-colors duration-300",
          isActive ? "text-blue-400" : "text-neutral-500"
        )} strokeWidth={1.5} />
        <span className={cn(
          "text-[12px] font-medium tracking-wide transition-colors duration-300",
          isActive ? "text-white" : "text-neutral-300"
        )}>
          {item.name}
        </span>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-48 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-[16px] p-4 shadow-[0_20px_40px_rgba(0,0,0,0.8)] z-50 pointer-events-none hidden lg:block"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Icon className="w-3.5 h-3.5 text-neutral-400" strokeWidth={1.5} />
              <span className="text-[11px] font-semibold text-white uppercase tracking-wider">{item.type}</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed font-medium">
              {item.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryColumn({ title, items, delay }: { title: string, items: string[], delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col"
    >
      <div className="mb-5 flex items-center">
        <h4 className="text-[12px] font-semibold text-neutral-500 uppercase tracking-[0.2em]">{title}</h4>
        <div className="ml-4 flex-1 h-[1px] bg-white/[0.04]" />
      </div>
      <div className="flex flex-col space-y-1.5">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-3 rounded-[14px] bg-white/[0.01] hover:bg-white/[0.03] border border-transparent hover:border-white/[0.05] transition-all duration-300 group cursor-default"
          >
            <span className="text-[13px] text-neutral-500 group-hover:text-neutral-300 transition-colors duration-300 font-medium tracking-wide">
              {item}
            </span>
            <CheckCircle2 className="w-4 h-4 text-neutral-600 group-hover:text-emerald-500/80 transition-colors duration-300" strokeWidth={1.5} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
