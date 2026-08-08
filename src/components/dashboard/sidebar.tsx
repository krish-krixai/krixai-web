"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Shield,
  Key,
  Settings,
  BarChart3,
  Users,
  BookOpen,
  MessageSquare,
  ArrowUpRight,
  ArrowRight
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LogoLockup } from "@/components/logo";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar({ user }: { user?: { full_name: string; email: string } }) {
  const pathname = usePathname();

  const mainNav = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Detection Logs", href: "/dashboard/logs", icon: Shield },
    { name: "API Keys", href: "/dashboard/keys", icon: Key },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Usage & Billing", href: "/dashboard/usage", icon: BarChart3 },
    { name: "Team", href: "/dashboard/team", icon: Users, badge: "PRO" },
  ];

  return (
    <div className="hidden lg:flex w-[260px] flex-col bg-[#050505] border-r border-white/10 h-screen sticky top-0 font-mono text-[13px]">
      
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
        <Link href="/" className="flex items-center group">
          <LogoLockup className="h-[20px] w-auto text-white group-hover:text-neutral-300 transition-colors" />
        </Link>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {mainNav.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200 group",
                isActive ? "bg-white/10 text-white" : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-400")} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-white/10 text-neutral-400 px-1.5 py-0.5 rounded-sm">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="my-6 border-t border-white/10 mx-3" />

        <a
          href="https://docs.krixaisecurity.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-md text-neutral-400 hover:text-white hover:bg-white/5 transition-all group"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-neutral-500 group-hover:text-neutral-400" />
            <span>Docs</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-400" />
        </a>
        
        <a
          href="mailto:support@krixaisecurity.com"
          className="flex items-center justify-between px-3 py-2 rounded-md text-neutral-400 hover:text-white hover:bg-white/5 transition-all group"
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-neutral-500 group-hover:text-neutral-400" />
            <span>Support</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-400" />
        </a>

        <div className="my-6 border-t border-white/10 mx-3" />

        {/* Usage Box */}
        <div className="px-3 pt-2">
          <div className="text-[11px] text-neutral-500 font-semibold mb-2 uppercase">Free Plan</div>
          <div className="flex items-center justify-between text-[12px] text-white mb-2">
            <span>1,842 / 10,000 req</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-2">
            <div className="bg-white h-full" style={{ width: "18%" }} />
          </div>
          <div className="text-[11px] text-neutral-500 text-right mb-4">18%</div>
          
          <Link href="/dashboard/usage" className="flex items-center gap-1.5 text-[12px] text-white hover:text-neutral-300 transition-colors group">
            [Upgrade <ArrowRight className="w-3 h-3 inline group-hover:translate-x-1 transition-transform" />]
          </Link>
        </div>

      </div>

      {/* Bottom User Area */}
      <div className="p-4 border-t border-white/10 shrink-0">
        <div className="px-2 mb-2 text-neutral-400 text-[12px] truncate">
          {user?.email || "user@email.com"}
        </div>
        <button 
          onClick={async () => {
            const { createClient } = await import("@/utils/supabase/client");
            const supabase = createClient();
            await supabase.auth.signOut();
            window.location.href = "/auth/sign-in";
          }}
          className="px-2 text-[12px] text-neutral-500 hover:text-white transition-colors"
        >
          [Logout]
        </button>
      </div>

    </div>
  );
}
