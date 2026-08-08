import React, { Suspense } from "react";
import { VerifyEmailClient } from "@/components/auth/verify-email-client";

export const metadata = {
  title: "Verify Email | krixai",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-white">Loading...</div>}>
      <VerifyEmailClient />
    </Suspense>
  );
}
