"use client";

import React from "react";
import { CodeBlock } from "@/components/docs/quickstart/code-block";
import { BookOpen } from "lucide-react";

export function ApiHero() {
  const baseUrlCode = `https://api.krixai.xyz/v1`;

  return (
    <div id="overview" className="flex flex-col mb-16 scroll-mt-32">
      <div className="inline-flex w-max items-center px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8">
        <BookOpen className="w-4 h-4 text-neutral-400 mr-2" />
        <span className="text-[12px] font-medium text-neutral-400 uppercase tracking-widest">API REFERENCE</span>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white leading-[1.2] mb-6">
        krixai REST API
      </h1>
      
      <p className="text-[16px] text-neutral-400 max-w-2xl leading-[1.7] mb-10">
        Protect every AI request before it reaches your LLM using the krixai Runtime Firewall API.
        This API is organized around REST. Our API has predictable resource-oriented URLs, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.
      </p>

      <div id="base-url" className="flex flex-col scroll-mt-32">
        <h2 className="text-xl font-semibold text-white mb-4">Base URL</h2>
        <div className="w-full">
          <CodeBlock language="base url" code={baseUrlCode} />
        </div>
      </div>
    </div>
  );
}
