import React from "react";
import { SignInClient } from "@/components/auth/sign-in-client";

export const metadata = {
  title: "Sign In | krixai",
  description: "Sign in to your krixai workspace.",
};

export default function SignInPage() {
  return <SignInClient />;
}
