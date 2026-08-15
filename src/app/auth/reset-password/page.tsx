import React from "react";
import { ResetPasswordClient } from "@/components/auth/reset-password-client";

export const metadata = {
  title: "Reset Password",
  description: "Update your krixai password.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}
