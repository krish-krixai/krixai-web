"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TerminalSquare,
  Shield,
  ShieldAlert,
  BarChart3,
  FileCheck2,
  Key,
  CreditCard,
  Settings,
  HelpCircle,
  Moon,
  ChevronUp,
  FileText,
  Bell,
  Users
} from "lucide-react";
import { LogoLockup } from "@/components/logo";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar({ user }: { user?: { full_name: string; email: string } }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Playground", href: "/dashboard/playground", icon: TerminalSquare },
    { name: "Policies", href: "/dashboard/policies", icon: Shield },
    { name: "Logs", href: "/dashboard/logs", icon: FileText },
    { name: "Alerts", href: "/dashboard/alerts", icon: Bell },
  ];

  const settings = [
    { name: "API Keys", href: "/dashboard/keys", icon: Key },
    { name: "Members", href: "/dashboard/members", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  // Helper to determine active state
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="hidden lg:flex w-64 flex-col bg-[#050505] border-r border-white/[0.04] h-screen sticky top-0">
      
      {/* Brand */}
      <div className="h-16 flex items-center px-8 border-b border-white/[0.04] shrink-0">
        <Link href="/" className="flex items-center group">
          <LogoLockup className="h-[22px] w-auto text-white group-hover:text-neutral-300 transition-colors duration-300" />
        </Link>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
        
        <div className="space-y-1">
          <div className="px-3 mb-3 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Platform</div>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-200 group",
                  isActive ? "bg-white/[0.05] text-white shadow-sm ring-1 ring-white/[0.05]" : "text-neutral-400 hover:text-white hover:bg-white/[0.03]"
                )}
              >
                <Icon className={cn("w-[18px] h-[18px] transition-colors duration-200", isActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-300")} strokeWidth={isActive ? 2 : 1.75} />
                <span className="tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="space-y-1">
          <div className="px-3 mb-3 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Account</div>
          {settings.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-200 group",
                  isActive ? "bg-white/[0.05] text-white shadow-sm ring-1 ring-white/[0.05]" : "text-neutral-400 hover:text-white hover:bg-white/[0.03]"
                )}
              >
                <Icon className={cn("w-[18px] h-[18px] transition-colors duration-200", isActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-300")} strokeWidth={isActive ? 2 : 1.75} />
                <span className="tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </div>

      </div>

      {/* Bottom Actions */}
      <div className="p-6 border-t border-white/[0.04] space-y-3 shrink-0">
        <button 
          onClick={async () => {
            const { createClient } = await import("@/utils/supabase/client");
            const supabase = createClient();
            await supabase.auth.signOut();
            window.location.href = "/auth/sign-in";
          }}
          className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-white/[0.03] transition-all duration-300 text-neutral-400 hover:text-red-400 group border border-transparent hover:border-red-500/10 hover:bg-red-500/5 shadow-sm"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center border border-white/10 group-hover:border-red-500/20 shadow-sm transition-colors duration-300">
              <span className="text-[11px] font-extrabold text-white group-hover:text-red-400 tracking-widest transition-colors duration-300">
                {user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : "JD"}
              </span>
            </div>
            <span className="text-[13px] font-bold tracking-wide line-clamp-1 group-hover:text-red-400 transition-colors duration-300">Sign Out</span>
          </div>
        </button>
      </div>

    </div>
  );
}
