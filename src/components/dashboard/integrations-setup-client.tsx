"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Circle, Copy, Terminal, ExternalLink,
  Shield, Server, Key, AlertTriangle, Book, HelpCircle,
  PlayCircle, RefreshCw, ChevronRight, ChevronDown, Check
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Provider = "OpenAI" | "Anthropic" | "Gemini" | "Groq" | "OpenRouter" | "AWS Bedrock" | "Azure OpenAI";
type SDK = "Python" | "TypeScript" | "REST" | "Docker Proxy";

const PROVIDERS: { name: Provider, status: string, sdk: string }[] = [
  { name: "OpenAI", status: "Operational", sdk: "Official SDK supported" },
  { name: "Anthropic", status: "Operational", sdk: "Official SDK supported" },
  { name: "Gemini", status: "Operational", sdk: "Official SDK supported" },
  { name: "Groq", status: "Operational", sdk: "REST recommended" },
  { name: "OpenRouter", status: "Operational", sdk: "REST recommended" },
  { name: "AWS Bedrock", status: "Operational", sdk: "AWS SDK supported" },
  { name: "Azure OpenAI", status: "Operational", sdk: "Azure SDK supported" },
];

const METHODS: { name: SDK, desc: string, time: string, disabled?: boolean }[] = [
  { name: "Python", desc: "Native Python client for standard integrations.", time: "2 mins" },
  { name: "TypeScript", desc: "Type-safe Node.js and Edge client.", time: "2 mins" },
  { name: "REST", desc: "Direct HTTP API for custom implementations.", time: "5 mins" },
  { name: "Docker Proxy", desc: "Zero-code proxy for existing apps. Coming soon.", time: "10 mins", disabled: true },
];

const ERRORS = [
  { title: "Invalid API Key", content: "Ensure you are using a valid krixai API key. Test your key in the dashboard settings before deploying." },
  { title: "Connection Timeout", content: "Check if your network allows outbound connections to api.krixai.com over port 443." },
  { title: "Provider Not Configured", content: "Ensure you have routed your AI provider traffic through krixai properly using our base URL." },
  { title: "Rate Limit Exceeded", content: "You have exceeded your plan limits. Upgrade your tier in the Billing settings." },
];

