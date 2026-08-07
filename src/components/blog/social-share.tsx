"use client";

import React, { useState } from "react";
import { Link2, Check } from "lucide-react";

export function SocialShare({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  // Use dummy domain since we don't have the real one yet
  const fullUrl = `https://krixai.com${url}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
      "_blank"
    );
  };

  const shareLinkedin = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
      "_blank"
    );
  };

  return (
    <div className="flex items-center gap-4 mt-16 pt-8 border-t border-white/[0.04]">
      <span className="text-white font-medium text-[15px]">Share this article</span>
      
      <button 
        onClick={shareLinkedin}
        className="w-10 h-10 bg-white/[0.03] border border-white/[0.08] rounded-full flex items-center justify-center hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-colors group shadow-sm"
      >
        <svg className="w-4 h-4 fill-neutral-400 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      </button>

      <button 
        onClick={shareTwitter}
        className="w-10 h-10 bg-white/[0.03] border border-white/[0.08] rounded-full flex items-center justify-center hover:bg-white hover:border-white transition-colors group shadow-sm"
      >
        <svg className="w-4 h-4 fill-neutral-400 group-hover:fill-black transition-colors" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      <button 
        onClick={copyToClipboard}
        className="flex items-center gap-2 px-4 h-10 bg-white/[0.03] border border-white/[0.08] rounded-full hover:bg-white/[0.08] transition-colors shadow-sm"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-[13px] text-white font-medium">Copied</span>
          </>
        ) : (
          <>
            <Link2 className="w-4 h-4 text-neutral-400" />
            <span className="text-[13px] text-neutral-400 font-medium">Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
