import React from "react";
import { CodeTabs } from "./code-tabs";

export function Step2Install() {
  const installTabs = [
    {
      id: "python",
      label: "Python",
      language: "bash",
      code: "pip install krixai"
    },
    {
      id: "node",
      label: "Node.js",
      language: "bash",
      code: "npm install @krixai/sdk"
    },
    {
      id: "rest",
      label: "REST API",
      language: "text",
      code: "# No installation required. Make HTTP requests directly to api.krixai.com"
    }
  ];

  return (
    <div id="step-2" className="flex flex-col pt-12 pb-8 border-t border-white/[0.08] scroll-mt-24">
      <h2 className="text-2xl font-semibold text-white mb-4">2. Install the SDK</h2>
      <p className="text-[15px] text-neutral-400 leading-relaxed mb-6">
        We provide official SDKs for Python and Node.js to make integration as seamless as possible. 
        If you are using a different language, you can interact directly with our REST API.
      </p>

      <CodeTabs tabs={installTabs} />
    </div>
  );
}
