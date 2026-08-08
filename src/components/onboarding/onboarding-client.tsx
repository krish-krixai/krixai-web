"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Logo } from "@/components/logo";

export function OnboardingClient() {
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleCreateWorkspace = async () => {
    setError(null);
    setIsCreatingWorkspace(true);
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsCreatingWorkspace(false);
      return;
    }

    // 1. Check if user already has a workspace
    const { data: existingMember, error: fetchError } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      setError(`fetchError: ${fetchError.message}`);
      setIsCreatingWorkspace(false);
      return;
    }

    if (existingMember) {
      document.cookie = `workspace_id=${existingMember.workspace_id}; path=/; max-age=31536000; SameSite=Lax`;
      window.location.href = "/dashboard";
      return;
    }

    // 2. Create new workspace
    const finalWorkspaceName = user.user_metadata?.workspace_name || (user.user_metadata?.full_name ? `${user.user_metadata.full_name}'s Workspace` : "My Workspace");
    const workspaceId = crypto.randomUUID();
    const slug = `${finalWorkspaceName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${workspaceId.substring(0, 6)}`;
    
    const { error: wsError } = await supabase
      .from('workspaces')
      .insert({ id: workspaceId, name: finalWorkspaceName, slug, created_by: user.id });

    if (wsError) {
      console.error("wsError", wsError?.message, wsError?.details, wsError);
      setError(`wsError: ${wsError.message}`);
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
      setError(`memberError: ${memberError.message}`);
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
          animate={{ width: "100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <AnimatePresence mode="wait">
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
              Let's secure your AI infrastructure in just a few steps. You'll be scanning prompts in under three minutes.
            </p>
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm text-left">
                {error}
              </div>
            )}
            <button 
              onClick={handleCreateWorkspace}
              disabled={isCreatingWorkspace}
              className="h-12 px-8 bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-400 disabled:cursor-not-allowed rounded-xl text-[14px] font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all flex items-center justify-center mx-auto group"
            >
              {isCreatingWorkspace ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" /> Preparing Workspace...
                </>
              ) : (
                <>
                  Go to Dashboard <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
