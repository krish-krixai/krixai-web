"use client";
import React, { useState, useEffect } from "react";
import { Search, Bell, ChevronDown, Shield, AlertTriangle, Key } from "lucide-react";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function TopNav() {
  const { activeWorkspace, memberships, switchWorkspace } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  
  // Search Modal State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <>
      <header className="h-12 border-b border-white/10 bg-[#000000] sticky top-0 z-40 flex items-center justify-between px-6 shrink-0 font-mono text-[12px] text-neutral-400">
        
        {/* Breadcrumb Path */}
        <div className="flex items-center gap-2">
          <span>~{pathname}</span>
        </div>

        <div className="flex items-center space-x-6 ml-auto">
          {/* Search Trigger */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <span>[⌘K Search]</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)} 
              className={cn("hover:text-white transition-colors", isNotifOpen ? "text-white" : "")}
            >
              [Alerts:{unreadCount}]
            </button>
            
            <AnimatePresence>
              {isNotifOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.1 }}
                  className="absolute top-full right-0 mt-3 w-80 bg-[#050505] border border-white/10 shadow-2xl overflow-hidden py-2 z-50 text-[12px]"
                >
                  <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
                    <span className="text-white">Alerts</span>
                    {unreadCount > 0 && (
                      <button onClick={() => setUnreadCount(0)} className="text-neutral-500 hover:text-white transition-colors">[Clear]</button>
                    )}
                  </div>
                  <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                    {unreadCount === 0 ? (
                      <div className="px-4 py-8 text-center flex flex-col items-center justify-center text-neutral-600">
                        <span>No new alerts.</span>
                      </div>
                    ) : (
                      <>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="h-4 w-px bg-white/10" />
          
          {/* Workspace Switcher */}
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 hover:text-white transition-colors uppercase tracking-wide"
            >
              <span>[{activeWorkspace?.name || "Workspace"} <ChevronDown className="w-3 h-3 inline" />]</span>
            </button>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.1 }}
                  className="absolute top-full right-0 mt-3 w-56 bg-[#050505] border border-white/10 shadow-2xl py-2 z-50 text-[12px]"
                >
                  <div className="px-4 py-2 text-neutral-500 uppercase tracking-widest border-b border-white/10 mb-1">
                    Switch WS
                  </div>
                  {memberships.map((m) => (
                    <button
                      key={m.workspace.id}
                      onClick={() => {
                        switchWorkspace(m.workspace.id);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-neutral-300 hover:text-white hover:bg-white/[0.05] transition-colors flex items-center justify-between"
                    >
                      <span className="uppercase">{m.workspace.name}</span>
                      {activeWorkspace?.id === m.workspace.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* COMMAND PALETTE MODAL */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] font-mono text-[13px]">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.15 }}
              className="relative w-full max-w-2xl bg-[#050505] border border-white/10 rounded-sm shadow-2xl overflow-hidden z-[101]"
            >
               <div className="flex items-center px-6 border-b border-white/10">
                 <span className="text-white mr-3">&gt;</span>
                 <input 
                   autoFocus
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   placeholder="Search..." 
                   className="w-full bg-transparent border-none h-14 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-0"
                 />
                 <button onClick={() => setIsSearchOpen(false)} className="text-neutral-500 hover:text-white transition-colors">[ESC]</button>
               </div>
               
               <div className="py-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                 <div className="px-6 py-2 text-[11px] text-neutral-600 uppercase tracking-widest">
                   {searchQuery.trim() === "" ? "Quick Actions" : "Suggestions"}
                 </div>
                 
                 {[
                   { title: 'Manage Security Policies', icon: Shield, url: '/dashboard/policies' },
                   { title: 'View Threat Logs', icon: AlertTriangle, url: '/dashboard/logs' },
                   { title: 'Generate API Key', icon: Key, url: '/dashboard/keys' },
                   { title: 'Usage & Billing', icon: Search, url: '/dashboard/usage' },
                   { title: 'Workspace Settings', icon: Search, url: '/dashboard/settings' }
                 ]
                 .filter(action => action.title.toLowerCase().includes(searchQuery.toLowerCase()))
                 .map((action, i) => (
                   <button 
                     key={i} 
                     onClick={() => { window.location.href=action.url; setIsSearchOpen(false); }} 
                     className="w-full flex items-center px-6 py-3 hover:bg-white/[0.04] transition-colors group border-l-2 border-transparent hover:border-white text-neutral-400 hover:text-white"
                   >
                     <action.icon className="w-4 h-4 mr-4" />
                     <div className="font-medium">{action.title}</div>
                   </button>
                 ))}
                 
                 {[
                   { title: 'Manage Security Policies', icon: Shield, url: '/dashboard/policies' },
                   { title: 'View Threat Logs', icon: AlertTriangle, url: '/dashboard/logs' },
                   { title: 'Generate API Key', icon: Key, url: '/dashboard/keys' },
                   { title: 'Usage & Billing', icon: Search, url: '/dashboard/usage' },
                   { title: 'Workspace Settings', icon: Search, url: '/dashboard/settings' }
                 ].filter(action => action.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                   <div className="px-6 py-8 text-center text-neutral-600">
                     No results found for "{searchQuery}"
                   </div>
                 )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
