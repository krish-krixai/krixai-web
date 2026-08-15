import React from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Mail, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Email Sent",
};

export default function EmailSentPage() {
  return (
    <AuthLayout title="Check your email" subtitle="We've sent you a password reset link.">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mx-auto mb-6">
          <Mail className="w-6 h-6 text-neutral-300" />
        </div>
        
        <p className="text-[13px] text-neutral-400 font-medium mb-8 leading-relaxed">
          If an account exists for that email address, you will receive instructions to reset your password shortly.
        </p>

        <a href="/auth/sign-in" className="w-full h-10 bg-transparent hover:bg-white/[0.02] border border-white/[0.08] rounded-lg text-[13px] font-medium text-white transition-colors flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In
        </a>
      </div>
    </AuthLayout>
  );
}
