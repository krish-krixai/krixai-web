"use client";

import React, { useState, useEffect, useRef } from "react";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { createClient } from "@/utils/supabase/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function SettingsClient() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("General");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showDangerModal, setShowDangerModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  
  const { activeWorkspace } = useWorkspace();
  const [name, setName] = useState(activeWorkspace?.name || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (activeWorkspace) {
      setName(activeWorkspace.name);
    }
  }, [activeWorkspace]);

  const handleSave = async () => {
    if (!activeWorkspace) return;
    
    const supabase = createClient();
    const { error } = await supabase
      .from('workspaces')
      .update({ name })
      .eq('id', activeWorkspace.id);
      
    if (error) {
      console.error(error);
      return;
    }
    
    setToastMessage("Settings saved successfully.");
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
      window.location.reload();
    }, 1500);
  };

  const handleComingSoon = () => {
    setToastMessage("Feature in development.");
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleDeleteWorkspace = async () => {
    if (!activeWorkspace) return;
    
    setIsDeleting(true);
    const supabase = createClient();
    
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', activeWorkspace.id);
      
    if (error) {
      console.error(error);
      alert("Failed to delete workspace.");
      setIsDeleting(false);
      return;
    }
    
    document.cookie = 'workspace_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/';
  };

  if (!isMounted) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-[#000000] text-neutral-500 font-mono text-[13px]">
        Loading Settings...
      </div>
    );
  }

  const tabs = [
    { id: "General" },
    { id: "Members" },
    { id: "Notifications" },
    { id: "Security" },
    { id: "API Defaults" },
    { id: "Integrations" },
    { id: "Advanced" },
    { id: "Danger Zone", danger: true },
  ];

  return (
    <div className="flex flex-col flex-1 p-8 font-mono text-[13px] bg-[#000000] min-h-screen text-neutral-300">
      
      {/* TOAST */}
      {toastVisible && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#050505] border border-white/10 p-4 text-[12px] flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-white uppercase tracking-widest">{toastMessage}</span>
        </div>
      )}

      {/* DANGER MODAL */}
      {showDangerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="w-[400px] bg-[#050505] border border-red-500/20 p-6">
            <div className="text-red-500 uppercase tracking-widest mb-4">Confirm Deletion</div>
            <div className="text-neutral-400 mb-4">
              This action is permanent. Type <span className="text-white">[{activeWorkspace?.name}]</span> to confirm.
            </div>
            <input 
              type="text" 
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-red-500/50 mb-6" 
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDangerModal(false)} className="text-neutral-500 hover:text-white transition-colors">
                [Cancel]
              </button>
              <button 
                disabled={deleteConfirmText !== activeWorkspace?.name || isDeleting}
                onClick={handleDeleteWorkspace}
                className="text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
              >
                [Execute Delete]
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1000px] mx-auto w-full space-y-10">
        
        <div>
          <h1 className="text-white text-[15px] font-medium tracking-wide mb-1">Workspace Settings</h1>
          <p className="text-[13px] text-neutral-500">Configure global rules and properties.</p>
        </div>

        <div className="flex gap-10">
          
          {/* SIDE NAV */}
          <div className="w-48 shrink-0 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full text-left px-3 py-2 text-[12px] uppercase tracking-widest transition-colors border-l-2",
                  activeTab === tab.id 
                    ? tab.danger 
                      ? "border-red-500 text-red-500 bg-red-500/5" 
                      : "border-white text-white bg-white/5"
                    : tab.danger
                      ? "border-transparent text-red-500/50 hover:bg-white/5"
                      : "border-transparent text-neutral-600 hover:text-neutral-300 hover:bg-white/5"
                )}
              >
                {tab.id}
              </button>
            ))}
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-h-[500px]">
            
            {activeTab === "General" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="border-b border-white/10 pb-4">
                  <div className="text-white uppercase tracking-widest mb-1">General</div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-neutral-500 uppercase tracking-widest text-[11px] mb-2">Workspace Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="w-full bg-[#050505] border border-white/10 rounded-sm px-4 py-2.5 text-white focus:outline-none focus:border-white/30 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 uppercase tracking-widest text-[11px] mb-2">Workspace Logo</label>
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 border border-dashed border-white/20 rounded-sm flex items-center justify-center text-neutral-600">
                        {activeWorkspace?.logo_url ? <img src={activeWorkspace.logo_url} alt="Logo" className="w-full h-full object-cover" /> : "N/A"}
                      </div>
                      <button className="text-neutral-500 hover:text-white transition-colors" onClick={handleComingSoon}>[Upload Logo]</button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <button onClick={handleSave} className="bg-white text-black px-6 py-2 rounded-sm hover:bg-neutral-200 transition-colors">
                    [Save Configuration]
                  </button>
                </div>
              </div>
            )}

            {["Members", "Notifications", "Security", "API Defaults", "Integrations", "Advanced"].includes(activeTab) && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="border-b border-white/10 pb-4">
                  <div className="text-white uppercase tracking-widest mb-1">{activeTab}</div>
                </div>
                
                <div className="border border-white/5 bg-white/[0.02] p-8 text-center text-neutral-500">
                  This configuration block is currently offline. <br/>
                  <span className="text-indigo-400 mt-2 block">[Coming Soon in v2.1]</span>
                </div>
              </div>
            )}

            {activeTab === "Danger Zone" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="border-b border-red-500/20 pb-4">
                  <div className="text-red-500 uppercase tracking-widest mb-1">Danger Zone</div>
                </div>

                <div className="border border-red-500/20 bg-[#050505] p-6 space-y-6">
                  <div className="flex justify-between items-center pb-6 border-b border-white/5">
                    <div>
                      <div className="text-white font-medium mb-1">Reset Policies</div>
                      <div className="text-neutral-500 text-[12px]">Revert all firewall rules to default state.</div>
                    </div>
                    <button onClick={handleComingSoon} className="text-red-400 hover:text-red-300 border border-red-500/30 px-4 py-2 rounded-sm transition-colors bg-red-500/5">
                      [Reset]
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium mb-1">Delete Workspace</div>
                      <div className="text-neutral-500 text-[12px]">Permanently destroy all data.</div>
                    </div>
                    <button onClick={() => setShowDangerModal(true)} className="bg-red-500 text-white px-4 py-2 rounded-sm hover:bg-red-600 transition-colors">
                      [Destroy]
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
