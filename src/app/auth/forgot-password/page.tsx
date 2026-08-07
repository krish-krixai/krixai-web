import React from "react";
import { ForgotPasswordClient } from "@/components/auth/forgot-password-client";

export const metadata = {
  title: "Forgot Password | krixai",
  description: "Reset your krixai password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
