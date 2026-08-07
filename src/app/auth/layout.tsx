import React from "react";

export default function AuthRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      {children}
    </div>
  );
}
