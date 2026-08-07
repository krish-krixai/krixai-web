"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Key, ShieldCheck, Activity, Clock, Plus, Search, ChevronDown, 
  Copy, Eye, EyeOff, RotateCw, Power, Trash2, Settings2, ShieldAlert,
  AlertTriangle, X, Check, Download, Info, Server, Sparkles, Terminal, CheckCircle2,
  MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Environment = "Production" | "Development";
type Status = "Active" | "Disabled" | "Rotated";

interface ApiKey {
  id: string;
  name: string;
  prefix: string; // The masked version
  fullKeyMock: string; // Mocked full key for the success modal
  environment: Environment;
  created: string;
  lastUsed: string;
  lastUsedExact: string;
  permissions: string[];
  status: Status;
}

import { createClient } from "@/utils/supabase/client";

export function ApiKeysClient() {
  const [isMounted, setIsMounted] = useState(false);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const supabase = createClient();
  const [search, setSearch] = useState("");
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<ApiKey | null>(null);
  
  // Create Form State
  const [createName, setCreateName] = useState("");
  const [createEnv, setCreateEnv] = useState<Environment>("Production");
  const [createPerms, setCreatePerms] = useState<Set<string>>(new Set(["Scan"]));
  const [createExp, setCreateExp] = useState("Never");
  const [expDropdownOpen, setExpDropdownOpen] = useState(false);

  // Interaction States
  const [revealedKeyId, setRevealedKeyId] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [copiedNewKey, setCopiedNewKey] = useState(false);
  
  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/keys');
      if (res.ok) {
        const data = await res.json();
        if (data.keys) {
          setKeys(data.keys.map((d: any) => ({
            id: d.id,
            name: d.name,
            prefix: d.key_prefix,
            fullKeyMock: "", // Plaintext never returned on list
            environment: d.environment,
            created: new Date(d.created_at).toLocaleDateString(),
            lastUsed: d.last_used_at ? new Date(d.last_used_at).toLocaleDateString() : "Never",
            lastUsedExact: d.last_used_at ? new Date(d.last_used_at).toLocaleString() : "Never",
            permissions: d.scopes || ["Scan"],
            status: d.status
          })));
        }
      }
    } catch (e) {
      console.error("Failed to fetch keys", e);
    }
  };

  useEffect(() => {
    fetchKeys().then(() => setIsMounted(true));
  }, []);

  if (!isMounted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-neutral-500">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-[14px] font-medium">Loading Credentials...</span>
      </div>
    );
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleReveal = (id: string) => {
    if (revealedKeyId === id) {
      setRevealedKeyId(null);
    } else {
      setRevealedKeyId(id);
      // Auto hide after 10 seconds
      setTimeout(() => {
        setRevealedKeyId((current) => current === id ? null : current);
      }, 10000);
    }
  };

  const handleCreateSubmit = async () => {
    try {
      let expires_at = null;
      if (createExp !== "Never") {
        const days = parseInt(createExp.split(" ")[0]);
        expires_at = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
      }

      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createName || "Untitled Key",
          environment: createEnv,
          scopes: Array.from(createPerms),
          expires_at
        })
      });

      if (!res.ok) {
        if (res.status === 429) {
          alert("Rate limit exceeded. Please wait before creating more keys.");
          return;
        }
        alert("Failed to create API key");
        return;
      }

      const data = await res.json();
      await fetchKeys();
      
      const newKey: ApiKey = {
        id: data.id,
        name: data.name,
        prefix: data.key_prefix,
        fullKeyMock: data.plaintext_key,
        environment: data.environment,
        created: "Just now",
        lastUsed: "Never",
        lastUsedExact: "Never",
        permissions: data.scopes || ["Scan"],
        status: data.status
      };
      
      setShowCreateModal(false);
      setNewlyCreatedKey(newKey);
      
      // Reset form
      setCreateName("");
      setCreateEnv("Production");
      setCreatePerms(new Set(["Scan"]));
      setCreateExp("Never");
    } catch (e) {
      console.error(e);
      alert("Failed to create API key");
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this key? It will stop working immediately.")) return;
    try {
      const res = await fetch(`/api/keys/${id}/revoke`, { method: 'PATCH' });
      if (res.ok) {
        await fetchKeys();
      } else {
        alert("Failed to revoke key");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRotate = async (id: string) => {
    if (!confirm("Are you sure you want to rotate this key? A new key will be generated, and the old one will expire in 7 days.")) return;
    try {
      const res = await fetch(`/api/keys/${id}/rotate`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        await fetchKeys();
        
        const newKey: ApiKey = {
          id: data.id,
          name: data.name,
          prefix: data.key_prefix,
          fullKeyMock: data.plaintext_key,
          environment: data.environment,
          created: "Just now",
          lastUsed: "Never",
          lastUsedExact: "Never",
          permissions: data.scopes || ["Scan"],
          status: data.status
        };
        
        setNewlyCreatedKey(newKey);
      } else {
        alert("Failed to rotate key");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleCreatePerm = (perm: string) => {
    const next = new Set(createPerms);
    if (next.has(perm)) next.delete(perm);
    else next.add(perm);
    setCreatePerms(next);
  };

  const activeCount = keys.filter(k => k.status === "Active").length;
  const filteredKeys = keys.filter(k => k.name.toLowerCase().includes(search.toLowerCase()) || k.prefix.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col flex-1 pb-10 space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-30">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-white mb-1.5">API Keys</h1>
          <p className="text-[14px] text-neutral-400 font-medium">Manage API credentials for securely integrating krixai into your applications.</p>
        </div>
        
        <button 
          onClick={() => setShowCreateModal(true)}
          className="h-10 px-5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[13px] font-medium text-white flex items-center transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" /> Create API Key
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Total API Keys", value: keys.length, icon: Key, color: "text-white" },
          { label: "Active Keys", value: activeCount, icon: ShieldCheck, color: "text-green-400" },
          { label: "Last Used", value: "Just now", icon: Clock, color: "text-indigo-400" },
          { label: "Requests Today", value: "124.5K", icon: Activity, color: "text-neutral-300" }
        ].map(m => (
          <div key={m.label} className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.15] transition-colors group cursor-default">
            <div className="flex items-center justify-between text-neutral-400 mb-3 group-hover:text-neutral-300 transition-colors">
              <span className="text-[14px] font-medium">{m.label}</span>
              <m.icon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className={cn("text-[32px] font-semibold tracking-tight", m.color)}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* SECURITY BEST PRACTICES CALLOUT */}
      <div className="bg-white/[0.02] border border-indigo-500/20 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-[14px] font-medium text-white mb-0.5">Security Best Practices</h4>
            <p className="text-[13px] text-neutral-400">Never expose API keys in frontend code. Rotate keys regularly and restrict permissions.</p>
          </div>
        </div>
        <button className="text-[13px] font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2 rounded-lg transition-colors border border-indigo-500/20 whitespace-nowrap">
          View Security Docs
        </button>
      </div>

      {/* API KEY TABLE */}
      <div className="flex flex-col relative bg-[#0A0A0A] border border-white/[0.08] rounded-xl overflow-hidden shadow-lg">
        {/* TOOLBAR */}
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/[0.08]">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="relative group w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search keys..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 bg-white/[0.03] border border-white/[0.08] rounded-lg pl-9 pr-4 text-[14px] text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-white/[0.2] transition-colors"
              />
            </div>
            
            <div className="hidden lg:flex items-center space-x-2">
              {["Status", "Environment", "Permissions"].map(filter => (
                <button key={filter} className="h-10 px-3 bg-transparent border border-transparent rounded-lg text-[13px] font-medium text-neutral-400 hover:text-white hover:bg-white/[0.03] flex items-center transition-colors">
                  {filter} <ChevronDown className="w-4 h-4 ml-1.5 opacity-60" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-[1000px]">
            {/* Header */}
            <div className="grid grid-cols-[2.5fr_2fr_1fr_1fr_1.5fr_1fr_180px] gap-4 px-6 py-4 bg-[#0A0A0A] border-b border-white/[0.08] text-[14px] font-medium text-neutral-400 items-center">
              <div>Name</div>
              <div>Secret Key</div>
              <div>Created</div>
              <div>Last Used</div>
              <div>Permissions</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>
            
            <div className="divide-y divide-white/[0.04]">
              {filteredKeys.length > 0 ? filteredKeys.map((key) => {
                const isRevealed = revealedKeyId === key.id;
                const maskedPrefix = key.fullKeyMock.substring(0, 13);
                const maskedSuffix = key.fullKeyMock.substring(key.fullKeyMock.length - 4);
                const revealedString = `${maskedPrefix}***${maskedSuffix}`;

                return (
                  <div 
                    key={key.id} 
                    className="grid grid-cols-[2.5fr_2fr_1fr_1fr_1.5fr_1fr_180px] gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors group relative"
                  >
                    {/* Name & Env */}
                    <div className="flex flex-col cursor-pointer pr-4 min-w-0" onClick={() => setSelectedKey(key)}>
                      <span className="text-[14px] font-medium text-neutral-200 group-hover:text-white transition-colors truncate">{key.name}</span>
                      <span className={cn(
                        "mt-1.5 inline-flex items-center px-2 py-0.5 rounded-md text-[12px] font-medium w-max",
                        key.environment === "Production" 
                          ? "text-blue-400 bg-blue-500/10" 
                          : "text-purple-400 bg-purple-500/10"
                      )}>
                        {key.environment === "Production" ? <Server className="w-3 h-3 mr-1 opacity-70" /> : <Terminal className="w-3 h-3 mr-1 opacity-70" />}
                        {key.environment}
                      </span>
                    </div>
                    
                    {/* Secret Key Masked */}
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="bg-white/[0.03] border border-white/[0.08] rounded-md px-3 py-1 font-mono text-[13px] text-neutral-300 tracking-wider truncate">
                        {isRevealed ? revealedString : key.prefix}
                      </div>
                    </div>
                    
                    {/* Created */}
                    <div className="text-[14px] text-neutral-400">{key.created}</div>
                    
                    {/* Last Used */}
                    <div className="text-[14px] text-neutral-400 group relative">
                      <span className="cursor-help underline decoration-white/[0.2] decoration-dotted underline-offset-4">{key.lastUsed}</span>
                      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full mb-2 left-0 bg-[#1A1A1A] border border-white/[0.1] text-white text-[12px] font-mono px-2 py-1 rounded shadow-xl pointer-events-none whitespace-nowrap z-50">
                        {key.lastUsedExact}
                      </div>
                    </div>
                    
                    {/* Permissions */}
                    <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                      {key.permissions.map(p => (
                        <span key={p} className="inline-flex px-2 py-1 rounded-md bg-white/[0.05] text-[12px] font-medium text-neutral-300">
                          {p}
                        </span>
                      ))}
                    </div>
                    
                    {/* Status */}
                    <div>
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium",
                        key.status === "Active" ? "text-green-400 bg-green-500/10" : 
                        key.status === "Disabled" ? "text-neutral-400 bg-white/[0.05]" : 
                        "text-amber-400 bg-amber-500/10"
                      )}>
                        {key.status === "Active" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {key.status === "Disabled" && <Power className="w-3 h-3 mr-1" />}
                        {key.status === "Rotated" && <RotateCw className="w-3 h-3 mr-1" />}
                        {key.status}
                      </span>
                    </div>
                    
                    {/* Hover Actions */}
                    <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        onClick={() => handleCopy(key.id, key.prefix)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                        title="Copy Key ID"
                      >
                        {copiedKeyId === key.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleReveal(key.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                        title={isRevealed ? "Hide" : "Reveal"}
                      >
                        {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleRotate(key.id)} className="w-8 h-8 flex items-center justify-center rounded-md text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors" title="Rotate Key">
                        <RotateCw className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleRevoke(key.id)} className="w-8 h-8 flex items-center justify-center rounded-md text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Revoke Key">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-md text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors" title="More">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              }) : (
                <div className="p-16 flex flex-col items-center justify-center text-center col-span-full">
                  <div className="w-16 h-16 bg-white/[0.02] border border-white/[0.05] rounded-2xl flex items-center justify-center mb-5">
                    <Key className="w-8 h-8 text-neutral-500" />
                  </div>
                  <h3 className="text-[16px] font-medium text-white mb-2">No API keys created yet.</h3>
                  <p className="text-[14px] text-neutral-500 mb-6 max-w-sm">Generate your first API key to start integrating krixai securely into your application.</p>
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="h-10 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[13px] font-medium transition-colors"
                  >
                    Create API Key
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CREATE API KEY MODAL */}
      <AnimatePresence>
        {showCreateModal && (
           <>
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
             onClick={() => setShowCreateModal(false)}
           >
             <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="w-full max-w-[500px] bg-[#0A0A0A] border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
               onClick={e => e.stopPropagation()}
             >
               <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between bg-[#0A0A0A]">
                 <div className="flex items-center space-x-3">
                   <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                     <Key className="w-4 h-4 text-indigo-400" />
                   </div>
                   <h2 className="text-[16px] font-medium text-white">Create new API key</h2>
                 </div>
                 <button onClick={() => setShowCreateModal(false)} className="text-neutral-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
               </div>
               
               <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar max-h-[70vh]">
                 <div>
                   <label className="block text-[14px] font-medium text-neutral-400 mb-2">Name</label>
                   <input 
                     type="text" 
                     placeholder="e.g. Production Backend Core"
                     value={createName}
                     onChange={e => setCreateName(e.target.value)}
                     className="w-full h-11 bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 text-[14px] text-white focus:outline-none focus:border-white/[0.2] transition-colors placeholder:text-neutral-600"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-[14px] font-medium text-neutral-400 mb-2">Environment</label>
                   <div className="grid grid-cols-2 gap-3">
                     {[
                       { id: "Production", icon: Server, desc: "Live traffic" },
                       { id: "Development", icon: Terminal, desc: "Testing only" }
                     ].map(env => (
                       <button 
                         key={env.id}
                         onClick={() => setCreateEnv(env.id as Environment)}
                         className={cn(
                           "flex flex-col items-start p-3 rounded-lg border transition-colors text-left",
                           createEnv === env.id 
                             ? "bg-white/[0.05] border-indigo-500/50" 
                             : "bg-transparent border-white/[0.05] hover:border-white/[0.15]"
                         )}
                       >
                         <div className="flex items-center space-x-2 mb-1">
                           <env.icon className={cn("w-4 h-4", createEnv === env.id ? "text-indigo-400" : "text-neutral-500")} />
                           <span className={cn("text-[14px] font-medium", createEnv === env.id ? "text-white" : "text-neutral-400")}>{env.id}</span>
                         </div>
                         <span className="text-[13px] text-neutral-500 pl-6">{env.desc}</span>
                       </button>
                     ))}
                   </div>
                 </div>

                 <div>
                   <label className="block text-[14px] font-medium text-neutral-400 mb-2">Permissions</label>
                   <div className="space-y-2">
                     {[
                       { id: "Read", desc: "Read analytics and logs" },
                       { id: "Scan", desc: "Execute security scans" },
                       { id: "Admin", desc: "Modify policies and settings" }
                     ].map(perm => (
                       <button 
                         key={perm.id}
                         onClick={() => toggleCreatePerm(perm.id)}
                         className={cn(
                           "w-full flex items-center justify-between p-3.5 rounded-lg border transition-colors",
                           createPerms.has(perm.id) ? "border-indigo-500/50 bg-white/[0.02]" : "border-white/[0.05] bg-transparent hover:bg-white/[0.02]"
                         )}
                       >
                         <div className="flex flex-col items-start text-left">
                           <span className={cn("text-[14px] font-medium", createPerms.has(perm.id) ? "text-white" : "text-neutral-300")}>{perm.id}</span>
                           <span className="text-[13px] text-neutral-500">{perm.desc}</span>
                         </div>
                         <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", createPerms.has(perm.id) ? "bg-indigo-500 border-indigo-500 text-white" : "border-white/[0.2] bg-white/[0.05]")}>
                           {createPerms.has(perm.id) && <Check className="w-3.5 h-3.5" />}
                         </div>
                       </button>
                     ))}
                   </div>
                 </div>

                 <div className="relative">
                   <label className="block text-[14px] font-medium text-neutral-400 mb-2">Expiration</label>
                   <button 
                     onClick={() => setExpDropdownOpen(!expDropdownOpen)}
                     className="w-full h-11 bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 text-[14px] text-white flex items-center justify-between hover:bg-white/[0.05] transition-colors"
                   >
                     {createExp} <ChevronDown className="w-4 h-4 text-neutral-500" />
                   </button>
                   <AnimatePresence>
                     {expDropdownOpen && (
                       <motion.div 
                         initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}
                         className="absolute top-full mt-2 w-full bg-[#111] border border-white/[0.1] rounded-lg shadow-xl overflow-hidden z-50 py-1"
                       >
                         {["7 Days", "30 Days", "60 Days", "90 Days", "Never"].map(exp => (
                           <button
                             key={exp}
                             onClick={() => { setCreateExp(exp); setExpDropdownOpen(false); }}
                             className="w-full px-4 py-2.5 text-left text-[14px] text-neutral-300 hover:text-white hover:bg-white/[0.05] transition-colors flex items-center justify-between"
                           >
                             {exp}
                             {createExp === exp && <Check className="w-4 h-4 text-indigo-400" />}
                           </button>
                         ))}
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </div>
                 
               </div>
               <div className="p-6 bg-[#0A0A0A] border-t border-white/[0.08] flex items-center justify-between">
                 <button onClick={() => setShowCreateModal(false)} className="text-[14px] font-medium text-neutral-400 hover:text-white transition-colors">Cancel</button>
                 <button 
                   onClick={handleCreateSubmit}
                   disabled={!createName || createPerms.size === 0}
                   className="h-10 px-6 bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 rounded-lg text-[13px] font-medium transition-colors flex items-center justify-center"
                 >
                   Generate API Key
                 </button>
               </div>
             </motion.div>
           </motion.div>
         </>
        )}
      </AnimatePresence>

      {/* SUCCESS MODAL (SHOW ONCE) */}
      <AnimatePresence>
        {newlyCreatedKey && (
           <>
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
           >
             <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="w-full max-w-[550px] bg-[#0A0A0A] border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative"
             >
               <div className="p-8 relative z-10">
                 <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                   <CheckCircle2 className="w-7 h-7 text-green-400" />
                 </div>
                 <h2 className="text-[20px] font-medium text-white mb-2">Save your API key</h2>
                 <p className="text-[14px] text-neutral-400 mb-6 leading-relaxed">
                   Please save this secret key somewhere safe and accessible. For security reasons, <span className="text-white">you will not be able to view it again</span> through your krixai account. If you lose this secret key, you will need to generate a new one.
                 </p>
                 
                 <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 flex items-center justify-between mb-8 group hover:border-white/[0.15] transition-colors">
                   <div className="font-mono text-[14px] text-white tracking-wide truncate pr-4 select-all">
                     {newlyCreatedKey.fullKeyMock}
                   </div>
                   <button 
                     onClick={() => {
                       navigator.clipboard.writeText(newlyCreatedKey.fullKeyMock);
                       setCopiedNewKey(true);
                       setTimeout(() => setCopiedNewKey(false), 2000);
                     }}
                     className="w-10 h-10 rounded-md bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] flex items-center justify-center shrink-0 transition-colors"
                   >
                     {copiedNewKey ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-neutral-300" />}
                   </button>
                 </div>

                 <div className="flex items-center space-x-4">
                   <button className="flex-1 h-11 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] rounded-lg text-[14px] font-medium text-white transition-colors flex items-center justify-center">
                     <Download className="w-4 h-4 mr-2" /> Download .txt
                   </button>
                   <button 
                     onClick={() => setNewlyCreatedKey(null)}
                     className="flex-1 h-11 bg-indigo-600 text-white hover:bg-indigo-500 rounded-lg text-[14px] font-medium transition-colors"
                   >
                     Done
                   </button>
                 </div>
               </div>
             </motion.div>
           </motion.div>
         </>
        )}
      </AnimatePresence>

      {/* KEY DETAILS SLIDE-OVER */}
      <AnimatePresence>
        {selectedKey && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSelectedKey(null)}
            />
            <motion.div 
              initial={{ x: "100%", boxShadow: "-20px 0 40px rgba(0,0,0,0)" }} 
              animate={{ x: 0, boxShadow: "-20px 0 40px rgba(0,0,0,0.5)" }} 
              exit={{ x: "100%", boxShadow: "-20px 0 40px rgba(0,0,0,0)" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-[#0A0A0A] border-l border-white/[0.08] z-50 flex flex-col"
            >
              <div className="px-8 py-6 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-[#0A0A0A]">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Key className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h2 className="text-[16px] font-medium text-white">Key Details</h2>
                </div>
                <button onClick={() => setSelectedKey(null)} className="text-neutral-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                <div>
                  <label className="block text-[14px] font-medium text-neutral-400 mb-2">Name</label>
                  <div className="text-[16px] font-medium text-white">{selectedKey.name}</div>
                </div>

                <div>
                  <label className="block text-[14px] font-medium text-neutral-400 mb-2">Key ID / Prefix</label>
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-2 font-mono text-[14px] text-neutral-300">
                      {selectedKey.prefix}
                    </div>
                    <button onClick={() => handleCopy(selectedKey.id, selectedKey.prefix)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] text-neutral-400 hover:text-white transition-colors">
                      {copiedKeyId === selectedKey.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[14px] font-medium text-neutral-400 mb-2">Environment</label>
                    <div className="text-[14px] text-neutral-200 flex items-center">
                      {selectedKey.environment === "Production" ? <Server className="w-3.5 h-3.5 mr-2 text-blue-400" /> : <Terminal className="w-3.5 h-3.5 mr-2 text-purple-400" />}
                      {selectedKey.environment}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[14px] font-medium text-neutral-400 mb-2">Status</label>
                    <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-md text-[13px] font-medium",
                        selectedKey.status === "Active" ? "text-green-400 bg-green-500/10" : 
                        selectedKey.status === "Disabled" ? "text-neutral-400 bg-white/[0.05]" : 
                        "text-amber-400 bg-amber-500/10"
                      )}>
                        {selectedKey.status === "Active" && <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />}
                        {selectedKey.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-[14px] font-medium text-neutral-400 mb-2">Created</label>
                    <div className="text-[14px] text-neutral-200">{selectedKey.created}</div>
                  </div>
                  <div>
                    <label className="block text-[14px] font-medium text-neutral-400 mb-2">Last Used</label>
                    <div className="text-[14px] text-neutral-200">{selectedKey.lastUsedExact}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-medium text-neutral-400 mb-3">Permissions</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedKey.permissions.map(p => (
                      <span key={p} className="inline-flex px-3 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-[12px] font-medium text-white">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/[0.08]">
                  <label className="block text-[14px] font-medium text-neutral-400 mb-4">Danger Zone</label>
                  <div className="space-y-3">
                    <button onClick={() => { handleRotate(selectedKey.id); setSelectedKey(null); }} className="w-full flex items-center justify-between p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
                      <div className="flex flex-col items-start text-left">
                        <span className="text-[14px] font-medium text-neutral-200 group-hover:text-white transition-colors">Rotate Key</span>
                        <span className="text-[13px] text-neutral-500 mt-0.5">Generate a replacement and invalidate this key.</span>
                      </div>
                      <RotateCw className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
                    </button>
                    <button onClick={() => { handleRevoke(selectedKey.id); setSelectedKey(null); }} className="w-full flex items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors group">
                      <div className="flex flex-col items-start text-left">
                        <span className="text-[14px] font-medium text-red-400">Revoke Key</span>
                        <span className="text-[13px] text-red-400/70 mt-0.5">Immediately disable this key. This action cannot be undone.</span>
                      </div>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
