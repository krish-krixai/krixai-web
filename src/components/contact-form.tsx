"use client";

import { useState } from "react";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-[#111] border border-white/[0.08] flex items-center justify-center mb-2">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-white">Message sent</h3>
        <p className="text-[14px] text-neutral-400">
          Thanks for reaching out. Our team will get back to you shortly.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="mt-4 text-[13px] text-neutral-400 hover:text-white transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
      {error && (
        <div className="p-3 text-[13px] text-red-400 bg-[#111] rounded-xl border border-red-900/30">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-[12.5px] font-medium text-neutral-400">First Name</label>
          <input required name="firstName" type="text" placeholder="Jane" className="w-full bg-[#111] border border-white/[0.08] rounded-xl h-11 px-4 text-[14px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 focus:bg-white/[0.03] transition-all" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[12.5px] font-medium text-neutral-400">Last Name</label>
          <input required name="lastName" type="text" placeholder="Doe" className="w-full bg-[#111] border border-white/[0.08] rounded-xl h-11 px-4 text-[14px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 focus:bg-white/[0.03] transition-all" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[12.5px] font-medium text-neutral-400">Work Email</label>
        <input required name="email" type="email" placeholder="jane@company.com" className="w-full bg-[#111] border border-white/[0.08] rounded-xl h-11 px-4 text-[14px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 focus:bg-white/[0.03] transition-all" />
      </div>

      <div className="space-y-1.5">
        <label className="text-[12.5px] font-medium text-neutral-400">Message</label>
        <textarea required name="message" placeholder="Tell us about your security needs..." rows={4} className="w-full bg-[#111] border border-white/[0.08] rounded-xl py-3 px-4 text-[14px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 focus:bg-white/[0.03] transition-all resize-none" />
      </div>

      <button disabled={isSubmitting} type="submit" className="w-full h-11 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-[14px] flex items-center justify-center transition-colors mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
        {isSubmitting ? "Sending..." : "Talk to Sales"}
      </button>
      <p className="text-center text-[12px] text-neutral-500 mt-4 px-4 leading-relaxed">
        By submitting this form, you agree to our <a href="/privacy" className="underline underline-offset-2 hover:text-neutral-300 transition-colors">Privacy Policy</a>.
      </p>
    </form>
  );
}
