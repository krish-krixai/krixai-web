const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/dashboard/threat-logs-client.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add fields to ThreatLog interface
content = content.replace(
  `  sanitizedPrompt: string | null;
}`,
  `  sanitizedPrompt: string | null;
  matchedPolicyName: string | null;
  coreDecision: LogDecision | null;
}`
);

// 2. Add fields to formattedLogs mapping
content = content.replace(
  `        reason: event.explanation_summary,
        sanitizedPrompt: null
      };`,
  `        reason: event.explanation_summary,
        sanitizedPrompt: null,
        matchedPolicyName: event.matched_policy_name || null,
        coreDecision: (event.core_decision as LogDecision) || (event.decision as LogDecision)
      };`
);

// 3. Update Policy Evaluation view
const oldReasoning = `                {/* Reasoning */}
                <div>
                  <h4 className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-4">Policy Evaluation</h4>
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-[14px] text-neutral-300 leading-relaxed font-medium shadow-sm">
                    {selectedLog.reason}
                  </div>
                </div>`;

const newReasoning = `                {/* Reasoning */}
                <div>
                  <h4 className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-4">Policy Evaluation</h4>
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-[14px] text-neutral-300 leading-relaxed font-medium shadow-sm">
                    {selectedLog.matchedPolicyName && (
                      <div className="mb-4 pb-4 border-b border-white/[0.05]">
                        <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Matched Custom Policy</div>
                        <div className="text-indigo-400 font-bold">{selectedLog.matchedPolicyName}</div>
                      </div>
                    )}
                    <div className="mb-4 pb-4 border-b border-white/[0.05]">
                      <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Core Engine Decision</div>
                      <div className={cn("font-bold", (selectedLog.coreDecision || selectedLog.decision) === "ALLOW" ? "text-green-400" : (selectedLog.coreDecision || selectedLog.decision) === "WARN" ? "text-amber-400" : "text-red-400")}>
                         {selectedLog.coreDecision || selectedLog.decision}
                      </div>
                    </div>
                    <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Explanation</div>
                    {selectedLog.reason}
                  </div>
                </div>`;

content = content.replace(oldReasoning, newReasoning);

fs.writeFileSync(filePath, content);
console.log('Update threat logs complete.');
