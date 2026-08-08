"use client";

import React, { useState } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Mail, RefreshCw, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const handleResend = async () => {
    if (!email) {
      setMessage({ type: "error", text: "Email address not found. Please try signing up again." });
      return;
    }

    setIsResending(true);
    setMessage(null);
    const supabase = createClient();
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`
      }
    });

    setIsResending(false);
    
    if (error) {
      // Handle rate limits or other errors
      if (error.status === 429) {
        setMessage({ type: "error", text: "Please wait a few minutes before requesting another email." });
      } else {
        setMessage({ type: "error", text: error.message });
      }
    } else {
      setMessage({ type: "success", text: "Verification email resent successfully!" });
    }
  };

  return (
    <AuthLayout title="Verify your email" subtitle="We've sent a verification link to your inbox.">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Mail className="w-8 h-8 text-indigo-400" />
        </div>
        
        <p className="text-[14px] text-neutral-400 font-medium mb-6 leading-relaxed">
          Please check your email <strong className="text-white">{email ? `(${email})` : ""}</strong> and click the verification link to securely activate your krixai workspace.
        </p>

        {message && (
          <div className={`mb-6 p-3 rounded-xl flex items-start space-x-3 text-left border ${
            message.type === 'success' 
              ? 'bg-green-500/10 border-green-500/20 text-green-300' 
              : 'bg-red-500/10 border-red-500/20 text-red-300'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            )}
            <p className="text-[13px] font-medium">{message.text}</p>
          </div>
        )}

        <div className="space-y-3">
          <button 
            onClick={handleResend}
            disabled={isResending || !email}
            className="w-full h-11 bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-400 disabled:cursor-not-allowed rounded-xl text-[14px] font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all flex items-center justify-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isResending ? 'animate-spin' : ''}`} /> 
            {isResending ? "Resending..." : "Resend Verification Email"}
          </button>
          
          <Link href="/auth/sign-in" className="w-full h-11 bg-transparent hover:bg-white/[0.05] border border-transparent rounded-xl text-[14px] font-bold text-neutral-400 hover:text-white transition-all flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
