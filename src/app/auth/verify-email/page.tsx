import React from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Mail, RefreshCw, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Verify Email | krixai",
};

export default function VerifyEmailPage() {
  return (
    <AuthLayout title="Verify your email" subtitle="We've sent a verification link to your inbox.">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Mail className="w-8 h-8 text-indigo-400" />
        </div>
        
        <p className="text-[14px] text-neutral-400 font-medium mb-8 leading-relaxed">
          Please check your email and click the verification link to securely activate your krixai workspace.
        </p>

        <div className="space-y-3">
          <button className="w-full h-11 bg-white text-black hover:bg-neutral-200 rounded-xl text-[14px] font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all flex items-center justify-center">
            <RefreshCw className="w-4 h-4 mr-2" /> Resend Verification Email
          </button>
          
          <a href="/auth/sign-in" className="w-full h-11 bg-transparent hover:bg-white/[0.05] border border-transparent rounded-xl text-[14px] font-bold text-neutral-400 hover:text-white transition-all flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}
