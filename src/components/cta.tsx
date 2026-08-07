"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";

export function Cta() {
  const [hasSession, setHasSession] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const supabase = createClient();

    const checkSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setHasSession(!!user);
      } catch (error) {
        setHasSession(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setHasSession(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <section className="relative w-full bg-[#05070A] py-24 lg:py-32 overflow-hidden flex flex-col items-center border-t border-white/[0.04]">
      {/* Strong Indigo Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-[radial-gradient(circle,rgba(59,130,246,0.06),transparent_60%)] blur-[80px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10 flex flex-col items-center justify-center text-center">

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl lg:text-[4rem] font-medium tracking-tight text-white text-balance leading-[1.05] mb-6 max-w-4xl"
        >
          Put a policy boundary in front of your AI.
        </motion.h2>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-5 justify-center mt-10 w-full sm:w-auto min-h-[56px]"
        >
          {!isLoading && (
            <Link
              href={hasSession ? "/dashboard" : "/sign-up"}
              className="bg-white text-black px-8 py-3.5 rounded-full text-[14px] font-semibold tracking-wide hover:scale-[1.02] hover:bg-neutral-200 transition-all duration-300 ease-out flex items-center justify-center w-full sm:w-auto group shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              <span>{hasSession ? "Open dashboard" : "Get started"}</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          )}
          <Link
            href="/docs"
            className="bg-[#0A0D12] text-neutral-300 border border-white/[0.08] px-8 py-3.5 rounded-full text-[14px] font-medium tracking-wide hover:bg-[#111111] hover:text-white hover:border-white/[0.15] hover:scale-[1.02] transition-all duration-300 ease-out shadow-sm flex items-center justify-center w-full sm:w-auto"
          >
            Read the docs
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
