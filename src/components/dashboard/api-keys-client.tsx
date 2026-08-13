"use client";

import React, { useState, useEffect } from "react";
import { Lock, ArrowRight, Key, Plus, X, Server, Terminal, Check, Copy } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Environment = "Production" | "Development";
type Status = "Active" | "Disabled" | "Rotated";

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  suffix: string;
  maskedKey: string;
  fullKeyMock: string;
  environment: Environment;
  created: string;
  lastUsed: string;
  permissions: string[];
  status: Status;
}

export function ApiKeysClient() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<ApiKey | null>(null);
  const [copiedNewKey, setCopiedNewKey] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Create Form
  const [createName, setCreateName] = useState("");
  const [createEnv, setCreateEnv] = useState<Environment>("Production");
  const [createPerms, setCreatePerms] = useState<Set<string>>(new Set(["Scan"]));

  // Mocking "Free Plan" constraint for this demo
  const isFreePlan = true; 

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
            suffix: "",
            maskedKey: `${d.key_prefix}...................`,
            fullKeyMock: "", // Plaintext never returned
            environment: d.environment,
            created: new Date(d.created_at).toLocaleDateString(),
            lastUsed: d.last_used_at ? new Date(d.last_used_at).toLocaleDateString() : "Never",
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

  const handleCreateSubmit = async () => {
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createName || "Untitled Key",
          environment: createEnv,
          scopes: Array.from(createPerms),
          expires_at: null
        })
      });

      if (!res.ok) {
        let errMsg = "Failed to create API key";
        try {
          const errData = await res.json();
          if (errData.error) errMsg += `: ${errData.error}`;
        } catch (e) {}
        alert(errMsg);
        return;
      }

      const data = await res.json();
      await fetchKeys();
      
      const newKey: ApiKey = {
        id: data.id,
        name: data.name,
        prefix: data.key_prefix,
        suffix: "",
        maskedKey: `${data.key_prefix}...................`,
        fullKeyMock: data.raw_key,
        environment: data.environment,
        created: "Just now",
        lastUsed: "Never",
        permissions: data.scopes || ["Scan"],
        status: data.status
      };
      
      setShowCreateModal(false);
      setNewlyCreatedKey(newKey);
      
      // Reset form
      setCreateName("");
      setCreateEnv("Production");
      setCreatePerms(new Set(["Scan"]));
    } catch (e) {
      console.error(e);
      alert("Failed to create API key");
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  if (!isMounted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#000000] text-neutral-500 font-mono text-[13px]">
        Loading Credentials...
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 font-mono text-[13px] bg-[#000000] min-h-screen text-neutral-300">
      <div className="max-w-[800px] mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div className="text-white text-[15px] font-medium tracking-wide">API Keys</div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-white/10 text-white hover:bg-white/20 transition-colors px-4 py-1.5 rounded-sm"
          >
            [+ New Key]
          </button>
        </div>

        <div className="border border-white/10 rounded-sm bg-[#050505] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium text-neutral-500 w-[30%]">Name</th>
                <th className="px-6 py-4 font-medium text-neutral-500 w-[40%]">Key</th>
                <th className="px-6 py-4 font-medium text-neutral-500 w-[15%]">Env</th>
                <th className="px-6 py-4 font-medium text-neutral-500 w-[15%]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {keys.length === 0 ? (
                 <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                       No keys found. Generate one to start scanning.
                    </td>
                 </tr>
              ) : keys.map((key) => (
                <tr key={key.id} className="group hover:bg-white/[0.03] transition-colors align-top">
                  <td className="px-6 py-4">
                    <div className="text-white mb-2">{key.name}</div>
                    {key.environment === "Development" && isFreePlan && (
                      <div className="flex items-center gap-1.5 text-neutral-500 text-[11px] mt-1.5">
                        <Lock className="w-3 h-3" /> Starter
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white mb-2 font-mono tracking-wider">
                       {key.maskedKey}
                    </div>
                    <div className="flex items-center gap-4 text-neutral-500 text-[11px]">
                      <button onClick={() => handleCopy(key.id, key.maskedKey)} className="hover:text-white transition-colors">
                         {copiedKeyId === key.id ? "[Copied]" : "[Copy]"}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        key.environment === "Production" ? "bg-green-500" : "bg-amber-500"
                      )} />
                      {key.environment === "Production" ? "Prod" : "Dev"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={key.status === "Active" ? "text-neutral-300" : "text-neutral-500"}>{key.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-neutral-500">
          <div>Free plan: {keys.length} of 1 keys used</div>
          <div className="mt-1 flex items-center gap-2">
            Need more? 
            <a href="/dashboard/usage" className="text-white hover:text-neutral-300 transition-colors flex items-center gap-1 group">
              [Upgrade to Starter <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />]
            </a>
          </div>
        </div>

      </div>

      {/* CREATE API KEY MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div 
                initial={{ scale: 0.98, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0, y: 10 }}
                className="w-full max-w-[440px] bg-[#050505] border border-white/10 rounded-sm shadow-2xl flex flex-col font-mono text-[13px]"
                onClick={e => e.stopPropagation()}
              >
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                  <div className="text-white font-medium">Create API Key</div>
                  <button onClick={() => setShowCreateModal(false)} className="text-neutral-500 hover:text-white transition-colors">
                     [x]
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-neutral-400 mb-2">Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Production Backend"
                      value={createName}
                      onChange={e => setCreateName(e.target.value)}
                      className="w-full h-10 bg-transparent border border-white/10 rounded-sm px-3 text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-neutral-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-neutral-400 mb-2">Environment</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                         onClick={() => setCreateEnv("Production")}
                         className={cn(
                           "flex items-center gap-2 p-3 rounded-sm border transition-colors text-left",
                           createEnv === "Production" ? "bg-white/10 border-white/30 text-white" : "bg-transparent border-white/10 text-neutral-400 hover:border-white/20"
                         )}
                       >
                         <Server className="w-3.5 h-3.5" />
                         <span>Prod</span>
                       </button>
                       <button 
                         onClick={() => { if (!isFreePlan) setCreateEnv("Development") }}
                         className={cn(
                           "flex items-center justify-between p-3 rounded-sm border text-left",
                           createEnv === "Development" ? "bg-white/10 border-white/30 text-white" : "bg-transparent border-white/10 text-neutral-500",
                           isFreePlan ? "cursor-not-allowed opacity-50" : "hover:border-white/20"
                         )}
                       >
                         <div className="flex items-center gap-2">
                           <Terminal className="w-3.5 h-3.5" />
                           <span>Dev</span>
                         </div>
                         {isFreePlan && <Lock className="w-3 h-3 text-neutral-600" />}
                       </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-white/10 flex items-center justify-between">
                  <button onClick={() => setShowCreateModal(false)} className="text-neutral-500 hover:text-white transition-colors">
                     Cancel
                  </button>
                  <button 
                    onClick={handleCreateSubmit}
                    disabled={!createName}
                    className="bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1.5 rounded-sm font-medium transition-colors"
                  >
                    Generate Key
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {newlyCreatedKey && (
           <>
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
             className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
           >
             <motion.div 
               initial={{ scale: 0.98, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0, y: 10 }}
               className="w-full max-w-[480px] bg-[#050505] border border-white/10 rounded-sm shadow-2xl p-8 font-mono text-[13px] relative text-center"
             >
               <h2 className="text-white text-[15px] font-medium mb-2">Save your API key</h2>
               <p className="text-neutral-500 mb-6 max-w-sm mx-auto leading-relaxed">
                 Please save this secret key. You will not be able to view it again.
               </p>
               
               <div className="bg-white/5 border border-white/10 rounded-sm p-4 flex items-center justify-between mb-8 group">
                 <div className="text-white tracking-widest break-all select-all text-left">
                   {newlyCreatedKey.fullKeyMock}
                 </div>
               </div>

               <div className="flex items-center justify-center gap-4">
                 <button 
                   onClick={() => {
                     navigator.clipboard.writeText(newlyCreatedKey.fullKeyMock);
                     setCopiedNewKey(true);
                     setTimeout(() => setCopiedNewKey(false), 2000);
                   }}
                   className="border border-white/10 hover:bg-white/5 text-white transition-colors px-6 py-2 rounded-sm"
                 >
                   {copiedNewKey ? "[Copied]" : "[Copy]"}
                 </button>
                 <button 
                   onClick={() => setNewlyCreatedKey(null)}
                   className="bg-white text-black hover:bg-neutral-200 px-6 py-2 rounded-sm font-medium transition-colors"
                 >
                   Done
                 </button>
               </div>
             </motion.div>
           </motion.div>
         </>
        )}
      </AnimatePresence>

    </div>
  );
}