export function IntegrationsSetupClient() {
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState<Provider>("OpenAI");
  const [sdk, setSdk] = useState<SDK>("Python");
  const [apiKey, setApiKey] = useState("krix_••••••••••••••••");
  
  // Test State
  const [testStage, setTestStage] = useState(0); // 0: Idle, 1: Connecting, 2: Sending, 3: Receiving, 4: Success
  const [isCopied, setIsCopied] = useState(false);

  // Success screen
  const [isComplete, setIsComplete] = useState(false);

  // Common Errors Acc
  const [openError, setOpenError] = useState<number | null>(null);

  const checklist = [
    { label: "API Key Created", done: step > 3 || (step === 3 && apiKey !== "krix_••••••••••••••••") },
    { label: "SDK Installed", done: step > 3 },
    { label: "Environment Variables Added", done: step > 3 },
    { label: "Connection Verified", done: testStage >= 1 },
    { label: "First Prompt Scanned", done: testStage === 4 },
  ];

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const runTest = () => {
    // Replaced simulated test with instruction to use CLI
    setIsComplete(true);
  };

  const getCodeSnippet = () => {
    if (sdk === "Python") {
      return `import krixai\nfrom openai import OpenAI\n\n# 1. Initialize krixai Client\nkrixai.api_key = "${apiKey === "krix_••••••••••••••••" ? "YOUR_KRIXAI_KEY" : apiKey}"\n\n# 2. Wrap your provider\nclient = krixai.wrap(OpenAI())\n\n# 3. Securely scan & route prompt\nresponse = client.chat.completions.create(\n    model="gpt-4",\n    messages=[{"role": "user", "content": "Hello!"}]\n)\n\nprint(response.choices[0].message)`;
    }
    if (sdk === "TypeScript") {
      return `import { krixai } from 'krixai';\nimport OpenAI from 'openai';\n\n// 1. Initialize krixai Client\nconst krixaiClient = new krixai('${apiKey === "krix_••••••••••••••••" ? "YOUR_KRIXAI_KEY" : apiKey}');\n\n// 2. Wrap your provider\nconst client = krixaiClient.wrap(new OpenAI());\n\n// 3. Securely scan & route prompt\nconst response = await client.chat.completions.create({\n    model: 'gpt-4',\n    messages: [{ role: 'user', content: 'Hello!' }]\n});\n\nconsole.log(response.choices[0].message);`;
    }
    return `curl -X POST https://api.krixai.com/v1/scan \\\n  -H "Authorization: Bearer ${apiKey === "krix_••••••••••••••••" ? "YOUR_KRIXAI_KEY" : apiKey}" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "provider": "${provider.toLowerCase()}",\n    "prompt": "Hello!",\n    "route_if_safe": true\n  }'`;
  };

  if (isComplete) {
    return (
      <div className="flex-1 flex items-center justify-center relative">
        {/* Confetti simulation using CSS or framer motion can be complex, using a glowing backdrop instead */}
        <div className="absolute inset-0 bg-green-500/5 blur-[100px] rounded-full pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-[#0a0a0a] border border-white/[0.08] rounded-3xl p-12 max-w-2xl w-full text-center shadow-2xl relative z-10"
        >
          <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
            <span className="text-4xl">🎉</span>
          </div>
          <h1 className="text-[32px] font-black text-white tracking-tight mb-4">Integration Complete</h1>
          <p className="text-[16px] text-neutral-400 font-medium mb-10 max-w-md mx-auto leading-relaxed">
            Your AI application is now protected by krixai. All incoming prompts are being actively monitored and secured.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/dashboard" className="w-full sm:w-auto px-8 h-12 bg-white text-black hover:bg-neutral-200 rounded-xl text-[14px] font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all flex items-center justify-center">
              Open Dashboard
            </a>
            <a href="/dashboard/playground" className="w-full sm:w-auto px-8 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[14px] font-bold shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center">
              Open Playground
            </a>
            <a href="/dashboard/threat-logs" className="w-full sm:w-auto px-8 h-12 bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1] rounded-xl text-[14px] font-bold transition-all flex items-center justify-center">
              View Threat Logs
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-8 border-b border-white/[0.05]">
        <div>
          <h1 className="text-[32px] font-extrabold tracking-tight text-white mb-2">Integrate krixai</h1>
          <p className="text-[15px] text-neutral-400 font-medium">Connect your AI application in just a few guided steps.</p>
        </div>
        <div className="mt-6 md:mt-0 flex items-center space-x-6 text-right">
          <div>
            <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Progress</p>
            <p className="text-[14px] font-bold text-indigo-400 flex items-center justify-end"><CheckCircle2 className="w-4 h-4 mr-2" /> Step {step} of 4</p>
          </div>
          <div className="w-px h-8 bg-white/[0.1]" />
          <div>
            <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Estimated Time</p>
            <p className="text-[14px] font-bold text-white flex items-center justify-end"><ClockIcon className="w-4 h-4 mr-2 text-neutral-400" /> 5 minutes</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT COLUMN: WIZARD */}
        <div className="flex-1 w-full flex flex-col space-y-8">
          
          <AnimatePresence mode="wait">
            
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h2 className="text-[20px] font-bold text-white mb-1">Choose AI Provider</h2>
                  <p className="text-[14px] text-neutral-400 font-medium">Select the primary model provider you intend to use.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PROVIDERS.map((p) => (
                    <button 
                      key={p.name}
                      onClick={() => setProvider(p.name)}
                      className={cn(
                        "p-5 rounded-2xl border text-left transition-all relative overflow-hidden",
                        provider === p.name ? "bg-indigo-500/5 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.15)]" : "bg-[#0a0a0a] border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]"
                      )}
                    >
                      {provider === p.name && <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />}
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center font-black text-white">{p.name.charAt(0)}</div>
                        {provider === p.name && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
                      </div>
                      <h3 className="text-[15px] font-bold text-white mb-1">{p.name}</h3>
                      <div className="flex items-center space-x-2 text-[11px] font-medium text-neutral-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> <span>{p.status}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h2 className="text-[20px] font-bold text-white mb-1">Select Integration Method</h2>
                  <p className="text-[14px] text-neutral-400 font-medium">Choose how you want to connect your application.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {METHODS.map((m) => (
                    <button 
                      key={m.name}
                      disabled={m.disabled}
                      onClick={() => setSdk(m.name)}
                      className={cn(
                        "p-6 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-36",
                        m.disabled ? "bg-black/50 border-white/[0.03] opacity-50 cursor-not-allowed" : 
                        sdk === m.name ? "bg-indigo-500/5 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.15)]" : "bg-[#0a0a0a] border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]"
                      )}
                    >
                      {sdk === m.name && <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-[16px] font-bold text-white">{m.name}</h3>
                          {m.disabled && <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 bg-white/[0.05] px-2 py-1 rounded">Soon</span>}
                          {sdk === m.name && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
                        </div>
                        <p className="text-[13px] text-neutral-400 font-medium leading-relaxed">{m.desc}</p>
                      </div>
                      <div className="text-[11px] font-bold text-neutral-500 flex items-center"><ClockIcon className="w-3.5 h-3.5 mr-1.5" /> {m.time} setup</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h2 className="text-[20px] font-bold text-white mb-1">Configuration</h2>
                  <p className="text-[14px] text-neutral-400 font-medium">Generate your API key and configure your environment.</p>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Workspace</p>
                      <div className="flex items-center space-x-2 text-white font-medium text-[14px]">
                        <div className="w-5 h-5 rounded bg-white/[0.1] flex items-center justify-center font-bold text-[10px]">AC</div>
                        <span>ACME Corp</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Environment</p>
                      <span className="text-[12px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">Production</span>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5">API Endpoint</p>
                      <div className="h-10 bg-[#111] border border-white/[0.05] rounded-xl flex items-center px-4 text-[13px] text-white font-mono shadow-inner">
                        https://api.krixai.com/v1
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/[0.05] pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[13px] font-bold text-white flex items-center"><Key className="w-4 h-4 mr-2 text-indigo-400" /> API Key</p>
                      <a href="/dashboard/api-keys" className="text-[12px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center">
                        Go to API Keys <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                      </a>
                    </div>
                    <div className="flex space-x-3">
                      <div className="flex-1 h-12 bg-[#111] border border-white/[0.1] rounded-xl flex items-center px-4 text-[14px] text-white font-mono shadow-inner">
                        {apiKey}
                      </div>
                      <button onClick={handleCopy} className="h-12 px-6 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] rounded-xl text-white text-[13px] font-bold transition-colors flex items-center justify-center w-28">
                        {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <><Copy className="w-4 h-4 mr-2" /> Copy</>}
                      </button>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h2 className="text-[20px] font-bold text-white mb-1">Live Connection Test</h2>
                  <p className="text-[14px] text-neutral-400 font-medium">Verify your setup by running the code snippet in your own environment.</p>
                </div>
                
                <div className="bg-[#050505] border border-white/[0.08] rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] shadow-inner relative overflow-hidden text-center">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.05),transparent_70%)] pointer-events-none" />
                  
                  <Terminal className="w-12 h-12 text-indigo-500/50 mb-4 z-10" />
                  <p className="text-[14px] font-medium text-neutral-300 max-w-sm mb-6 z-10">
                    Copy the dynamic code sample below and execute it to send your first secure scan to the engine.
                  </p>

                  <button 
                    onClick={runTest}
                    className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[14px] font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all flex items-center z-10"
                  >
                    Finish Guide
                  </button>

                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* DYNAMIC CODE MODULE */}
          {step > 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-4 border-t border-white/[0.05]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-bold text-white flex items-center"><Terminal className="w-4 h-4 mr-2" /> Live Code Sample</h3>
                <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">Dynamic</span>
              </div>
              <div className="bg-[#050505] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl relative">
                <div className="flex items-center px-4 h-11 border-b border-white/[0.05] bg-[#0a0a0a]">
                  <div className="flex space-x-1.5 mr-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  </div>
                  <div className="text-[12px] font-mono text-neutral-500">{sdk === "Python" ? "main.py" : sdk === "TypeScript" ? "index.ts" : "request.sh"}</div>
                </div>
                <div className="p-5 overflow-x-auto custom-scrollbar">
                  <pre className="text-[13px] font-mono leading-relaxed"><code className="text-neutral-300">{getCodeSnippet()}</code></pre>
                </div>
              </div>
            </motion.div>
          )}

          {/* WIZARD NAVIGATION */}
          <div className="flex items-center justify-between pt-6 border-t border-white/[0.05] mt-auto">
            <button 
              onClick={() => setStep(step - 1)} disabled={step === 1}
              className="h-11 px-6 bg-white/[0.03] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed border border-white/[0.05] rounded-xl text-[13px] font-bold text-white transition-all"
            >
              Back
            </button>
            <button 
              onClick={() => setStep(step + 1)} disabled={step === 4}
              className="h-11 px-6 bg-white text-black hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-[13px] font-bold shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all flex items-center"
            >
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          
          {/* Checklist */}
          <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
            <h3 className="text-[14px] font-bold text-white mb-4">Setup Checklist</h3>
            <div className="space-y-4">
              {checklist.map((item, i) => (
                <div key={i} className="flex items-start space-x-3">
                  {item.done ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
                  )}
                  <span className={cn("text-[13px] font-medium leading-tight", item.done ? "text-neutral-300" : "text-neutral-500")}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Common Errors Accordion */}
          <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
            <h3 className="text-[14px] font-bold text-white mb-4 flex items-center"><AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" /> Common Errors</h3>
            <div className="space-y-2">
              {ERRORS.map((err, i) => (
                <div key={i} className="border border-white/[0.05] rounded-xl overflow-hidden bg-[#111]">
                  <button 
                    onClick={() => setOpenError(openError === i ? null : i)}
                    className="w-full h-10 px-4 flex items-center justify-between text-[12px] font-bold text-neutral-300 hover:text-white transition-colors"
                  >
                    {err.title}
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", openError === i ? "rotate-180" : "")} />
                  </button>
                  <AnimatePresence>
                    {openError === i && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="p-4 pt-0 text-[12px] text-neutral-500 leading-relaxed border-t border-white/[0.05] mt-2">
                          {err.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Help Panel */}
          <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
            <h3 className="text-[14px] font-bold text-white mb-4">Quick Links</h3>
            <div className="space-y-3">
              <a href="/docs" className="flex items-center justify-between text-[13px] text-neutral-400 hover:text-white transition-colors group">
                <span className="flex items-center"><Book className="w-4 h-4 mr-2 opacity-70" /> API Reference</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="/dashboard/playground" className="flex items-center justify-between text-[13px] text-neutral-400 hover:text-white transition-colors group">
                <span className="flex items-center"><PlayCircle className="w-4 h-4 mr-2 opacity-70" /> Playground</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="/contact" className="flex items-center justify-between text-[13px] text-neutral-400 hover:text-white transition-colors group">
                <span className="flex items-center"><HelpCircle className="w-4 h-4 mr-2 opacity-70" /> Support</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ClockIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}
