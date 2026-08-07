"use client";
import React, { useState, useEffect } from "react";
import { Search, Bell, ChevronDown, Shield, AlertTriangle, Key } from "lucide-react";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { motion, AnimatePresence } from "framer-motion";

export function TopNav() {
  const { activeWorkspace, memberships, switchWorkspace } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  
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
      <header className="h-16 border-b border-white/[0.04] bg-[#060606]/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-8 shrink-0">
        <div className="flex-1 max-w-xl hidden md:block relative group">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="w-full relative flex items-center h-10 bg-[#0A0A0A] border border-white/[0.1] hover:border-indigo-500/50 rounded-xl px-4 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.02)] hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] group"
          >
            <Search className="w-4 h-4 text-neutral-500 group-hover:text-indigo-400 transition-colors duration-300 mr-3" />
            <span className="text-[13px] font-medium text-neutral-500 group-hover:text-neutral-300 transition-colors">Search prompts, logs, API keys, policies...</span>
            
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
              <kbd className="px-1.5 py-0.5 rounded-md bg-white/[0.08] border border-white/[0.15] text-[10px] font-bold text-neutral-300 shadow-sm">⌘</kbd>
              <kbd className="px-1.5 py-0.5 rounded-md bg-white/[0.08] border border-white/[0.15] text-[10px] font-bold text-neutral-300 shadow-sm">K</kbd>
            </div>
          </button>
        </div>

        <div className="flex items-center space-x-6 ml-auto">
          <div className="relative">
            <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative p-2 rounded-xl text-neutral-400 hover:bg-white/[0.04] hover:text-white transition-all duration-300 active:scale-95 group">
              <Bell className="w-4.5 h-4.5 group-hover:rotate-12 transition-transform duration-300" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-[1.5px] border-[#060606] shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              )}
            </button>
            
            <AnimatePresence>
              {isNotifOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-80 bg-[#111] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden py-1 z-50"
                >
                  <div className="px-4 py-3 border-b border-white/[0.05] flex items-center justify-between bg-[#151515]">
                    <span className="text-[13px] font-semibold text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={() => setUnreadCount(0)} className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Mark all as read</button>
                    )}
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {unreadCount === 0 ? (
                      <div className="px-4 py-8 text-center flex flex-col items-center justify-center">
                        <Bell className="w-8 h-8 text-neutral-600 mb-2" />
                        <span className="text-[13px] font-medium text-white">All caught up!</span>
                        <span className="text-[12px] text-neutral-400 mt-0.5">No new notifications.</span>
                      </div>
                    ) : (
                      <>
                        <div className="px-4 py-3.5 hover:bg-white/[0.03] border-b border-white/[0.02] transition-colors cursor-pointer group">
                          <div className="flex items-start justify-between mb-1">
                            <span className="text-[13px] font-semibold text-white group-hover:text-indigo-400 transition-colors">Critical Alert Blocked</span>
                            <span className="text-[10px] font-medium text-indigo-400">2m ago</span>
                          </div>
                          <p className="text-[12px] text-neutral-400 leading-snug">A high-severity prompt injection attempt was blocked by the Security Engine on your OpenAI proxy.</p>
                        </div>
                        <div className="px-4 py-3.5 hover:bg-white/[0.03] border-b border-white/[0.02] transition-colors cursor-pointer group">
                          <div className="flex items-start justify-between mb-1">
                            <span className="text-[13px] font-semibold text-white group-hover:text-indigo-400 transition-colors">New Team Member</span>
                            <span className="text-[10px] text-neutral-500">1h ago</span>
                          </div>
                          <p className="text-[12px] text-neutral-400 leading-snug">Alex has accepted your invitation to join the engineering workspace.</p>
                        </div>
                        <div className="px-4 py-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer group">
                          <div className="flex items-start justify-between mb-1">
                            <span className="text-[13px] font-semibold text-white group-hover:text-indigo-400 transition-colors">Usage Warning</span>
                            <span className="text-[10px] text-neutral-500">5h ago</span>
                          </div>
                          <p className="text-[12px] text-neutral-400 leading-snug">You have consumed 80% of your monthly prompt scan quota.</p>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="h-5 w-px bg-white/[0.08]" />
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-3 px-3 py-1.5 rounded-xl hover:bg-white/[0.03] transition-all duration-300 border border-transparent hover:border-white/[0.05] active:scale-95 group"
            >
              {activeWorkspace?.logo_url ? (
                <img src={activeWorkspace.logo_url} alt={activeWorkspace.name} className="w-7 h-7 rounded-full object-cover border border-white/20 shadow-sm" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white border border-white/20 shadow-sm group-hover:shadow-[0_0_12px_rgba(99,102,241,0.4)] transition-shadow uppercase">
                  {activeWorkspace?.name.substring(0, 2) || "WS"}
                </div>
              )}
              <div className="text-left hidden sm:block">
                <p className="text-[13px] font-semibold text-white leading-none">{activeWorkspace?.name || "Workspace"}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 hidden sm:block group-hover:-translate-y-px transition-transform duration-300" />
            </button>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-56 bg-[#111] border border-white/[0.1] rounded-xl shadow-xl overflow-hidden py-1 z-50"
                >
                  <div className="px-3 py-2 text-[10px] font-bold text-neutral-500 uppercase tracking-wider border-b border-white/[0.05]">
                    Switch Workspace
                  </div>
                  {memberships.map((m) => (
                    <button
                      key={m.workspace.id}
                      onClick={() => {
                        switchWorkspace(m.workspace.id);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-white/[0.05] transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        {m.workspace.logo_url ? (
                          <img src={m.workspace.logo_url} alt={m.workspace.name} className="w-5 h-5 rounded-full object-cover" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[8px] font-bold text-white uppercase">
                            {m.workspace.name.substring(0, 2)}
                          </div>
                        )}
                        <span>{m.workspace.name}</span>
                      </div>
                      {activeWorkspace?.id === m.workspace.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
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
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} transition={{ duration: 0.15 }}
              className="relative w-full max-w-2xl bg-[#0F0F0F] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-[101]"
            >
               <div className="flex items-center px-4 border-b border-white/[0.08]">
                 <Search className="w-5 h-5 text-indigo-400 shrink-0" />
                 <input 
                   autoFocus
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   placeholder="Search commands, policies, or threat logs..." 
                   className="w-full bg-transparent border-none h-14 px-4 text-[15px] font-medium text-white placeholder:text-neutral-500 focus:outline-none focus:ring-0"
                 />
                 <kbd onClick={() => setIsSearchOpen(false)} className="px-2 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-[10px] font-medium text-neutral-400 cursor-pointer transition-colors">ESC</kbd>
               </div>
               
               <div className="py-2 max-h-[400px] overflow-y-auto">
                 {searchQuery.trim() === "" ? (
                   <div className="px-4 py-2 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Quick Actions</div>
                 ) : (
                   <div className="px-4 py-2 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Suggestions</div>
                 )}
                 
                 {[
                   { title: 'Manage Security Policies', icon: Shield, url: '/dashboard/policies' },
                   { title: 'View Threat Logs', icon: AlertTriangle, url: '/dashboard/threats' },
                   { title: 'Generate API Key', icon: Key, url: '/dashboard/api-keys' },
                   { title: 'Usage & Billing', icon: Search, url: '/dashboard/usage' },
                   { title: 'Workspace Settings', icon: Search, url: '/dashboard/settings' }
                 ]
                 .filter(action => action.title.toLowerCase().includes(searchQuery.toLowerCase()))
                 .map((action, i) => (
                   <button 
                     key={i} 
                     onClick={() => { window.location.href=action.url; setIsSearchOpen(false); }} 
                     className="w-full flex items-center px-4 py-3 hover:bg-white/[0.04] transition-colors group border-l-2 border-transparent hover:border-indigo-500"
                   >
                     <action.icon className="w-4 h-4 text-neutral-500 group-hover:text-white mr-4 transition-colors" />
                     <div className="text-[14px] font-medium text-neutral-300 group-hover:text-white transition-colors">{action.title}</div>
                   </button>
                 ))}
                 
                 {[
                   { title: 'Manage Security Policies', icon: Shield, url: '/dashboard/policies' },
                   { title: 'View Threat Logs', icon: AlertTriangle, url: '/dashboard/threats' },
                   { title: 'Generate API Key', icon: Key, url: '/dashboard/api-keys' },
                   { title: 'Usage & Billing', icon: Search, url: '/dashboard/usage' },
                   { title: 'Workspace Settings', icon: Search, url: '/dashboard/settings' }
                 ].filter(action => action.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                   <div className="px-4 py-8 text-center text-neutral-500 text-[13px]">
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
