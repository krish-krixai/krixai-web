import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | krixai",
    default: "krixai - Enterprise AI Security Layer",
  },
  description: "krixai protects your AI applications against prompt injection, sensitive data leakage, and adversarial attacks before requests ever reach your models.",
  metadataBase: new URL("https://krixai.com"),
  openGraph: {
    title: "krixai - Enterprise AI Security Layer",
    description: "Protect your AI applications against prompt injection and sensitive data leakage.",
    url: "https://krixai.com",
    siteName: "krixai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "krixai - Enterprise AI Security Layer",
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
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark bg-[#0A0E1A] text-white`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
