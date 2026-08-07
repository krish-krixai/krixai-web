import React from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Account Created | krixai",
};

export default function AccountCreatedPage() {
  return (
    <AuthLayout title="Welcome to krixai." subtitle="Your account has been created successfully.">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>
        
        <p className="text-[14px] text-neutral-400 font-medium mb-8 leading-relaxed">
          Your workspace is ready. Let's get you set up with your first API key and secure your infrastructure.
        </p>

        <a href="/onboarding" className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[14px] font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center group">
          Continue to Onboarding <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </AuthLayout>
  );
}
