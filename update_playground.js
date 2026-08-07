const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/dashboard/playground-client.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add policyEvaluation to ScanResult interface
content = content.replace(
  `  processingTime: number;
  rawResponse?: any;
}`,
  `  processingTime: number;
  policyEvaluation?: {
    matched_policy_id: string;
    matched_policy_name: string;
    core_decision: "ALLOW" | "WARN" | "BLOCK";
  } | null;
  rawResponse?: any;
}`
);

// 2. Parse policyEvaluation in handleScan
content = content.replace(
  `        processingTime: data.processing_time_ms,
        rawResponse: data.raw_response`,
  `        processingTime: data.processing_time_ms,
        policyEvaluation: data.policy_evaluation,
        rawResponse: data.raw_response`
);

// 3. Display policy evaluation in the "Details" tab (Line ~442 Executive Summary)
const executiveSummaryReplace = `<h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-3">Executive Summary</h4>
                        <div className="grid grid-cols-2 gap-4 text-[12px] font-semibold text-neutral-300 mb-4">
                          <div>
                            <span className="text-neutral-500 block mb-1 font-medium">Risk Score</span>
                            <span className="text-white">{result.score}/100 ({getRiskLevel(result.score)})</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 block mb-1 font-medium">Processing Time</span>
                            <span className="text-white">{result.processingTime}ms</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 block mb-1 font-medium">Core Engine Decision</span>
                            <span className={cn("inline-flex items-center mt-0.5", result.decision === "ALLOW" ? "text-green-400" : result.decision === "WARN" ? "text-amber-400" : "text-red-400")}>
                              {result.decision}
                            </span>
                          </div>
                        </div>`;

const newExecutiveSummaryReplace = `<h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-3">Executive Summary</h4>
                        <div className="grid grid-cols-2 gap-4 text-[12px] font-semibold text-neutral-300 mb-4">
                          <div>
                            <span className="text-neutral-500 block mb-1 font-medium">Risk Score</span>
                            <span className="text-white">{result.score}/100 ({getRiskLevel(result.score)})</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 block mb-1 font-medium">Processing Time</span>
                            <span className="text-white">{result.processingTime}ms</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 block mb-1 font-medium">Core Engine Decision</span>
                            <span className={cn("inline-flex items-center mt-0.5", (result.policyEvaluation?.core_decision || result.decision) === "ALLOW" ? "text-green-400" : (result.policyEvaluation?.core_decision || result.decision) === "WARN" ? "text-amber-400" : "text-red-400")}>
                              {result.policyEvaluation?.core_decision || result.decision}
                            </span>
                          </div>
                          {result.policyEvaluation && (
                            <div>
                              <span className="text-neutral-500 block mb-1 font-medium">Matched Policy</span>
                              <span className="text-indigo-400">{result.policyEvaluation.matched_policy_name}</span>
                            </div>
                          )}
                          {result.policyEvaluation && (
                            <div>
                              <span className="text-neutral-500 block mb-1 font-medium">Final Policy Decision</span>
                              <span className={cn("inline-flex items-center mt-0.5", result.decision === "ALLOW" ? "text-green-400" : result.decision === "WARN" ? "text-amber-400" : "text-red-400")}>
                                {result.decision}
                              </span>
                            </div>
                          )}
                        </div>`;
content = content.replace(executiveSummaryReplace, newExecutiveSummaryReplace);

fs.writeFileSync(filePath, content);
console.log('Update playground complete.');
