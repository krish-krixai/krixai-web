"use client";

import React from "react";
import { motion } from "framer-motion";

interface VisProps {
  className?: string;
  color?: "blue" | "red" | "emerald" | "purple" | "amber";
}

// ============================================================================
// 1. Runtime Pipeline
// ============================================================================
export function RuntimePipelineVis({ className = "" }: VisProps) {
  return (
    <div className={`relative w-full h-full min-h-[200px] flex items-center justify-center bg-[#050505] overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:1rem_1rem]" />
      
      <svg viewBox="0 0 400 200" className="w-full h-full max-w-[400px] opacity-90">
        <path d="M 40 100 L 160 100" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.4" />
        <path d="M 240 100 L 360 100" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.4" />
        
        <rect x="20" y="80" width="40" height="40" fill="none" stroke="#3b82f6" strokeOpacity="0.3" />
        <text x="40" y="104" fontSize="10" fill="#3b82f6" fillOpacity="0.8" textAnchor="middle" className="font-mono">REQ</text>
        
        <motion.rect x="160" y="60" width="80" height="80" rx="2" fill="none" stroke="#3b82f6" strokeOpacity="0.4"
          animate={{ strokeOpacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <text x="200" y="104" fontSize="10" fill="#ffffff" fillOpacity="0.9" textAnchor="middle" className="font-mono tracking-widest uppercase">Inspect</text>
        
        <rect x="340" y="80" width="40" height="40" fill="none" stroke="#10b981" strokeOpacity="0.3" />
        <text x="360" y="104" fontSize="10" fill="#10b981" fillOpacity="0.8" textAnchor="middle" className="font-mono">SAFE</text>

        <motion.circle cx="100" cy="100" r="3" fill="#3b82f6"
          animate={{ cx: [40, 160, 160, 240, 360], opacity: [0, 1, 0, 1, 0], fill: ["#3b82f6", "#3b82f6", "#10b981", "#10b981", "#10b981"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear", times: [0, 0.4, 0.5, 0.9, 1] }}
        />
      </svg>
    </div>
  );
}

// ============================================================================
// 2. Threat Matrix
// ============================================================================
export function ThreatMatrixVis({ className = "" }: VisProps) {
  return (
    <div className={`relative w-full h-full min-h-[200px] flex items-center justify-center bg-[#050505] overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:1rem_1rem]" />
      
      <svg viewBox="0 0 400 200" className="w-full h-full max-w-[400px] opacity-90">
        {/* Axes */}
        <line x1="80" y1="160" x2="320" y2="160" stroke="#3b82f6" strokeOpacity="0.3" strokeWidth="1" />
        <line x1="80" y1="160" x2="80" y2="40" stroke="#3b82f6" strokeOpacity="0.3" strokeWidth="1" />
        <text x="320" y="175" fontSize="8" fill="#3b82f6" fillOpacity="0.6" textAnchor="end" className="font-mono uppercase">Complexity</text>
        <text x="70" y="45" fontSize="8" fill="#3b82f6" fillOpacity="0.6" textAnchor="end" className="font-mono uppercase" transform="rotate(-90 70 45)">Severity</text>

        {/* Grid lines */}
        <path d="M 80 120 L 320 120 M 80 80 L 320 80" stroke="#3b82f6" strokeOpacity="0.1" strokeDasharray="2 2" />
        <path d="M 160 160 L 160 40 M 240 160 L 240 40" stroke="#3b82f6" strokeOpacity="0.1" strokeDasharray="2 2" />

        {/* Safe Nodes */}
        <circle cx="120" cy="140" r="4" fill="#10b981" />
        <circle cx="180" cy="130" r="4" fill="#10b981" />
        
        {/* Warning Nodes */}
        <circle cx="220" cy="90" r="4" fill="#f59e0b" />
        <circle cx="260" cy="100" r="4" fill="#f59e0b" />

        {/* Threat Node */}
        <motion.circle cx="290" cy="60" r="5" fill="none" stroke="#ef4444" strokeWidth="1.5"
          animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.2, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="290" cy="60" r="2" fill="#ef4444" />
        
        <path d="M 80 160 Q 200 120 290 60" fill="none" stroke="#ef4444" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3" />
      </svg>
    </div>
  );
}

// ============================================================================
// 3. Prompt Injection Lifecycle
// ============================================================================
export function PromptInjectionVis({ className = "" }: VisProps) {
  return (
    <div className={`relative w-full h-full min-h-[200px] flex items-center justify-center bg-[#050505] overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:1rem_1rem]" />
      
      <svg viewBox="0 0 400 200" className="w-full h-full max-w-[400px] opacity-90">
        <line x1="40" y1="100" x2="360" y2="100" stroke="#3b82f6" strokeOpacity="0.2" strokeWidth="2" strokeDasharray="4 4" />
        
        <rect x="60" y="85" width="60" height="30" fill="none" stroke="#3b82f6" strokeOpacity="0.4" />
        <text x="90" y="104" fontSize="9" fill="#3b82f6" textAnchor="middle" className="font-mono uppercase">Prompt</text>

        <rect x="180" y="85" width="40" height="30" fill="none" stroke="#ef4444" strokeOpacity="0.6" />
        <text x="200" y="104" fontSize="9" fill="#ef4444" textAnchor="middle" className="font-mono uppercase">Payload</text>

        <line x1="240" y1="40" x2="240" y2="160" stroke="#10b981" strokeOpacity="0.6" strokeWidth="2" />
        
        <motion.path d="M 200 100 Q 220 50 240 50" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3"
          animate={{ strokeDashoffset: [12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <circle cx="240" cy="50" r="3" fill="#ef4444" />
        <text x="250" y="53" fontSize="8" fill="#10b981" className="font-mono uppercase">Intercepted</text>

        <rect x="300" y="85" width="60" height="30" fill="none" stroke="#10b981" strokeOpacity="0.4" />
        <text x="330" y="104" fontSize="9" fill="#10b981" textAnchor="middle" className="font-mono uppercase">Cleaned</text>
      </svg>
    </div>
  );
}

// ============================================================================
// 4. Policy Engine
// ============================================================================
export function PolicyEngineVis({ className = "" }: VisProps) {
  return (
    <div className={`relative w-full h-full min-h-[200px] flex items-center justify-center bg-[#050505] overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:1rem_1rem]" />
      
      <svg viewBox="0 0 400 200" className="w-full h-full max-w-[400px] opacity-90">
        <rect x="180" y="40" width="40" height="40" fill="none" stroke="#3b82f6" strokeOpacity="0.6" transform="rotate(45 200 60)" />
        <text x="200" y="63" fontSize="9" fill="#ffffff" textAnchor="middle" className="font-mono tracking-widest uppercase">Policy</text>

        <path d="M 200 88 L 200 130" stroke="#3b82f6" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M 200 130 L 120 130 L 120 150" stroke="#10b981" strokeOpacity="0.6" strokeWidth="1" />
        <path d="M 200 130 L 280 130 L 280 150" stroke="#ef4444" strokeOpacity="0.6" strokeWidth="1" />

        <rect x="90" y="150" width="60" height="24" fill="none" stroke="#10b981" strokeOpacity="0.6" />
        <text x="120" y="165" fontSize="9" fill="#10b981" textAnchor="middle" className="font-mono uppercase">Allow</text>

        <rect x="250" y="150" width="60" height="24" fill="none" stroke="#ef4444" strokeOpacity="0.6" />
        <text x="280" y="165" fontSize="9" fill="#ef4444" textAnchor="middle" className="font-mono uppercase">Block</text>

        <motion.rect x="195" y="30" width="10" height="10" fill="#3b82f6" opacity="0.8" transform="rotate(45 200 35)"
          animate={{ y: [0, 40], opacity: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeIn" }}
        />
      </svg>
    </div>
  );
}

// ============================================================================
// 5. Runtime Firewall
// ============================================================================
export function RuntimeFirewallVis({ className = "" }: VisProps) {
  return (
    <div className={`relative w-full h-full min-h-[200px] flex items-center justify-center bg-[#050505] overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:1rem_1rem]" />
      
      <svg viewBox="0 0 400 200" className="w-full h-full max-w-[400px] opacity-90">
        <circle cx="200" cy="100" r="60" fill="none" stroke="#10b981" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="4 4" />
        
        <motion.circle cx="200" cy="100" r="50" fill="none" stroke="#10b981" strokeOpacity="0.6" strokeWidth="1.5"
          animate={{ strokeDashoffset: [0, -40] }}
          strokeDasharray="10 30"
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        <rect x="180" y="80" width="40" height="40" fill="none" stroke="#3b82f6" strokeOpacity="0.6" />
        <text x="200" y="103" fontSize="9" fill="#ffffff" textAnchor="middle" className="font-mono uppercase">LLM</text>

        {/* Incoming attacks */}
        <path d="M 60 40 L 145 75" stroke="#ef4444" strokeOpacity="0.6" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M 60 160 L 145 125" stroke="#ef4444" strokeOpacity="0.6" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M 340 40 L 255 75" stroke="#ef4444" strokeOpacity="0.6" strokeWidth="1" strokeDasharray="2 2" />

        <circle cx="145" cy="75" r="3" fill="#ef4444" />
        <circle cx="145" cy="125" r="3" fill="#ef4444" />
        <circle cx="255" cy="75" r="3" fill="#ef4444" />
      </svg>
    </div>
  );
}

// ============================================================================
// 6. Agent Graph
// ============================================================================
export function AgentGraphVis({ className = "" }: VisProps) {
  return (
    <div className={`relative w-full h-full min-h-[200px] flex items-center justify-center bg-[#050505] overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:1rem_1rem]" />
      
      <svg viewBox="0 0 400 200" className="w-full h-full max-w-[400px] opacity-90">
        <polygon points="200,60 280,100 200,140 120,100" fill="none" stroke="#3b82f6" strokeOpacity="0.2" strokeWidth="1" />
        
        <circle cx="200" cy="100" r="20" fill="none" stroke="#10b981" strokeOpacity="0.6" />
        <text x="200" y="103" fontSize="8" fill="#10b981" textAnchor="middle" className="font-mono uppercase">Orch</text>

        <line x1="200" y1="100" x2="200" y2="60" stroke="#3b82f6" strokeOpacity="0.4" strokeDasharray="2 2" />
        <line x1="200" y1="100" x2="280" y2="100" stroke="#3b82f6" strokeOpacity="0.4" strokeDasharray="2 2" />
        <line x1="200" y1="100" x2="200" y2="140" stroke="#3b82f6" strokeOpacity="0.4" strokeDasharray="2 2" />
        <line x1="200" y1="100" x2="120" y2="100" stroke="#3b82f6" strokeOpacity="0.4" strokeDasharray="2 2" />

        <rect x="185" y="45" width="30" height="15" fill="none" stroke="#3b82f6" strokeOpacity="0.6" />
        <rect x="280" y="92.5" width="30" height="15" fill="none" stroke="#3b82f6" strokeOpacity="0.6" />
        <rect x="185" y="140" width="30" height="15" fill="none" stroke="#ef4444" strokeOpacity="0.6" />
        <rect x="90" y="92.5" width="30" height="15" fill="none" stroke="#3b82f6" strokeOpacity="0.6" />

        <text x="200" y="55" fontSize="6" fill="#ffffff" textAnchor="middle" className="font-mono uppercase">Tool</text>
        <text x="295" y="102" fontSize="6" fill="#ffffff" textAnchor="middle" className="font-mono uppercase">Tool</text>
        <text x="200" y="150" fontSize="6" fill="#ef4444" textAnchor="middle" className="font-mono uppercase">Blocked</text>
        <text x="105" y="102" fontSize="6" fill="#ffffff" textAnchor="middle" className="font-mono uppercase">Tool</text>

        <motion.circle cx="200" cy="100" r="24" fill="none" stroke="#10b981" strokeOpacity="0.3"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

// ============================================================================
// 7. Detection Timeline
// ============================================================================
export function DetectionTimelineVis({ className = "" }: VisProps) {
  return (
    <div className={`relative w-full h-full min-h-[200px] flex items-center justify-center bg-[#050505] overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:1rem_1rem]" />
      
      <svg viewBox="0 0 400 200" className="w-full h-full max-w-[400px] opacity-90">
        <line x1="40" y1="100" x2="360" y2="100" stroke="#3b82f6" strokeOpacity="0.3" strokeWidth="1" />
        
        <line x1="80" y1="95" x2="80" y2="105" stroke="#3b82f6" strokeOpacity="0.5" strokeWidth="1" />
        <line x1="160" y1="95" x2="160" y2="105" stroke="#3b82f6" strokeOpacity="0.5" strokeWidth="1" />
        <line x1="240" y1="95" x2="240" y2="105" stroke="#3b82f6" strokeOpacity="0.5" strokeWidth="1" />
        <line x1="320" y1="95" x2="320" y2="105" stroke="#3b82f6" strokeOpacity="0.5" strokeWidth="1" />

        <text x="80" y="80" fontSize="9" fill="#3b82f6" fillOpacity="0.6" textAnchor="middle" className="font-mono">t=0</text>
        <text x="160" y="80" fontSize="9" fill="#3b82f6" fillOpacity="0.6" textAnchor="middle" className="font-mono">t=10ms</text>
        <text x="240" y="80" fontSize="9" fill="#ef4444" fillOpacity="0.8" textAnchor="middle" className="font-mono">t=25ms</text>
        <text x="320" y="80" fontSize="9" fill="#10b981" fillOpacity="0.6" textAnchor="middle" className="font-mono">t=35ms</text>
        
        <circle cx="80" cy="100" r="3" fill="#3b82f6" />
        <circle cx="160" cy="100" r="3" fill="#3b82f6" />
        <circle cx="240" cy="100" r="3" fill="#ef4444" />
        <circle cx="320" cy="100" r="3" fill="#10b981" />
        
        <path d="M 80 100 Q 120 130 160 100" fill="none" stroke="#3b82f6" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M 160 100 Q 200 130 240 100" fill="none" stroke="#ef4444" strokeOpacity="0.6" strokeWidth="1" />
        
        <motion.circle cx="240" cy="100" r="8" fill="none" stroke="#ef4444" strokeOpacity="0.8"
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <text x="240" y="125" fontSize="8" fill="#ef4444" fillOpacity="0.9" textAnchor="middle" className="font-mono uppercase tracking-widest">Intercept</text>
      </svg>
    </div>
  );
}

// ============================================================================
// 8. Inference Gateway
// ============================================================================
export function InferenceGatewayVis({ className = "" }: VisProps) {
  return (
    <div className={`relative w-full h-full min-h-[200px] flex items-center justify-center bg-[#050505] overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:1rem_1rem]" />
      
      <svg viewBox="0 0 400 200" className="w-full h-full max-w-[400px] opacity-90">
        <rect x="40" y="60" width="80" height="80" fill="none" stroke="#3b82f6" strokeOpacity="0.4" />
        <text x="80" y="104" fontSize="10" fill="#3b82f6" textAnchor="middle" className="font-mono uppercase">VPC</text>

        <rect x="280" y="60" width="80" height="80" fill="none" stroke="#10b981" strokeOpacity="0.4" />
        <text x="320" y="104" fontSize="10" fill="#10b981" textAnchor="middle" className="font-mono uppercase">LLM</text>

        <line x1="200" y1="40" x2="200" y2="160" stroke="#10b981" strokeWidth="2" strokeDasharray="6 4" strokeOpacity="0.6" />
        <text x="200" y="30" fontSize="9" fill="#10b981" textAnchor="middle" className="font-mono uppercase">Gateway</text>

        <path d="M 120 90 L 200 90" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M 200 90 L 280 90" stroke="#10b981" strokeWidth="1" />

        <path d="M 280 110 L 200 110" stroke="#10b981" strokeWidth="1" />
        <path d="M 200 110 L 120 110" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" />
        
        <motion.circle cx="200" cy="90" r="3" fill="#10b981"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle cx="200" cy="110" r="3" fill="#10b981"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </svg>
    </div>
  );
}

// ============================================================================
// 9. Runtime Architecture
// ============================================================================
export function RuntimeArchitectureVis({ className = "" }: VisProps) {
  return (
    <div className={`relative w-full h-full min-h-[200px] flex items-center justify-center bg-[#050505] overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:1rem_1rem]" />
      
      <svg viewBox="0 0 400 200" className="w-full h-full max-w-[400px] opacity-90">
        
        <rect x="40" y="80" width="60" height="40" fill="none" stroke="#3b82f6" strokeOpacity="0.4" />
        <text x="70" y="103" fontSize="9" fill="#3b82f6" textAnchor="middle" className="font-mono uppercase">App</text>

        <rect x="140" y="40" width="120" height="120" rx="2" fill="none" stroke="#10b981" strokeOpacity="0.5" />
        <line x1="160" y1="40" x2="160" y2="160" stroke="#10b981" strokeOpacity="0.3" strokeDasharray="2 2" />
        <line x1="240" y1="40" x2="240" y2="160" stroke="#10b981" strokeOpacity="0.3" strokeDasharray="2 2" />
        <text x="200" y="103" fontSize="10" fill="#ffffff" textAnchor="middle" className="font-mono tracking-widest uppercase">Krixai</text>

        <rect x="300" y="80" width="60" height="40" fill="none" stroke="#10b981" strokeOpacity="0.4" />
        <text x="330" y="103" fontSize="9" fill="#10b981" textAnchor="middle" className="font-mono uppercase">LLM</text>

        <path d="M 100 100 L 140 100" stroke="#3b82f6" strokeOpacity="0.6" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M 260 100 L 300 100" stroke="#10b981" strokeOpacity="0.6" strokeWidth="1" strokeDasharray="2 2" />
        
        <motion.line x1="140" y1="60" x2="140" y2="140" stroke="#10b981" strokeWidth="2" strokeOpacity="0.8"
          animate={{ y1: [60, 80, 60], y2: [140, 120, 140] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
