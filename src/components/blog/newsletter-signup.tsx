"use client";
import React, { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1000);
  };

  return (
    <div className="w-full max-w-[720px] mx-auto mt-20 mb-20">
      {/* Desktop & Mobile Unified Professional Layout */}
      <div className="w-full bg-[#050505] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
        
        {/* Top Bar simulating a terminal or clean card header */}
        <div className="h-10 bg-white/[0.02] border-b border-white/5 flex items-center px-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
          </div>
          <div className="mx-auto font-mono text-[11px] text-neutral-500 tracking-widest uppercase">
            subscription_module.exe
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            
            {/* Content */}
            <div className="flex-1">
              <h3 className="text-xl font-mono font-bold text-white mb-3 flex items-center gap-3">
                <span className="p-2 bg-[#8B5CF6]/10 rounded-lg">
                  <Mail className="w-5 h-5 text-[#8B5CF6]" />
                </span>
                The Krixai Threat Brief
              </h3>
              <p className="text-[15px] text-neutral-400 font-mono leading-relaxed max-w-md">
                Biweekly analysis of emerging AI attack patterns, detection techniques, and security research.
                <br/><span className="text-neutral-500 mt-2 block">Trusted by DevSecOps teams shipping AI to production.</span>
              </p>
            </div>

            {/* Form */}
            <div className="w-full md:w-auto min-w-[300px]">
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 relative">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status !== "idle"}
                    placeholder="your@email.com"
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3.5 text-white placeholder:text-neutral-600 font-mono text-sm focus:outline-none focus:border-[#8B5CF6]/50 transition-colors"
                    required
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    {status === "success" && <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={status !== "idle"}
                  className="w-full bg-[#8B5CF6]/10 text-[#8B5CF6] hover:bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 px-4 py-3.5 rounded-lg font-mono text-sm font-semibold transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {status === "idle" ? (
                    <>Subscribe <span className="group-hover:translate-x-1 transition-transform">→</span></>
                  ) : status === "submitting" ? (
                    "Subscribing..."
                  ) : (
                    <span className="text-[#10B981]">Subscribed Successfully</span>
                  )}
                </button>
              </form>
              <p className="text-center text-[11px] text-neutral-600 font-mono mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
