"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Settings, Users, Bell, Shield, Code, Blocks, 
  Sliders, AlertTriangle, Search, CheckCircle2,
  ChevronDown, MoreVertical, Plus, X, Download,
  CloudUpload, Trash2
} from "lucide-react";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Custom Switch Component
function CustomSwitch({ checked, onChange }: { checked: boolean, onChange: (c: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        checked ? "bg-indigo-600" : "bg-white/[0.1] hover:bg-white/[0.15]"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}

function NotificationToggle({ notif, onToggle }: { notif: any, onToggle: () => void }) {
  const [checked, setChecked] = useState(notif.active);
  return (
    <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/[0.08] rounded-xl hover:border-white/[0.15] transition-colors">
      <div className="pr-4">
        <h4 className="text-[14px] font-medium text-white mb-1 tracking-tight">{notif.title}</h4>
        <p className="text-[13px] text-neutral-500 leading-relaxed">{notif.desc}</p>
      </div>
      <CustomSwitch 
        checked={checked} 
        onChange={(c) => {
          setChecked(c);
          onToggle();
        }} 
      />
    </div>
  );
}

export function SettingsClient() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("General");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", desc: "" });
  const [showDangerModal, setShowDangerModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  
  const { activeWorkspace } = useWorkspace();
  const [name, setName] = useState(activeWorkspace?.name || "");
  
  // Update local state when activeWorkspace loads/changes
  useEffect(() => {
    if (activeWorkspace) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(activeWorkspace.name);
    }
  }, [activeWorkspace]);
  
  // Logo Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Deletion State
  const [isDeleting, setIsDeleting] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
    
    setToastMessage({ title: "Changes saved successfully", desc: "All workspace settings are now active." });
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
      window.location.reload();
    }, 1500);
  };

  const handleComingSoon = (featureName: string = "This feature") => {
    setToastMessage({ title: "Coming Soon", desc: `${featureName} is currently in development and will be available soon.` });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const triggerFileSelect = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleRemoveLogo = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeWorkspace) return;
    
    setIsUploading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('workspaces')
      .update({ logo_url: null })
      .eq('id', activeWorkspace.id);
      
    if (error) {
      console.error(error);
      alert("Failed to remove logo.");
      setIsUploading(false);
      return;
    }
    
    setIsUploading(false);
    window.location.reload();
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
    
    // Clear the active workspace cookie
    document.cookie = 'workspace_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Redirect to the homepage
    window.location.href = '/';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeWorkspace) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large. Max size is 2MB.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${activeWorkspace.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('workspace-logos')
      .upload(fileName, file);

    if (uploadError) {
      console.error(uploadError);
      alert("Failed to upload logo.");
      setIsUploading(false);
      return;
    }

    setUploadProgress(80);

    const { data } = supabase.storage
      .from('workspace-logos')
      .getPublicUrl(fileName);

    const { error: dbError } = await supabase
      .from('workspaces')
      .update({ logo_url: data.publicUrl })
      .eq('id', activeWorkspace.id);

    if (dbError) {
      console.error(dbError);
      alert("Failed to save logo to workspace.");
      setIsUploading(false);
      return;
    }

    setUploadProgress(100);
    setTimeout(() => {
      setIsUploading(false);
      window.location.reload();
    }, 500);
  };

  if (!isMounted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-neutral-500">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-[14px] font-medium">Loading Workspace Settings...</span>
      </div>
    );
  }

  const tabs = [
    { id: "General", icon: Settings },
    { id: "Members", icon: Users },
    { id: "Notifications", icon: Bell },
    { id: "Security", icon: Shield },
    { id: "API Defaults", icon: Code },
    { id: "Integrations", icon: Blocks },
    { id: "Advanced", icon: Sliders },
    { id: "Danger Zone", icon: AlertTriangle, danger: true },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Owner": return "text-purple-400 bg-purple-500/10";
      case "Admin": return "text-blue-400 bg-blue-500/10";
      case "Developer": return "text-green-400 bg-green-500/10";
      case "Viewer": return "text-neutral-400 bg-white/[0.05]";
      default: return "text-neutral-400 bg-white/[0.05]";
    }
  };

  return (
    <div className="flex flex-col flex-1 pb-10 max-w-7xl mx-auto w-full">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-8 right-8 z-50 bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-4 shadow-2xl flex items-center space-x-4 min-w-[340px]"
          >
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-[14px] font-medium text-white mb-0.5">{toastMessage.title}</h4>
              <p className="text-[13px] text-neutral-400 leading-tight">{toastMessage.desc}</p>
            </div>
            <button onClick={() => setToastVisible(false)} className="text-neutral-500 hover:text-white transition-colors bg-white/[0.03] hover:bg-white/[0.08] rounded-lg p-1.5">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Danger Modal */}
      <AnimatePresence>
        {showDangerModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-7 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/5 blur-[50px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 mb-5">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-[20px] font-medium text-white mb-2 tracking-tight">Delete Workspace</h3>
                <p className="text-[14px] text-neutral-400 mb-6 leading-relaxed">
                  This action is permanent and cannot be undone. All policies, logs, API keys, and configurations will be permanently deleted.
                </p>
                
                <div className="mb-6">
                  <label className="block text-[13px] font-medium text-neutral-300 mb-2">
                    To confirm, type <span className="text-white font-semibold select-all">{activeWorkspace?.name || "your workspace name"}</span> in the box below
                  </label>
                  <input 
                    type="text" 
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full h-11 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 text-[14px] text-white focus:outline-none focus:border-red-500/50 transition-colors" 
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => { setShowDangerModal(false); setDeleteConfirmText(""); }} 
                    className="flex-1 h-11 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-white rounded-xl text-[14px] font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={deleteConfirmText !== activeWorkspace?.name || isDeleting}
                    onClick={handleDeleteWorkspace}
                    className="flex-1 h-11 bg-red-600 disabled:bg-red-900/50 hover:bg-red-500 disabled:text-white/50 text-white rounded-xl text-[14px] font-medium transition-all flex items-center justify-center"
                  >
                    {isDeleting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Delete Workspace"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mb-10">
        <h1 className="text-[28px] font-semibold tracking-tight text-white mb-1.5">Workspace Settings</h1>
        <p className="text-[15px] text-neutral-400">Manage your workspace, members, security and integrations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* LEFT COLUMN: Navigation */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24 flex flex-col space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200",
                  activeTab === tab.id 
                    ? tab.danger 
                      ? "bg-red-500/10 text-red-400" 
                      : "bg-white/[0.05] text-white"
                    : tab.danger
                      ? "text-red-400/70 hover:bg-red-500/5 hover:text-red-400"
                      : "text-neutral-400 hover:bg-white/[0.03] hover:text-neutral-200"
                )}
              >
                <tab.icon className={cn("w-4 h-4", activeTab === tab.id && !tab.danger ? "text-indigo-400" : "")} />
                <span>{tab.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Content */}
        <div className="flex-1 min-w-0 flex flex-col space-y-8">
          
          <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl overflow-hidden min-h-[600px]">
            
            {/* GENERAL SECTION */}
            {activeTab === "General" && (
              <div className="p-8 md:p-10 space-y-10 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-[20px] font-medium text-white tracking-tight mb-1.5">General Settings</h2>
                  <p className="text-[14px] text-neutral-400">Update your workspace identity and basic configurations.</p>
                </div>
                
                <div className="space-y-8 max-w-2xl">
                  {/* Logo Upload Dropzone */}
                  <div>
                    <label className="block text-[14px] font-medium text-neutral-300 mb-3">Workspace Logo</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                    />
                    
                    <div className="flex items-end space-x-6">
                      <div 
                        onClick={triggerFileSelect}
                        className={cn(
                          "relative w-32 h-32 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden border border-white/[0.08]",
                          isUploading ? "bg-white/[0.02]" : "bg-white/[0.02] hover:bg-white/[0.04]",
                          !activeWorkspace?.logo_url && "border-dashed border-2"
                        )}
                      >
                        {isUploading ? (
                          <div className="w-full space-y-3 px-4 flex flex-col items-center">
                            <div className="text-[12px] font-medium text-indigo-400">
                              {uploadProgress}%
                            </div>
                            <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                            </div>
                          </div>
                        ) : activeWorkspace?.logo_url ? (
                          <div className="flex flex-col items-center justify-center w-full h-full relative group">
                            <img src={activeWorkspace.logo_url} alt="Workspace Logo" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm">
                              <CloudUpload className="w-5 h-5 text-white mb-1" />
                              <span className="text-[11px] font-medium text-white">Change</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center mb-2">
                              <CloudUpload className="w-5 h-5 text-neutral-400" />
                            </div>
                            <p className="text-[12px] font-medium text-white mb-0.5">Upload Logo</p>
                          </>
                        )}
                      </div>
                      
                      {activeWorkspace?.logo_url && (
                        <button 
                          onClick={handleRemoveLogo}
                          className="h-9 px-4 bg-white/[0.03] hover:bg-red-500/10 border border-white/[0.08] hover:border-red-500/20 rounded-lg text-[13px] font-medium text-neutral-400 hover:text-red-400 transition-colors flex items-center mb-1"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Remove Logo
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium text-neutral-300 mb-2">Workspace Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-11 bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 text-[14px] text-white focus:outline-none focus:border-white/[0.2] transition-colors" />
                  </div>
                </div>

                <div className="pt-8 border-t border-white/[0.08] flex justify-end">
                  <button onClick={handleSave} className="h-10 px-6 bg-white text-black hover:bg-neutral-200 rounded-lg text-[14px] font-medium transition-colors flex items-center">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* MEMBERS SECTION */}
            {activeTab === "Members" && (
              <div className="p-8 md:p-10 animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-[20px] font-medium text-white tracking-tight mb-1.5 flex items-center">
                      Members
                      <span className="ml-3 px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md text-[11px] font-bold uppercase tracking-wider">Coming Soon</span>
                    </h2>
                    <p className="text-[14px] text-neutral-400">Manage who has access to this workspace.</p>
                  </div>
                  <button onClick={() => handleComingSoon("Team collaboration")} className="h-10 px-5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[14px] font-medium text-white flex items-center transition-colors">
                    <Plus className="w-4 h-4 mr-2" /> Invite Member
                  </button>
                </div>

                <div className="w-full overflow-x-auto custom-scrollbar">
                  <div className="min-w-[700px]">
                    <div className="flex flex-col items-center justify-center py-16 text-center border-t border-white/[0.04]">
                      <div className="w-12 h-12 rounded-full bg-white/[0.02] flex items-center justify-center mb-4">
                        <Users className="w-5 h-5 text-neutral-500" />
                      </div>
                      <h3 className="text-[14px] font-medium text-white mb-1">No additional members</h3>
                      <p className="text-[13px] text-neutral-400">Invite team members to collaborate in this workspace.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS SECTION */}
            {activeTab === "Notifications" && (
              <div className="p-8 md:p-10 animate-in fade-in duration-300">
                <div className="mb-8">
                  <h2 className="text-[20px] font-medium text-white tracking-tight mb-1.5 flex items-center">
                    Notifications
                    <span className="ml-3 px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md text-[11px] font-bold uppercase tracking-wider">Coming Soon</span>
                  </h2>
                  <p className="text-[14px] text-neutral-400">Choose what events you want to be notified about.</p>
                </div>
                
                <div className="max-w-3xl space-y-4">
                  {[
                    { id: 'email', title: "Email Alerts", desc: "Receive daily summary emails.", active: true },
                    { id: 'threat', title: "Threat Notifications", desc: "Immediate alerts for blocked requests.", active: true },
                    { id: 'weekly', title: "Weekly Reports", desc: "Detailed weekly analytics PDF.", active: false },
                    { id: 'billing', title: "Billing Emails", desc: "Invoices and subscription updates.", active: true },
                    { id: 'security', title: "Security Alerts", desc: "Critical system and policy changes.", active: true },
                  ].map((notif, i) => (
                    <NotificationToggle key={notif.id} notif={notif} onToggle={() => handleComingSoon("Notification delivery")} />
                  ))}
                </div>
              </div>
            )}

            {/* SECURITY SECTION */}
            {activeTab === "Security" && (
              <div className="p-8 md:p-10 space-y-10 animate-in fade-in duration-300 max-w-3xl">
                <div>
                  <h2 className="text-[20px] font-medium text-white tracking-tight mb-1.5 flex items-center">
                    Security
                    <span className="ml-3 px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md text-[11px] font-bold uppercase tracking-wider">Coming Soon</span>
                  </h2>
                  <p className="text-[14px] text-neutral-400">Protect your workspace with advanced security configurations.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/[0.08] rounded-xl">
                    <div className="pr-4">
                      <h4 className="text-[14px] font-medium text-white mb-1 tracking-tight">Two-Factor Authentication (2FA)</h4>
                      <p className="text-[13px] text-neutral-500 leading-relaxed">Require members to use 2FA to access this workspace.</p>
                    </div>
                    <button onClick={() => handleComingSoon("Two-Factor Authentication")} className="h-9 px-4 bg-white/[0.05] border border-white/[0.08] rounded-lg text-[13px] font-medium text-white hover:bg-white/[0.1] transition-colors shrink-0">Enable 2FA</button>
                  </div>
                  
                  <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/[0.08] rounded-xl">
                    <div className="pr-4">
                      <h4 className="text-[14px] font-medium text-white mb-1 tracking-tight">Session Timeout</h4>
                      <p className="text-[13px] text-neutral-500 leading-relaxed">Automatically log out idle users after a duration.</p>
                    </div>
                    <div className="relative w-36 shrink-0">
                      <select onChange={() => handleComingSoon("Session management")} className="w-full h-9 bg-white/[0.05] border border-white/[0.08] rounded-lg pl-3 pr-8 text-[13px] font-medium text-white appearance-none focus:outline-none focus:border-white/[0.2] cursor-pointer">
                        <option>30 Minutes</option>
                        <option>1 Hour</option>
                        <option>24 Hours</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/[0.08] rounded-xl opacity-60">
                    <div className="pr-4">
                      <h4 className="text-[14px] font-medium text-white mb-1 tracking-tight flex items-center">
                        IP Restrictions <span className="ml-2 px-2 py-0.5 bg-white/[0.05] text-neutral-400 rounded text-[10px] font-medium uppercase">Coming Soon</span>
                      </h4>
                      <p className="text-[13px] text-neutral-500 leading-relaxed">Restrict API and dashboard access to specific IP ranges.</p>
                    </div>
                    <button disabled className="h-9 px-4 bg-transparent border border-white/[0.05] rounded-lg text-[13px] font-medium text-neutral-600 cursor-not-allowed shrink-0">Configure</button>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/[0.08] rounded-xl opacity-60">
                    <div className="pr-4">
                      <h4 className="text-[14px] font-medium text-white mb-1 tracking-tight flex items-center">
                        SSO / SAML <span className="ml-2 px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-[10px] font-medium uppercase">Enterprise</span>
                      </h4>
                      <p className="text-[13px] text-neutral-500 leading-relaxed">Authenticate via Okta, Google Workspace, or generic SAML.</p>
                    </div>
                    <button disabled className="h-9 px-4 bg-transparent border border-white/[0.05] rounded-lg text-[13px] font-medium text-neutral-600 cursor-not-allowed shrink-0">Upgrade</button>
                  </div>
                </div>
              </div>
            )}

            {/* API DEFAULTS SECTION */}
            {activeTab === "API Defaults" && (
              <div className="p-8 md:p-10 space-y-10 animate-in fade-in duration-300 max-w-2xl">
                <div>
                  <h2 className="text-[20px] font-medium text-white tracking-tight mb-1.5 flex items-center">
                    API Defaults
                    <span className="ml-3 px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md text-[11px] font-bold uppercase tracking-wider">Coming Soon</span>
                  </h2>
                  <p className="text-[14px] text-neutral-400 leading-relaxed">
                    Configure global fallbacks for your API requests. These settings will automatically apply when you initialize the krixai SDK without providing explicit configurations.
                  </p>
                </div>

                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex flex-col space-y-1 mb-8">
                  <span className="text-[13px] font-medium text-indigo-400">Alpha Feature</span>
                  <span className="text-[13px] font-medium text-indigo-200">API defaults are currently in Alpha. Settings saved here will only apply to the v2 SDK endpoints.</span>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[14px] font-medium text-neutral-300 mb-2">Default LLM Provider</label>
                    <div className="relative">
                      <select className="w-full h-11 bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 text-[14px] text-white appearance-none focus:outline-none focus:border-white/[0.2] transition-colors">
                        <option>OpenAI (Default)</option>
                        <option>Anthropic (Claude)</option>
                        <option>Google (Gemini)</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[14px] font-medium text-neutral-300 mb-2">Default Firewall Policy</label>
                    <div className="relative">
                      <select className="w-full h-11 bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 text-[14px] text-white appearance-none focus:outline-none focus:border-white/[0.2] transition-colors">
                        <option>Strict Block (Recommended)</option>
                        <option>Monitor Only (Allow All)</option>
                        <option>Custom Ruleset Alpha</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[14px] font-medium text-neutral-300 mb-2">Global Risk Threshold</label>
                    <div className="relative">
                      <select className="w-full h-11 bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 text-[14px] text-white appearance-none focus:outline-none focus:border-white/[0.2] transition-colors">
                        <option>High (Block &gt;= 0.85)</option>
                        <option>Medium (Block &gt;= 0.70)</option>
                        <option>Low (Block &gt;= 0.50)</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/[0.08] flex justify-end">
                  <button onClick={() => handleComingSoon("Global API Defaults")} className="h-10 px-6 bg-white text-black hover:bg-neutral-200 rounded-lg text-[14px] font-medium transition-colors flex items-center">
                    Save Defaults
                  </button>
                </div>
              </div>
            )}

            {/* INTEGRATIONS SECTION */}
            {activeTab === "Integrations" && (
              <div className="p-8 md:p-10 animate-in fade-in duration-300">
                <div className="mb-8">
                  <h2 className="text-[20px] font-medium text-white tracking-tight mb-1.5 flex items-center">
                    Integrations
                    <span className="ml-3 px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md text-[11px] font-bold uppercase tracking-wider">Coming Soon</span>
                  </h2>
                  <p className="text-[14px] text-neutral-400 max-w-2xl leading-relaxed">
                    Connect external AI models and services to your workspace. Krixai will automatically route and protect traffic to these connected providers, enabling secure model fallbacks and central logging.
                  </p>
                </div>
                
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex flex-col space-y-1 mb-8 max-w-4xl">
                  <span className="text-[13px] font-medium text-indigo-400">In Development</span>
                  <span className="text-[13px] font-medium text-indigo-200">The integrations ecosystem is currently being built. You will soon be able to securely store your provider API keys directly within Krixai.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                  {[
                    { name: "OpenAI", status: "Not Configured", icon: Blocks, active: false },
                    { name: "Claude", status: "Not Configured", icon: Blocks, active: false },
                    { name: "Gemini", status: "Not Configured", icon: Blocks, active: false },
                    { name: "Groq", status: "Not Configured", icon: Blocks, active: false },
                    { name: "Webhooks", status: "Not Configured", icon: Code, active: false },
                    { name: "Slack", status: "Coming Soon", icon: Bell, active: false, comingSoon: true },
                  ].map((int, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/[0.08] rounded-xl hover:border-white/[0.15] transition-colors group">
                      <div className="flex items-center space-x-4">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center border", int.active ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-white/[0.03] border-white/[0.08] text-neutral-500")}>
                          <int.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-[14px] font-medium text-white flex items-center tracking-tight">
                            {int.name}
                            {int.comingSoon && <span className="ml-2 px-1.5 py-0.5 bg-white/[0.05] text-neutral-400 rounded text-[10px] font-medium uppercase">Soon</span>}
                          </h4>
                          <p className={cn("text-[12px] font-medium mt-0.5", int.active ? "text-green-400" : "text-neutral-500")}>{int.status}</p>
                        </div>
                      </div>
                      {!int.comingSoon && (
                        <button onClick={() => handleComingSoon(`${int.name} Integration`)} className="h-8 px-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg text-[12px] font-medium text-white transition-colors opacity-0 group-hover:opacity-100">
                          {int.active ? "Configure" : "Connect"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADVANCED SECTION */}
            {activeTab === "Advanced" && (
              <div className="p-8 md:p-10 space-y-10 animate-in fade-in duration-300 max-w-3xl">
                <div>
                  <h2 className="text-[20px] font-medium text-white tracking-tight mb-1.5 flex items-center">
                    Advanced Settings
                    <span className="ml-3 px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md text-[11px] font-bold uppercase tracking-wider">Coming Soon</span>
                  </h2>
                  <p className="text-[14px] text-neutral-400">Technical configurations and workspace exports.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/[0.08] rounded-xl">
                    <div className="pr-4">
                      <h4 className="text-[14px] font-medium text-white mb-1 tracking-tight">Workspace Export</h4>
                      <p className="text-[13px] text-neutral-500 leading-relaxed">Download all policies, logs, and configurations as JSON.</p>
                    </div>
                    <button onClick={() => handleComingSoon("Workspace Export")} className="h-9 px-4 bg-white/[0.05] border border-white/[0.08] rounded-lg text-[13px] font-medium text-white hover:bg-white/[0.1] transition-colors flex items-center shrink-0">
                      <Download className="w-4 h-4 mr-2" /> Export JSON
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/[0.08] rounded-xl">
                    <div className="pr-4">
                      <h4 className="text-[14px] font-medium text-white mb-1 tracking-tight">Environment</h4>
                      <p className="text-[13px] text-neutral-500 leading-relaxed">Set the primary operational mode for this workspace.</p>
                    </div>
                    <div className="relative w-40 shrink-0">
                      <select onChange={() => handleComingSoon("Environment Configuration")} className="w-full h-9 bg-white/[0.05] border border-white/[0.08] rounded-lg pl-4 pr-8 text-[13px] font-medium text-white appearance-none focus:outline-none focus:border-white/[0.2] cursor-pointer">
                        <option>Production</option>
                        <option>Development</option>
                        <option>Staging</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DANGER ZONE SECTION */}
            {activeTab === "Danger Zone" && (
              <div className="p-8 md:p-10 space-y-10 animate-in fade-in duration-300 max-w-3xl">
                <div>
                  <h2 className="text-[20px] font-medium text-red-500 tracking-tight mb-1.5 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" /> Danger Zone
                    <span className="ml-3 px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md text-[11px] font-bold uppercase tracking-wider">Coming Soon</span>
                  </h2>
                  <p className="text-[14px] text-neutral-500">Destructive actions that cannot be undone.</p>
                </div>

                <div className="border border-red-500/20 rounded-xl overflow-hidden bg-red-500/5">
                  <div className="p-6 border-b border-red-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="pr-4">
                      <h4 className="text-[14px] font-medium text-white mb-1 tracking-tight">Reset All Policies</h4>
                      <p className="text-[13px] text-neutral-400 leading-relaxed">Revert all firewall rules to default state.</p>
                    </div>
                    <button onClick={() => handleComingSoon("Policy Reset")} className="h-9 px-4 bg-transparent border border-red-500/20 hover:bg-red-500/10 text-red-400 rounded-lg text-[13px] font-medium transition-colors shrink-0">Reset Policies</button>
                  </div>
                  
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="pr-4">
                      <h4 className="text-[14px] font-medium text-white mb-1 tracking-tight">Delete Workspace</h4>
                      <p className="text-[13px] text-neutral-400 leading-relaxed">Permanently delete this workspace and all data.</p>
                    </div>
                    <button onClick={() => setShowDangerModal(true)} className="h-9 px-4 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[13px] font-medium transition-colors shrink-0">
                      Delete Workspace
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
