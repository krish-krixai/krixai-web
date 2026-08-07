"use client";

import React, { useState, useEffect } from "react";
import { 
  CreditCard, ArrowUpRight, CheckCircle2, Lock, FileText, 
  Download, Clock, Calendar, ArrowRight, ShieldCheck,
  Zap, ArrowRightLeft, DollarSign, Briefcase, Activity, Check
} from "lucide-react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function BillingClient() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-neutral-500">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-[14px] font-medium">Loading Billing Center...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 pb-10 space-y-8 max-w-7xl mx-auto w-full">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-30 mb-2">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-white mb-1.5">Billing</h1>
          <p className="text-[15px] text-neutral-400">Manage your subscription, payment methods and invoices.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="h-10 px-5 bg-[#0A0A0A] border border-white/[0.08] rounded-lg text-[14px] font-medium text-neutral-300 hover:text-white hover:bg-white/[0.04] flex items-center transition-colors">
            Contact Sales
          </button>
          <button className="h-10 px-5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[14px] font-medium text-white flex items-center transition-colors shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <ArrowUpRight className="w-4 h-4 mr-2" /> Upgrade Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Main billing components */}
        <div className="lg:col-span-2 flex flex-col space-y-6">
          
          {/* NO ACTIVE SUBSCRIPTION MASTER CARD */}
          <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-8 md:p-12 relative overflow-hidden group flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-6">
                <Briefcase className="w-8 h-8 text-neutral-400" />
              </div>
              <h2 className="text-[24px] font-semibold text-white tracking-tight mb-3">No Active Subscription</h2>
              <p className="text-[15px] text-neutral-400 max-w-md mx-auto leading-relaxed mb-8">
                Your workspace currently does not have an active subscription. Upgrade to a paid plan to unlock higher scan limits, custom policies, and premium support.
              </p>
              <button className="h-11 px-8 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[14px] font-medium text-white flex items-center transition-colors">
                Upgrade to Starter
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Secondary modules */}
        <div className="flex flex-col space-y-6">
          
          {/* EMPTY STATES FOR HISTORY */}
          <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-8 flex flex-col items-center justify-center text-center flex-1 min-h-[220px]">
             <FileText className="w-8 h-8 text-neutral-500 mb-4 opacity-50" />
             <h3 className="text-[15px] font-medium text-white mb-1.5">No Billing History</h3>
             <p className="text-[14px] text-neutral-500 max-w-[200px] leading-relaxed">Invoices and payment receipts will appear here once your subscription is active.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
