import React from "react";
import { CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";

export function Step5Handle() {
  return (
    <div id="step-5" className="flex flex-col pt-12 pb-8 border-t border-white/[0.08] scroll-mt-24">
      <h2 className="text-2xl font-semibold text-white mb-4">5. Handle the Response</h2>
      <p className="text-[15px] text-neutral-400 leading-relaxed mb-8">
        The API will return one of three primary decisions based on your configured policy engine. 
        Your application should handle each of these states appropriately.
      </p>

      <div className="flex flex-col space-y-4">
        
        {/* Block */}
        <div className="w-full flex items-start p-5 rounded-xl bg-red-500/5 border border-red-500/10">
          <div className="mt-0.5 mr-4 w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[15px] font-semibold text-red-400 mb-1">BLOCK</h3>
            <p className="text-[14px] text-neutral-400 leading-relaxed">
              A high-confidence threat was detected. Do not forward this prompt to your LLM. Return a safe, generic error message to the user.
            </p>
          </div>
        </div>

        {/* Warn */}
        <div className="w-full flex items-start p-5 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <div className="mt-0.5 mr-4 w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[15px] font-semibold text-amber-400 mb-1">WARN</h3>
            <p className="text-[14px] text-neutral-400 leading-relaxed">
              Suspicious patterns detected, but below the blocking threshold. You can forward this to the LLM, but you may want to flag the session for manual review or restrict the LLM&apos;s system access.
            </p>
          </div>
        </div>

        {/* Allow */}
        <div className="w-full flex items-start p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
          <div className="mt-0.5 mr-4 w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[15px] font-semibold text-emerald-400 mb-1">ALLOW</h3>
            <p className="text-[14px] text-neutral-400 leading-relaxed">
              No threats detected. Safe to forward directly to your LLM provider.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
