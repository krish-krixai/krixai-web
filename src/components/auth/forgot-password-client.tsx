"use client";

import React, { useState } from "react";
import { AuthLayout } from "./auth-layout";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    setIsLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/auth/email-sent");
  };

  return (
    <AuthLayout title="Reset Password" subtitle="We'll send you instructions to reset your password.">
      <form onSubmit={handleReset} className="space-y-5">
        
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

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full h-10 bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-400 disabled:cursor-not-allowed rounded-lg text-[13.5px] font-semibold transition-colors flex items-center justify-center mt-2"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" /> Sending Link...
            </div>
          ) : "Send Reset Link"}
        </button>

        <div className="text-center pt-2">
          <a href="/auth/sign-in" className="text-[13px] text-neutral-400 font-medium hover:text-white flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In
          </a>
        </div>
      </form>
    </AuthLayout>
  );
}
