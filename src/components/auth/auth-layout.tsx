"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { LogoLockup } from "@/components/logo";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20 font-sans flex flex-col items-center justify-center relative overflow-hidden p-4">
      
      {/* Structural Enterprise Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none mask-image-radial" style={{ maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 80%)' }} />

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center group mb-8">
            <LogoLockup className="h-[24px] w-auto text-white group-hover:text-neutral-300 transition-colors" />
          </Link>
          <h1 className="text-[22px] font-medium text-white tracking-tight">{title}</h1>
          <p className="text-[13px] text-neutral-400 mt-1.5 text-center">{subtitle}</p>
        </div>

        {/* Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-8 shadow-2xl relative"
        >
          {/* Top Edge Highlight */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          {children}
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[12px] text-neutral-500 font-medium">
            Protected by krixai Security
          </p>
        </div>
      </div>
    </div>
  );
}
