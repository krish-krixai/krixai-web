"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Terminal, CheckCircle2, 
  Copy, Download, Play, ShieldAlert, LayoutDashboard,
  BookOpen, Key
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { LogoLockup } from "@/components/logo";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function OnboardingClient() {
  const [step, setStep] = useState(1);
  const totalSteps = 2;
  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // Step 2 State
  const [workspaceName, setWorkspaceName] = useState("");
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  
  const handleCreateWorkspace = async () => {
    setIsCreatingWorkspace(true);
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsCreatingWorkspace(false);
      return;
    }

    const slug = workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const workspaceId = crypto.randomUUID();
    
    const { error: wsError } = await supabase
      .from('workspaces')
      .insert({ id: workspaceId, name: workspaceName, slug, created_by: user.id });

    if (wsError) {
      console.error("wsError", wsError?.message, wsError?.details, wsError);
      setIsCreatingWorkspace(false);
      return;
    }

    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: workspaceId,
        user_id: user.id,
        role: 'OWNER',
        status: 'ACTIVE'
      });
      
    if (memberError) {
      console.error("memberError", memberError?.message, memberError?.details, memberError);
      setIsCreatingWorkspace(false);
      return;
    }

    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `workspace_id=${workspaceId}; path=/; max-age=31536000; SameSite=Lax`;
    
    setIsCreatingWorkspace(false);
    window.location.href = "/dashboard";
  };
  


  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none opacity-50" />
      
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-white/[0.05] z-50">
        <motion.div 
          className="h-full bg-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${(step / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
              className="max-w-md w-full text-center"
            >
              <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                <Logo className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-[40px] font-black text-white tracking-tight mb-4">Welcome to krixai</h1>
              <p className="text-[15px] text-neutral-400 font-medium mb-10 leading-relaxed">
                Let&apos;s secure your AI infrastructure in just a few steps. You&apos;ll be scanning prompts in under three minutes.
              </p>
              <button 
                onClick={nextStep}
                className="h-12 px-8 bg-white text-black hover:bg-neutral-200 rounded-xl text-[14px] font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all flex items-center justify-center mx-auto group"
              >
                Get Started <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="mt-8 text-[12px] font-bold text-neutral-500 uppercase tracking-widest">
                Step 1 of 2
              </div>
            </motion.div>
          )}

          {/* STEP 2: CREATE WORKSPACE */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
              className="max-w-md w-full"
            >
              <div className="text-center mb-10">
                <Link href="/" className="inline-flex items-center group mb-6">
                  <LogoLockup className="h-[32px] w-auto text-white group-hover:text-neutral-300 transition-colors" />
                </Link>
                <p className="text-[14px] text-neutral-400 font-medium">This is where your team will manage policies and API keys.</p>
              </div>

              <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-[24px] p-8 shadow-2xl space-y-6">
                <div className="flex items-center space-x-6 pb-6 border-b border-white/[0.05]">
                  <div className="w-16 h-16 bg-[#111] border border-white/[0.1] rounded-2xl flex items-center justify-center shadow-inner">
                    <span className="text-[20px] font-black text-white">
                      {workspaceName ? workspaceName.substring(0, 2).toUpperCase() : "WS"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-white mb-1">Workspace Logo</h3>
                    <p className="text-[12px] text-neutral-500">Auto-generated from name.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-neutral-300 mb-2">Workspace Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. ACME Corp" 
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full h-12 bg-[#111] border border-white/[0.1] rounded-xl px-4 text-[14px] text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner" 
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-neutral-300 mb-2">Workspace Slug</label>
                  <div className="flex items-center shadow-inner rounded-xl overflow-hidden focus-within:border-indigo-500 border border-white/[0.1] transition-colors">
                    <span className="h-12 px-4 bg-white/[0.02] border-r border-white/[0.1] text-[13px] text-neutral-500 flex items-center select-none font-mono">krixai.com/</span>
                    <input type="text" placeholder="acme" className="flex-1 h-12 bg-[#111] px-4 text-[14px] text-white focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-neutral-300 mb-2">Team Size</label>
                    <select className="w-full h-12 bg-[#111] border border-white/[0.1] rounded-xl px-4 text-[13px] text-white appearance-none focus:outline-none shadow-inner cursor-pointer">
                      <option>1 - 10</option>
                      <option>11 - 50</option>
                      <option>51 - 200</option>
                      <option>201+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-neutral-300 mb-2">Industry</label>
                    <select className="w-full h-12 bg-[#111] border border-white/[0.1] rounded-xl px-4 text-[13px] text-white appearance-none focus:outline-none shadow-inner cursor-pointer">
                      <option>Technology</option>
                      <option>Finance</option>
                      <option>Healthcare</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8">
                <button onClick={prevStep} className="h-12 px-6 text-[13px] font-bold text-neutral-400 hover:text-white transition-colors">Back</button>
                <div className="text-[12px] font-bold text-neutral-500 uppercase tracking-widest absolute left-1/2 -translate-x-1/2">Step 2 of 2</div>
                <button 
                  onClick={handleCreateWorkspace} 
                  disabled={!workspaceName || isCreatingWorkspace}
                  className="h-12 px-8 bg-indigo-600 disabled:bg-indigo-600/50 disabled:text-white/50 hover:bg-indigo-500 rounded-xl text-[14px] font-bold text-white transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:shadow-none"
                >
                  {isCreatingWorkspace ? "Creating..." : "Continue"}
                </button>
              </div>
            </motion.div>
          )}



        </AnimatePresence>
      </div>
    </div>
  );
}
