"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, UserPlus, Search, ChevronDown, MoreVertical, 
  Shield, AlertTriangle, CheckCircle2, Clock, X,
  Mail, Send
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Role = "Owner" | "Admin" | "Developer" | "Viewer";
type Status = "Active" | "Inactive";

interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  joined: string;
  lastActive: string;
  avatarColor: string;
}

import { createClient } from "@/utils/supabase/client";
import { useWorkspace } from "@/components/providers/workspace-provider";

export function TeamClient() {
  const { activeWorkspace } = useWorkspace();
  const supabase = createClient();
  const [members, setMembers] = useState<Member[]>([]);
  const [activeTab, setActiveTab] = useState<"Members" | "Pending" | "Roles" | "Activity">("Members");
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    if (activeWorkspace) {
      fetchMembers();
    }
  }, [activeWorkspace]);

  const fetchMembers = async () => {
    if (!activeWorkspace) return;
    
    // Fetch members and their profiles
    const { data, error } = await supabase
      .from('workspace_members')
      .select(`
        id,
        role,
        status,
        joined_at,
        profiles:user_id ( full_name )
      `)
      .eq('workspace_id', activeWorkspace);

    if (data) {
      setMembers(data.map((m: any) => ({
        id: m.id,
        name: m.profiles?.full_name || "Unknown User",
        email: "user@example.com", // Email is protected in auth.users, ideally added to profiles table
        role: m.role as Role,
        status: m.status === 'ACTIVE' ? "Active" : "Inactive",
        joined: new Date(m.joined_at).toLocaleDateString(),
        lastActive: "Recently",
        avatarColor: "bg-indigo-500/10 text-indigo-400"
      })));
    }
  };
  
  // Modals & Panels
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showDangerModal, setShowDangerModal] = useState(false);
  
  // Invite State
  const [inviteEmails, setInviteEmails] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("Developer");
  const [isInviting, setIsInviting] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Owner": return "text-purple-400 bg-purple-400/10 border-purple-400/20";
      case "Admin": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "Developer": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "Viewer": return "text-neutral-400 bg-neutral-400/10 border-neutral-400/20";
      default: return "text-neutral-400 bg-neutral-400/10 border-neutral-400/20";
    }
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    // Real email invitations coming soon
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 pb-10">
      
      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowInviteModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-white tracking-tight">Invite Members</h3>
                    <p className="text-[12px] text-neutral-500 font-medium">Add people to your krixai workspace.</p>
                  </div>
                </div>
                <button onClick={() => setShowInviteModal(false)} className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleInvite} className="space-y-5 relative z-10">
                <div>
                  <label className="block text-[13px] font-bold text-white mb-2">Email Addresses</label>
                  <textarea 
                    placeholder="Enter emails separated by commas..."
                    value={inviteEmails}
                    onChange={(e) => setInviteEmails(e.target.value)}
                    className="w-full h-24 bg-[#111] border border-white/[0.1] rounded-xl p-4 text-[13px] text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-inner resize-none placeholder-neutral-600 custom-scrollbar"
                  />
                </div>
                
                <div>
                  <label className="block text-[13px] font-bold text-white mb-2">Assign Role</label>
                  <div className="relative">
                    <select 
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as Role)}
                      className="w-full h-11 bg-[#111] border border-white/[0.1] rounded-xl pl-4 pr-10 text-[13px] font-bold text-white appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-inner cursor-pointer"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Developer">Developer</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                  </div>
                </div>

                <button 
                  type="submit" disabled={true}
                  className="w-full h-11 bg-indigo-900/50 text-white/50 cursor-not-allowed rounded-xl text-[14px] font-bold transition-all flex items-center justify-center relative overflow-hidden"
                >
                  <Send className="w-4 h-4 mr-2" /> Send Invitations
                  <span className="absolute top-0 right-0 bg-white/10 text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-bl-lg font-black">Coming Soon</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Member Profile Slide-Over */}
      <AnimatePresence>
        {selectedMember && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" onClick={() => setSelectedMember(null)} />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0a0a0a] border-l border-white/[0.08] shadow-2xl z-[100] flex flex-col"
            >
              <div className="p-6 border-b border-white/[0.05] flex items-center justify-between">
                <h3 className="text-[18px] font-bold text-white tracking-tight">Member Profile</h3>
                <button onClick={() => setSelectedMember(null)} className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-8 flex flex-col flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className={cn("w-24 h-24 rounded-full flex items-center justify-center text-[32px] font-black uppercase mb-4 shadow-xl border border-white/[0.05]", selectedMember.avatarColor)}>
                    {selectedMember.name.charAt(0)}
                  </div>
                  <h2 className="text-[24px] font-bold text-white mb-1">{selectedMember.name}</h2>
                  <p className="text-[14px] text-neutral-400 font-medium mb-3">{selectedMember.email}</p>
                  <span className={cn("text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md border shadow-sm", getRoleBadge(selectedMember.role))}>
                    {selectedMember.role}
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-[12px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Permissions</h4>
                    <div className="bg-[#111] border border-white/[0.05] rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-white">Manage Billing</span>
                        <CheckCircle2 className={cn("w-4 h-4", selectedMember.role === "Owner" || selectedMember.role === "Admin" ? "text-green-400" : "text-neutral-700")} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-white">Manage API Keys</span>
                        <CheckCircle2 className={cn("w-4 h-4", selectedMember.role !== "Viewer" ? "text-green-400" : "text-neutral-700")} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-white">Delete Workspace</span>
                        <CheckCircle2 className={cn("w-4 h-4", selectedMember.role === "Owner" ? "text-red-400" : "text-neutral-700")} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[12px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Recent Activity</h4>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5" />
                        <div>
                          <p className="text-[13px] text-white font-medium">Logged into krixai Dashboard</p>
                          <p className="text-[11px] text-neutral-500">{selectedMember.lastActive}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-neutral-700 mt-1.5" />
                        <div>
                          <p className="text-[13px] text-white font-medium">Joined Workspace</p>
                          <p className="text-[11px] text-neutral-500">{selectedMember.joined}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/[0.05] bg-[#050505]">
                <button 
                  onClick={() => setShowDangerModal(true)}
                  className="w-full h-11 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-[13px] font-bold transition-all"
                >
                  Remove Member
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Danger Modal */}
      <AnimatePresence>
        {showDangerModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-[#0a0a0a] border border-red-500/30 rounded-2xl p-6 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-[18px] font-bold text-white mb-2 tracking-tight">Remove Member</h3>
              <p className="text-[13px] text-neutral-400 font-medium mb-6">
                Are you sure you want to remove {selectedMember?.name}? They will immediately lose access to this workspace.
              </p>
              {selectedMember?.role === "Owner" && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-6">
                  <p className="text-[12px] text-red-400 font-medium">You cannot remove the last remaining Owner of the workspace.</p>
                </div>
              )}
              <div className="flex space-x-3">
                <button onClick={() => setShowDangerModal(false)} className="flex-1 h-10 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-xl text-[13px] font-bold transition-all">Cancel</button>
                <button 
                  disabled={selectedMember?.role === "Owner"}
                  onClick={() => { setShowDangerModal(false); setSelectedMember(null); }} 
                  className="flex-1 h-10 bg-red-600 disabled:bg-red-900/50 hover:bg-red-500 disabled:text-white/50 text-white rounded-xl text-[13px] font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] disabled:shadow-none"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-[32px] font-extrabold tracking-tight text-white mb-1">Team</h1>
          <p className="text-[15px] text-neutral-400 font-medium">Manage your workspace members, invitations and permissions.</p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="mt-4 md:mt-0 h-11 px-6 bg-white text-black hover:bg-neutral-200 rounded-xl text-[14px] font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all flex items-center justify-center"
        >
          <UserPlus className="w-4 h-4 mr-2" /> Invite Member
        </button>
      </div>

      {/* OVERVIEW METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total Members", value: "5", icon: Users },
          { label: "Pending Invites", value: "2", icon: Mail },
          { label: "Admins", value: "1", icon: Shield },
          { label: "Developers", value: "2", icon: Code },
          { label: "Workspace Seats", value: "5 / 10", icon: CheckCircle2 },
        ].map((metric, i) => (
          <div key={i} className="p-5 bg-[#0a0a0a] border border-white/[0.08] rounded-2xl flex flex-col hover:border-white/[0.15] transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-bold text-neutral-500">{metric.label}</span>
              <metric.icon className="w-4 h-4 text-neutral-600" />
            </div>
            <span className="text-[24px] font-black text-white">{metric.value}</span>
          </div>
        ))}
      </div>

      {/* TABS & SEARCH */}
      <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-[24px] shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        <div className="border-b border-white/[0.05] flex items-center justify-between px-6 h-16 shrink-0 bg-[#050505]">
          <div className="flex space-x-6 h-full">
            {(["Members", "Pending", "Roles", "Activity"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "h-full flex items-center text-[13px] font-bold relative transition-colors",
                  activeTab === tab ? "text-white" : "text-neutral-500 hover:text-neutral-300"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="team-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-t-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          {activeTab === "Members" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="relative group w-full max-w-sm">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search members..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 bg-[#111] border border-white/[0.08] rounded-xl pl-11 pr-4 text-[13px] font-medium text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                  />
                </div>
                <div className="hidden md:flex space-x-3">
                  <button className="h-10 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[12px] font-bold text-neutral-400 hover:text-white transition-colors flex items-center">
                    Role <ChevronDown className="w-3.5 h-3.5 ml-2 opacity-70" />
                  </button>
                  <button className="h-10 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[12px] font-bold text-neutral-400 hover:text-white transition-colors flex items-center">
                    Status <ChevronDown className="w-3.5 h-3.5 ml-2 opacity-70" />
                  </button>
                </div>
              </div>

              <div className="w-full overflow-x-auto custom-scrollbar flex-1">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-[3fr_1.5fr_1fr_1.5fr_1.5fr_auto] gap-4 pb-4 border-b border-white/[0.05] text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest px-4">
                    <div>User</div>
                    <div>Role</div>
                    <div>Status</div>
                    <div>Last Active</div>
                    <div>Joined</div>
                    <div className="w-10"></div>
                  </div>
                  <div className="divide-y divide-white/[0.02]">
                    {filteredMembers.map((member: any, i: number) => (
                      <div 
                        key={member.id} 
                        onClick={() => setSelectedMember(member)}
                        className="grid grid-cols-[3fr_1.5fr_1fr_1.5fr_1.5fr_auto] gap-4 py-4 items-center group hover:bg-[#111] px-4 rounded-2xl transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-black uppercase shadow-sm border border-white/[0.05]", member.avatarColor)}>
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-[14px] font-bold text-white mb-0.5 group-hover:text-indigo-400 transition-colors">{member.name}</div>
                            <div className="text-[12px] text-neutral-500">{member.email}</div>
                          </div>
                        </div>
                        <div>
                          <span className={cn("text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border shadow-sm", getRoleBadge(member.role))}>
                            {member.role}
                          </span>
                        </div>
                        <div>
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border shadow-sm",
                            member.status === "Active" ? "text-green-400 bg-green-400/10 border-green-400/20" : "text-neutral-400 bg-neutral-400/10 border-neutral-400/20"
                          )}>
                            {member.status}
                          </span>
                        </div>
                        <div className="text-[13px] text-neutral-400 font-medium flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-2 opacity-50" /> {member.lastActive}
                        </div>
                        <div className="text-[13px] text-neutral-400 font-medium">{member.joined}</div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); }}
                          className="w-9 h-9 rounded-xl hover:bg-white/[0.1] flex items-center justify-center text-neutral-500 hover:text-white transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "Pending" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-neutral-500" />
              </div>
              <h3 className="text-[16px] font-bold text-white mb-1">No Pending Invitations</h3>
              <p className="text-[13px] text-neutral-500 font-medium">Invited members who haven&apos;t joined will appear here.</p>
            </motion.div>
          )}

          {activeTab === "Roles" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
              <div className="w-full overflow-x-auto custom-scrollbar">
                <div className="min-w-[800px] border border-white/[0.05] rounded-2xl overflow-hidden bg-[#111]">
                  <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 p-4 border-b border-white/[0.05] bg-[#050505]">
                    <div className="text-[12px] font-bold text-neutral-400">Feature</div>
                    <div className="text-[12px] font-bold text-purple-400 text-center">Owner</div>
                    <div className="text-[12px] font-bold text-blue-400 text-center">Admin</div>
                    <div className="text-[12px] font-bold text-green-400 text-center">Developer</div>
                    <div className="text-[12px] font-bold text-neutral-400 text-center">Viewer</div>
                  </div>
                  {[
                    "View Analytics", "Test in Playground", "Manage API Keys", "Manage Policies", "Invite Members", "Manage Billing", "Delete Workspace"
                  ].map((feature, i) => (
                    <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 p-4 border-b border-white/[0.02] items-center hover:bg-white/[0.02] transition-colors">
                      <div className="text-[13px] font-medium text-white">{feature}</div>
                      <div className="flex justify-center"><CheckCircle2 className="w-4 h-4 text-purple-400" /></div>
                      <div className="flex justify-center">{i < 6 ? <CheckCircle2 className="w-4 h-4 text-blue-400" /> : <div className="w-2 h-px bg-neutral-700" />}</div>
                      <div className="flex justify-center">{i < 4 ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <div className="w-2 h-px bg-neutral-700" />}</div>
                      <div className="flex justify-center">{i < 2 ? <CheckCircle2 className="w-4 h-4 text-neutral-400" /> : <div className="w-2 h-px bg-neutral-700" />}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "Activity" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 max-w-2xl">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/[0.08] before:to-transparent">
                {[
                  { text: "Krish invited Aman Gupta as Admin", time: "2 hours ago" },
                  { text: "Ananya Sharma updated a Firewall Policy", time: "Yesterday" },
                  { text: "Rahul Verma generated a new API Key", time: "Mar 22, 2026" },
                  { text: "Krish created the Workspace", time: "Jan 12, 2026" },
                ].map((log, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/[0.1] bg-[#111] text-indigo-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-white/[0.05] bg-[#111] shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-white text-[13px]">{log.text}</div>
                      </div>
                      <div className="text-[11px] text-neutral-500 font-medium">{log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}

function Code(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  );
}
