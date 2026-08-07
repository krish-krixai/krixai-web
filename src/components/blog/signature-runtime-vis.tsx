"use client";

import React from "react";
import { motion } from "framer-motion";

export function SignatureRuntimeVis({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full h-full min-h-[350px] lg:min-h-[450px] flex items-center justify-center bg-[#000000] overflow-hidden ${className}`}>
      
      {/* Deep Space Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:2rem_2rem]" />
      
      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-1/4 w-[200px] h-[200px] bg-blue-500/5 blur-[100px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[200px] h-[200px] bg-emerald-500/5 blur-[100px] -translate-y-1/2 pointer-events-none" />

      <svg viewBox="0 0 1200 300" className="w-full h-full max-w-[1200px] opacity-90 drop-shadow-2xl">
        <defs>
          <linearGradient id="mainStream" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="20%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="80%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="glowStrong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* =========================================================================
            DATA STREAM BACKBONE
            ========================================================================= */}
        <line x1="50" y1="150" x2="1150" y2="150" stroke="url(#mainStream)" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4 4" />
        
        {/* Animated Packets along the main stream */}
        <motion.circle cx="0" cy="150" r="2" fill="#60a5fa" filter="url(#glow)"
          animate={{ cx: [50, 1150], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear", times: [0, 0.1, 0.9, 1] }}
        />
        <motion.circle cx="0" cy="150" r="2" fill="#60a5fa" filter="url(#glow)"
          animate={{ cx: [50, 1150], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear", times: [0, 0.1, 0.9, 1], delay: 2 }}
        />
        <motion.circle cx="0" cy="150" r="2" fill="#34d399" filter="url(#glow)"
          animate={{ cx: [50, 1150], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear", times: [0, 0.1, 0.9, 1], delay: 4 }}
        />

        {/* =========================================================================
            STAGE 1: INCOMING PROMPT
            ========================================================================= */}
        <g transform="translate(100, 150)">
          <circle cx="0" cy="0" r="4" fill="#3b82f6" filter="url(#glow)" />
          <circle cx="0" cy="0" r="12" fill="none" stroke="#3b82f6" strokeOpacity="0.3" strokeWidth="1" />
          <text x="0" y="-25" fontSize="10" fill="#3b82f6" fillOpacity="0.8" textAnchor="middle" className="font-mono tracking-widest uppercase">Incoming Prompt</text>
        </g>

        {/* =========================================================================
            STAGE 2: NORMALIZE
            ========================================================================= */}
        <g transform="translate(280, 150)">
          <text x="0" y="-45" fontSize="10" fill="#3b82f6" fillOpacity="0.8" textAnchor="middle" className="font-mono tracking-widest uppercase">Normalize</text>
          <rect x="-15" y="-15" width="30" height="30" fill="none" stroke="#3b82f6" strokeOpacity="0.4" strokeWidth="1" />
          <line x1="-10" y1="-5" x2="10" y2="-5" stroke="#3b82f6" strokeOpacity="0.6" strokeWidth="1" />
          <line x1="-10" y1="5" x2="10" y2="5" stroke="#3b82f6" strokeOpacity="0.6" strokeWidth="1" />
          <motion.line x1="-10" y1="-5" x2="10" y2="-5" stroke="#60a5fa" strokeOpacity="0.9" strokeWidth="1"
            animate={{ strokeDasharray: ["0 20", "20 0"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </g>

        {/* =========================================================================
            STAGE 3: INSPECT (RUNTIME INSPECTION RING)
            ========================================================================= */}
        <g transform="translate(460, 150)">
          <text x="0" y="-55" fontSize="10" fill="#3b82f6" fillOpacity="0.8" textAnchor="middle" className="font-mono tracking-widest uppercase">Inspect</text>
          
          <motion.circle cx="0" cy="0" r="30" fill="none" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.2" />
          
          {/* Inner Counter-Rotating Ring */}
          <motion.circle cx="0" cy="0" r="22" fill="none" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="10 30"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />

          {/* Outer Rotating Ring */}
          <motion.circle cx="0" cy="0" r="38" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="40 60" filter="url(#glow)"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />
        </g>

        {/* =========================================================================
            STAGE 4: THREAT CLASSIFICATION
            ========================================================================= */}
        <g transform="translate(640, 150)">
          <text x="0" y="-65" fontSize="10" fill="#3b82f6" fillOpacity="0.8" textAnchor="middle" className="font-mono tracking-widest uppercase">Threat Classification</text>
          
          <path d="M -30 0 L 0 -30 L 30 0 L 0 30 Z" fill="none" stroke="#3b82f6" strokeOpacity="0.2" strokeWidth="1" />
          <path d="M 0 -30 L 0 30" stroke="#3b82f6" strokeOpacity="0.3" strokeWidth="1" />
          
          <motion.circle cx="-30" cy="0" r="3" fill="#3b82f6" filter="url(#glow)" />
          <motion.circle cx="30" cy="0" r="3" fill="#3b82f6" filter="url(#glow)" />
          <motion.circle cx="0" cy="-30" r="3" fill="#3b82f6" filter="url(#glow)" />
          <motion.circle cx="0" cy="30" r="3" fill="#3b82f6" filter="url(#glow)" />
          
          <motion.circle cx="0" cy="0" r="6" fill="#3b82f6" filter="url(#glowStrong)"
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>

        {/* =========================================================================
            STAGE 5: POLICY ENGINE
            ========================================================================= */}
        <g transform="translate(840, 150)">
          <text x="0" y="-55" fontSize="10" fill="#10b981" fillOpacity="0.8" textAnchor="middle" className="font-mono tracking-widest uppercase">Policy Engine</text>
          
          <rect x="-15" y="-15" width="30" height="30" fill="none" stroke="#10b981" strokeOpacity="0.4" strokeWidth="1.5" transform="rotate(45)" />
          
          <motion.rect x="-10" y="-10" width="20" height="20" fill="#059669" fillOpacity="0.2" stroke="#34d399" strokeOpacity="0.8" strokeWidth="1" transform="rotate(45)" filter="url(#glow)"
            animate={{ rotate: [45, 225] }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          />

          <circle cx="0" cy="0" r="3" fill="#34d399" />
          
          {/* Reject Path */}
          <path d="M 0 0 L 0 50 L 30 50" fill="none" stroke="#ef4444" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="3 3" />
          <text x="35" y="53" fontSize="8" fill="#ef4444" fillOpacity="0.6" className="font-mono uppercase">Block</text>

          {/* Warning Path */}
          <path d="M 0 0 L 0 -50 L 30 -50" fill="none" stroke="#f59e0b" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="3 3" />
          <text x="35" y="-47" fontSize="8" fill="#f59e0b" fillOpacity="0.6" className="font-mono uppercase">Flag</text>
        </g>

        {/* =========================================================================
            STAGE 6: SECURE LLM
            ========================================================================= */}
        <g transform="translate(1040, 150)">
          <text x="0" y="-55" fontSize="10" fill="#10b981" fillOpacity="0.8" textAnchor="middle" className="font-mono tracking-widest uppercase">Secure LLM</text>
          
          {/* Gateway Barrier */}
          <line x1="-30" y1="-40" x2="-30" y2="40" stroke="#34d399" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="4 2" />
          <motion.line x1="-30" y1="-40" x2="-30" y2="40" stroke="#10b981" strokeOpacity="0.8" strokeWidth="2" filter="url(#glow)"
            animate={{ strokeDashoffset: [0, -20] }}
            strokeDasharray="4 16"
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />

          {/* LLM Core */}
          <rect x="-10" y="-20" width="30" height="40" rx="4" fill="#064e3b" fillOpacity="0.5" stroke="#10b981" strokeOpacity="0.6" strokeWidth="1.5" filter="url(#glow)" />
          <line x1="-5" y1="-10" x2="15" y2="-10" stroke="#34d399" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="-5" y1="0" x2="10" y2="0" stroke="#34d399" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="-5" y1="10" x2="15" y2="10" stroke="#34d399" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
