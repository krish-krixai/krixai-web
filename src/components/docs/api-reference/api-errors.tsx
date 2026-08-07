import React from "react";
import { CodeBlock } from "@/components/docs/quickstart/code-block";

export function ApiErrors() {
  const errorSchema = `{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The supplied API key is invalid."
  }
}`;

  const codes = [
    { code: "INVALID_API_KEY", message: "No valid API key provided." },
    { code: "RATE_LIMIT_EXCEEDED", message: "You have hit your organizational rate limit." },
    { code: "MALFORMED_REQUEST", message: "The request body was not valid JSON." },
    { code: "MISSING_REQUIRED_FIELD", message: "A required field (like 'prompt') is missing." }
  ];

  return (
    <div id="errors" className="flex flex-col pt-12 pb-16 border-t border-white/[0.08] scroll-mt-32">
      <h2 className="text-2xl font-semibold text-white mb-4">Errors</h2>
      <p className="text-[15px] text-neutral-400 leading-relaxed mb-8">
        When an API request fails, krixai returns a standard error format. 
        The HTTP response code will be <code className="text-neutral-300">4xx</code> or <code className="text-neutral-300">5xx</code>, 
        and the JSON body will contain a specific error code and a human-readable message.
      </p>

      <h3 className="text-xl font-semibold text-white mb-4">Error Response Format</h3>
      <CodeBlock language="json" code={errorSchema} />

      <h3 className="text-xl font-semibold text-white mt-10 mb-4">Common Error Codes</h3>
      <div className="w-full border border-white/[0.08] rounded-xl overflow-hidden bg-[#050505]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="sticky top-0 bg-black/80 backdrop-blur-md py-4 px-6 text-[12px] font-semibold text-neutral-400 uppercase tracking-widest w-1/3">Code</th>
              <th className="sticky top-0 bg-black/80 backdrop-blur-md py-4 px-6 text-[12px] font-semibold text-neutral-400 uppercase tracking-widest w-2/3 border-l border-white/[0.04]">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {codes.map((item, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6">
                  <span className="text-[13px] font-mono text-red-400">{item.code}</span>
                </td>
                <td className="py-4 px-6 text-[14px] text-neutral-400">
                  {item.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
