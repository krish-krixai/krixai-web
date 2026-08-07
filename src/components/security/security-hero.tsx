"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Shield, Terminal, ArrowDown, Database, Cpu, Activity, AlertCircle, FileText, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export function SecurityHero() {
  return (
    <section className="relative w-full min-h-[90vh] bg-black overflow-hidden flex flex-col justify-center border-b border-white/[0.04]">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[400px] bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-[85rem] mx-auto px-6 lg:px-12 w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-24">
        
        {/* Left Side: Content */}
        <div className="flex flex-col items-start text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8"
          >
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="text-[12px] font-medium text-indigo-400 uppercase tracking-wider">Enterprise Security</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-[4rem] font-medium tracking-tight text-white leading-[1.1] mb-6"
          >
            Security built into every AI request.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="text-lg lg:text-[19px] text-neutral-400 max-w-xl leading-[1.6] font-normal tracking-wide mb-10"
          >
            krixai protects your AI applications against prompt injection, jailbreaks, sensitive data leakage, prompt extraction, Unicode obfuscation, tool abuse and adversarial attacks before requests ever reach your models.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link 
              href="/pricing"
              className="w-full sm:w-auto bg-white text-black px-8 py-3.5 rounded-full text-[14px] font-semibold hover:scale-[1.03] transition-all duration-300 shadow-[0_4px_14px_rgba(255,255,255,0.15)] flex items-center justify-center"
            >
              Get Started
            </Link>
            <Link 
              href="/docs"
              className="w-full sm:w-auto bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] text-white px-8 py-3.5 rounded-full text-[14px] font-medium transition-all duration-300 flex items-center justify-center group"
            >
              <span>View Documentation</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Right Side: Architecture Visualization */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative w-full h-[600px] flex flex-col items-center justify-between bg-[#050505] border border-white/[0.05] rounded-[2rem] p-8 overflow-hidden shadow-2xl"
        >
          {/* Animated Packet */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ 
              y: [0, 480], 
              opacity: [0, 1, 1, 1, 0],
              scale: [0.8, 1, 1, 1, 0.8]
            }}
            transition={{ 
              duration: 3.5, 
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.1, 0.5, 0.9, 1]
            }}
            className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_12px_4px_rgba(99,102,241,0.5)] z-20"
          />

          {/* User Prompt */}
          <div className="relative z-10 w-full max-w-[280px] bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 flex items-center justify-center gap-3 backdrop-blur-sm">
            <Terminal className="w-5 h-5 text-neutral-400" />
            <span className="text-[14px] font-medium text-white tracking-wide">User Prompt</span>
          </div>

          <ArrowDown className="w-4 h-4 text-white/[0.1] my-2" />

          {/* Runtime Firewall Engine */}
          <div className="relative z-10 w-full bg-[#080808] border border-indigo-500/20 rounded-2xl p-5 shadow-[0_0_40px_rgba(99,102,241,0.05),inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">krixai Runtime Firewall</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 relative">
              <div className="flex items-center gap-2 p-2.5 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                <FileText className="w-4 h-4 text-neutral-500" />
                <span className="text-[11px] text-neutral-300 font-medium">Prompt Normalization</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                <Shield className="w-4 h-4 text-neutral-500" />
                <span className="text-[11px] text-neutral-300 font-medium">Injection Detection</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                <Database className="w-4 h-4 text-neutral-500" />
                <span className="text-[11px] text-neutral-300 font-medium">Data Detection</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                <Activity className="w-4 h-4 text-neutral-500" />
                <span className="text-[11px] text-neutral-300 font-medium">Threat Intelligence</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                <Cpu className="w-4 h-4 text-neutral-500" />
                <span className="text-[11px] text-neutral-300 font-medium">Risk Engine</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                <AlertCircle className="w-4 h-4 text-neutral-500" />
                <span className="text-[11px] text-neutral-300 font-medium">Policy Engine</span>
              </div>
            </div>
          </div>

          <ArrowDown className="w-4 h-4 text-white/[0.1] my-2" />

          {/* Decision */}
          <div className="relative z-10 w-full max-w-[320px] flex justify-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
              <XCircle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">Block</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Warn</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Allow</span>
            </div>
          </div>

          <ArrowDown className="w-4 h-4 text-white/[0.1] my-2" />

          {/* LLM Provider */}
          <div className="relative z-10 w-full max-w-[280px] bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 flex items-center justify-center gap-3 backdrop-blur-sm">
            <Cpu className="w-5 h-5 text-neutral-400" />
            <span className="text-[14px] font-medium text-white tracking-wide">LLM Provider</span>
          </div>

          {/* Connection Line */}
          <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-white/[0.1] to-transparent z-0" />
        </motion.div>

      </div>
    </section>
  );
}
