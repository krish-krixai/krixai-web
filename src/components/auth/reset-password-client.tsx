"use client";

import React, { useState } from "react";
import { AuthLayout } from "./auth-layout";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ResetPasswordClient() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
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

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
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
    
    setError(null);
    setIsLoading(true);
    
    // Mock Authentication
    setTimeout(() => {
      router.push("/auth/sign-in");
    }, 1500);
  };

  const ValidationItem = ({ met, text }: { met: boolean, text: string }) => (
    <div className="flex items-center space-x-2">
      <CheckCircle2 className={cn("w-3.5 h-3.5 transition-colors", met ? "text-green-400" : "text-neutral-600")} />
      <span className={cn("text-[12px] font-medium transition-colors", met ? "text-white" : "text-neutral-500")}>{text}</span>
    </div>
  );

  return (
    <AuthLayout title="Update Password" subtitle="Enter your new password below.">
      <form onSubmit={handleUpdate} className="space-y-5">
        
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-[12px] text-red-200 font-medium">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-[13px] font-medium text-neutral-300 mb-1.5">New Password</label>
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
          <label className="block text-[13px] font-medium text-neutral-300 mb-1.5">Confirm New Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-10 bg-transparent border border-white/[0.08] rounded-lg px-3 text-[14px] text-white focus:outline-none focus:border-white/[0.2] focus:ring-1 focus:ring-white/[0.2] transition-colors placeholder-neutral-600" 
          />
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full h-10 bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-400 disabled:cursor-not-allowed rounded-lg text-[13.5px] font-semibold transition-colors flex items-center justify-center mt-2"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" /> Updating...
            </div>
          ) : "Update Password"}
        </button>
      </form>
    </AuthLayout>
  );
}
