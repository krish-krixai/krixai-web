import React from "react";
import { CodeTabs } from "./code-tabs";

export function Step3Init() {
  const initTabs = [
    {
      id: "python",
      label: "Python",
      language: "python",
      code: `import os
from krixai import Krixai

# Initialize the client with your API key
client = Krixai(api_key=os.environ.get("KRIXAI_API_KEY"))`
    },
    {
      id: "node",
      label: "Node.js",
      language: "javascript",
      code: `import { Krixai } from '@krixai/sdk';

// Initialize the client with your API key
const client = new Krixai({
  apiKey: process.env.KRIXAI_API_KEY
});`
    }
  ];

  return (
    <div id="step-3" className="flex flex-col pt-12 pb-8 border-t border-white/[0.08] scroll-mt-24">
      <h2 className="text-2xl font-semibold text-white mb-4">3. Initialize the Client</h2>
      <p className="text-[15px] text-neutral-400 leading-relaxed mb-6">
        Once installed, initialize the client using the API key you generated in Step 1. 
        We strongly recommend loading this key from environment variables rather than hardcoding it.
      </p>

      <CodeTabs tabs={initTabs} />
    </div>
  );
}
