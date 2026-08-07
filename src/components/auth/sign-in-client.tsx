"use client";

import React, { useState } from "react";
import { AuthLayout } from "./auth-layout";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function SignInClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    const supabase = createClient();
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <AuthLayout title="Sign In" subtitle="Welcome back to krixai">
      <form onSubmit={handleSignIn} className="space-y-5">
        
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-[12px] text-red-200 font-medium">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-[13px] font-medium text-neutral-300 mb-1.5">Email Address</label>
          <input 
            type="email" 
            placeholder="name@company.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 bg-transparent border border-white/[0.08] rounded-lg px-3 text-[14px] text-white focus:outline-none focus:border-white/[0.2] focus:ring-1 focus:ring-white/[0.2] transition-colors placeholder-neutral-600" 
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[13px] font-medium text-neutral-300">Password</label>
            <a href="/auth/forgot-password" className="text-[12px] font-medium text-neutral-400 hover:text-white transition-colors">Forgot Password?</a>
          </div>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 bg-transparent border border-white/[0.08] rounded-lg pl-3 pr-10 text-[14px] text-white focus:outline-none focus:border-white/[0.2] focus:ring-1 focus:ring-white/[0.2] transition-colors placeholder-neutral-600" 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" id="remember" className="w-4 h-4 rounded-sm border-white/[0.08] bg-transparent checked:bg-white checked:border-white focus:ring-0 focus:ring-offset-0" />
          <label htmlFor="remember" className="text-[13px] text-neutral-400 font-medium cursor-pointer">Remember me for 30 days</label>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full h-10 bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-400 disabled:cursor-not-allowed rounded-lg text-[13.5px] font-semibold transition-colors flex items-center justify-center mt-2"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" /> Authenticating...
            </div>
          ) : "Sign In"}
        </button>

        <div className="flex items-center py-2">
          <div className="flex-1 h-px bg-white/[0.04]" />
          <span className="px-4 text-[11px] text-neutral-500 font-medium uppercase tracking-widest">Or</span>
          <div className="flex-1 h-px bg-white/[0.04]" />
        </div>

        <div className="space-y-3">
          <button type="button" disabled className="w-full h-10 bg-transparent hover:bg-white/[0.02] border border-white/[0.08] rounded-lg text-[13px] font-medium text-white transition-colors flex items-center justify-center relative cursor-not-allowed opacity-50">
            <svg className="w-4 h-4 absolute left-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
            <span className="absolute right-3 text-[9px] font-bold uppercase tracking-widest text-neutral-500">Soon</span>
          </button>
          
          <button type="button" disabled className="w-full h-10 bg-transparent hover:bg-white/[0.02] border border-white/[0.08] rounded-lg text-[13px] font-medium text-white transition-colors flex items-center justify-center relative cursor-not-allowed opacity-50">
            <div className="w-4 h-4 absolute left-3.5 bg-white/[0.1] rounded-sm" />
            Microsoft SSO
            <span className="absolute right-3 text-[9px] font-bold uppercase tracking-widest text-neutral-500">Enterprise</span>
          </button>
        </div>

        <div className="text-center pt-2">
          <p className="text-[13px] text-neutral-400 font-medium">
            Don't have an account? <a href="/auth/sign-up" className="text-white hover:text-neutral-300 transition-colors">Create Account</a>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
