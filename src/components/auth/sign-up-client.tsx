"use client";

import React, { useState } from "react";
import { AuthLayout } from "./auth-layout";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function SignUpClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [workspace, setWorkspace] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  // Password validation logic
  const hasMinLen = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isPasswordValid = hasMinLen && hasUpper && hasLower && hasNumber && hasSpecial;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !workspace || !password || !confirmPassword) {
      setError("Please fill out all fields.");
      return;
    }
    if (!isPasswordValid) {
      setError("Please meet all password requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("You must agree to the Terms and Privacy Policy.");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    const supabase = createClient();
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          workspace_name: workspace,
        }
      }
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push("/onboarding");
      router.refresh();
    }
  };

  const ValidationItem = ({ met, text }: { met: boolean, text: string }) => (
    <div className="flex items-center space-x-2">
      <CheckCircle2 className={cn("w-3.5 h-3.5 transition-colors", met ? "text-green-400" : "text-neutral-600")} />
      <span className={cn("text-[12px] font-medium transition-colors", met ? "text-white" : "text-neutral-500")}>{text}</span>
    </div>
  );

  return (
    <AuthLayout title="Create Account" subtitle="Start securing your AI models today.">
      <form onSubmit={handleSignUp} className="space-y-5">
        
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-[12px] text-red-200 font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-neutral-300 mb-1.5">Full Name</label>
            <input 
              type="text" 
              placeholder="Jane Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 bg-transparent border border-white/[0.08] rounded-lg px-3 text-[14px] text-white focus:outline-none focus:border-white/[0.2] focus:ring-1 focus:ring-white/[0.2] transition-colors placeholder-neutral-600" 
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-neutral-300 mb-1.5">Work Email</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 bg-transparent border border-white/[0.08] rounded-lg px-3 text-[14px] text-white focus:outline-none focus:border-white/[0.2] focus:ring-1 focus:ring-white/[0.2] transition-colors placeholder-neutral-600" 
            />
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-neutral-300 mb-1.5">Workspace Name</label>
          <input 
            type="text" 
            placeholder="ACME Corp" 
            value={workspace}
            onChange={(e) => setWorkspace(e.target.value)}
            className="w-full h-10 bg-transparent border border-white/[0.08] rounded-lg px-3 text-[14px] text-white focus:outline-none focus:border-white/[0.2] focus:ring-1 focus:ring-white/[0.2] transition-colors placeholder-neutral-600" 
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-neutral-300 mb-1.5">Password</label>
          <div className="relative mb-3">
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
          
          <div className="bg-transparent border border-white/[0.04] rounded-lg p-3 grid grid-cols-2 gap-y-2">
            <ValidationItem met={hasMinLen} text="8+ characters" />
            <ValidationItem met={hasUpper} text="Uppercase letter" />
            <ValidationItem met={hasLower} text="Lowercase letter" />
            <ValidationItem met={hasNumber} text="Number" />
            <ValidationItem met={hasSpecial} text="Special character" />
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-neutral-300 mb-1.5">Confirm Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-10 bg-transparent border border-white/[0.08] rounded-lg px-3 text-[14px] text-white focus:outline-none focus:border-white/[0.2] focus:ring-1 focus:ring-white/[0.2] transition-colors placeholder-neutral-600" 
          />
        </div>

        <div className="flex items-start space-x-3 pt-2">
          <input 
            type="checkbox" 
            id="terms" 
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded-sm border-white/[0.08] bg-transparent checked:bg-white checked:border-white focus:ring-0 focus:ring-offset-0 shrink-0 cursor-pointer" 
          />
          <label htmlFor="terms" className="text-[12px] text-neutral-400 font-medium leading-tight cursor-pointer">
            I agree to the <a href="/terms" className="text-white hover:text-neutral-300 transition-colors">Terms of Service</a> and <a href="/privacy" className="text-white hover:text-neutral-300 transition-colors">Privacy Policy</a>.
          </label>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full h-10 bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-400 disabled:cursor-not-allowed rounded-lg text-[13.5px] font-semibold transition-colors flex items-center justify-center mt-2"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" /> Creating Account...
            </div>
          ) : "Create Account"}
        </button>

        <div className="text-center pt-2">
          <p className="text-[13px] text-neutral-400 font-medium">
            Already have an account? <a href="/auth/sign-in" className="text-white hover:text-neutral-300 transition-colors">Sign In</a>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
