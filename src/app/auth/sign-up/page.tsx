import React from "react";
import { SignUpClient } from "@/components/auth/sign-up-client";

export const metadata = {
  title: "Sign Up | krixai",
  description: "Create your krixai workspace.",
};

export default function SignUpPage() {
  return <SignUpClient />;
}
