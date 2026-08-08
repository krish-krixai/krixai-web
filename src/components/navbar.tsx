"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoLockup } from "@/components/logo";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobileMenuOpen]);

  const links = [
    { href: "https://docs.krixaisecurity.com", label: "Docs" },
    { href: "/playground", label: "Playground" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full h-[64px] border-b border-[#1A1A1A] bg-[#000000]/80 backdrop-blur-[20px]">
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
        
        {/* Left: Logo */}
        <div className="flex items-center h-full">
          <Link href="/" className="hover:opacity-80 transition-opacity flex items-center h-full" onClick={() => setIsMobileMenuOpen(false)}>
            <LogoLockup className="h-8 w-auto text-white" />
          </Link>
        </div>

        {/* Center: Empty (as per spec) */}
        <div className="hidden md:block flex-1" />

        {/* Right: Desktop Navigation Links & CTA */}
        <div className="hidden md:flex items-center justify-end space-x-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#A1A1AA] font-medium text-[15px] transition-colors duration-200 hover:text-[#FFFFFF]"
            >
              {link.label}
            </Link>
          ))}
          
          <Link 
            href="/auth/sign-up" 
            className="text-[14px] font-semibold bg-[#FFFFFF] text-[#000000] px-[20px] py-[8px] rounded-[10px] hover:brightness-110 transition-all shadow-[0_0_0_1px_rgba(255,255,255,0.05)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
          >
            Get API Key
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button 
            className="p-2 -mr-2 text-[#A1A1AA] hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed inset-0 top-[64px] z-40 bg-[#000000] border-t border-[#1A1A1A] md:hidden overflow-y-auto px-6 py-8 flex flex-col"
          >
            <div className="flex flex-col space-y-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[18px] font-medium text-[#A1A1AA] hover:text-white transition-colors border-b border-[#1A1A1A] pb-4"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-8 flex flex-col">
              <Link 
                href="/auth/sign-up" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center text-[16px] font-semibold bg-[#FFFFFF] text-[#000000] py-[14px] rounded-[10px] hover:brightness-110 transition-all shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
              >
                Get API Key
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
