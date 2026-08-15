import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s — Krixai",
    default: "Krixai — AI Security in 2 Lines of Code",
  },
  description: "krixai protects your AI applications against prompt injection, sensitive data leakage, and adversarial attacks before requests ever reach your models.",
  metadataBase: new URL("https://www.krixaisecurity.com"),
  openGraph: {
    title: "Krixai — AI Security in 2 Lines of Code",
    description: "Protect your AI applications against prompt injection and sensitive data leakage.",
    siteName: "krixai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krixai — AI Security in 2 Lines of Code",
    description: "Protect your AI applications against prompt injection and sensitive data leakage.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark bg-[#000000] text-white`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
