import React from "react";

export function ApiStatusCodes() {
  const codes = [
    { status: "200", meaning: "OK", cause: "Everything worked as expected." },
    { status: "400", meaning: "Bad Request", cause: "The request was unacceptable, often due to missing a required parameter." },
    { status: "401", meaning: "Unauthorized", cause: "No valid API key provided." },
    { status: "403", meaning: "Forbidden", cause: "The API key doesn't have permissions to perform the request." },
    { status: "404", meaning: "Not Found", cause: "The requested resource doesn't exist." },
    { status: "429", meaning: "Too Many Requests", cause: "Too many requests hit the API too quickly. We recommend an exponential backoff of your requests." },
    { status: "500", meaning: "Internal Server Error", cause: "Something went wrong on krixai's end. (These are rare)." }
  ];

  return (
    <div id="status-codes" className="flex flex-col pt-12 pb-16 border-t border-white/[0.08] scroll-mt-32">
      <h2 className="text-2xl font-semibold text-white mb-4">HTTP Status Codes</h2>
      <p className="text-[15px] text-neutral-400 leading-relaxed mb-8">
        krixai uses conventional HTTP response codes to indicate the success or failure of an API request. 
        In general: Codes in the <code className="text-neutral-300">2xx</code> range indicate success. 
        Codes in the <code className="text-neutral-300">4xx</code> range indicate an error that failed given the information provided (e.g., a required parameter was omitted). 
        Codes in the <code className="text-neutral-300">5xx</code> range indicate an error with krixai&apos;s servers.
      </p>

      <div className="w-full border border-white/[0.08] rounded-xl overflow-hidden bg-[#050505]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="sticky top-0 bg-black/80 backdrop-blur-md py-4 px-6 text-[12px] font-semibold text-neutral-400 uppercase tracking-widest w-1/5">Status</th>
              <th className="sticky top-0 bg-black/80 backdrop-blur-md py-4 px-6 text-[12px] font-semibold text-neutral-400 uppercase tracking-widest w-1/4 border-l border-white/[0.04]">Meaning</th>
              <th className="sticky top-0 bg-black/80 backdrop-blur-md py-4 px-6 text-[12px] font-semibold text-neutral-400 uppercase tracking-widest border-l border-white/[0.04]">Common Cause</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {codes.map((item, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6">
                  <span className={`text-[13px] font-mono ${item.status.startsWith('2') ? 'text-emerald-400' : item.status.startsWith('4') ? 'text-amber-400' : 'text-red-400'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-[14px] font-medium text-neutral-200">
                  {item.meaning}
                </td>
                <td className="py-4 px-6 text-[14px] text-neutral-400">
                  {item.cause}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
