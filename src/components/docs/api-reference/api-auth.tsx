import React from "react";
import { CodeBlock } from "@/components/docs/quickstart/code-block";

export function ApiAuth() {
  const authCode = `Authorization: Bearer YOUR_API_KEY`;

  return (
    <div id="authentication" className="flex flex-col pt-12 pb-16 border-t border-white/[0.08] scroll-mt-32">
      <h2 className="text-2xl font-semibold text-white mb-4">Authentication</h2>
      <p className="text-[15px] text-neutral-400 leading-relaxed mb-6">
        The krixai API uses API keys to authenticate requests. You can view and manage your API keys in the dashboard.
        Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.
      </p>
      <p className="text-[15px] text-neutral-400 leading-relaxed mb-8">
        Authentication to the API is performed via HTTP Bearer Auth. Provide your API key as the bearer token value in the Authorization header.
      </p>

      <div className="w-full">
        <CodeBlock language="header" code={authCode} />
      </div>
    </div>
  );
}
