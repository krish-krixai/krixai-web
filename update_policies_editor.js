const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/dashboard/policies-client.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add handleEditChange function
const handleCreatePattern = `  const handleCreate = () => {`;
const editChangeFn = `
  const handleEditChange = (field: keyof Policy, value: any) => {
    if (editingPolicy) setEditingPolicy({ ...editingPolicy, [field]: value });
  };

  const saveEditingPolicy = () => {
    if (editingPolicy) {
      handleSavePolicy(editingPolicy);
    }
  };
`;
content = content.replace(handleCreatePattern, editChangeFn + '\n' + handleCreatePattern);

// 2. Change Save button
content = content.replace(
  `<button onClick={() => setEditingPolicy(null)} className="h-9 px-6 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[12px] font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all">
                    Save Changes
                  </button>`,
  `<button onClick={saveEditingPolicy} className="h-9 px-6 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[12px] font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all">
                    Save Changes
                  </button>`
);

// 3. Update inputs
content = content.replace(
  `defaultValue={editingPolicy.name} className="w-full h-11`,
  `value={editingPolicy.name} onChange={e => handleEditChange('name', e.target.value)} className="w-full h-11`
);
content = content.replace(
  `defaultValue={editingPolicy.description} rows={2}`,
  `value={editingPolicy.description} onChange={e => handleEditChange('description', e.target.value)} rows={2}`
);

// 4. Update the Category button to be a select
content = content.replace(
  `<button className="w-full h-11 bg-[#111] border border-white/[0.1] rounded-xl px-4 text-[13px] font-bold text-white flex items-center justify-between hover:bg-white/[0.05] transition-colors">
                        {editingPolicy.category_id} <ChevronDown className="w-4 h-4 text-neutral-500" />
                      </button>`,
  `<select value={editingPolicy.category_id} onChange={e => handleEditChange('category_id', e.target.value)} className="w-full h-11 bg-[#111] border border-white/[0.1] rounded-xl px-4 text-[13px] font-bold text-white appearance-none focus:outline-none focus:border-indigo-500 transition-colors">
                          <option value="prompt_injection">Prompt Injection</option>
                          <option value="tool_abuse">Tool Abuse</option>
                          <option value="sensitive_data">Sensitive Data</option>
                          <option value="role_manipulation">Role Manipulation</option>
                          <option value="unicode">Unicode</option>
                          <option value="Normal Prompt">Normal Prompt</option>
                          <option value="All Threats">All Threats</option>
                       </select>`
);

// 5. Update Action button to be a select
content = content.replace(
  `<button className={cn("w-full h-11 border rounded-xl px-4 text-[12px] font-extrabold tracking-widest flex items-center justify-between shadow-inner transition-colors", getActionColors(editingPolicy.action))}>
                        <div className="flex items-center">
                          {getActionIcon(editingPolicy.action)} {editingPolicy.action}
                        </div>
                        <ChevronDown className="w-4 h-4 opacity-70" />
                      </button>`,
  `<select value={editingPolicy.action} onChange={e => handleEditChange('action', e.target.value as PolicyAction)} className={cn("w-full h-11 border rounded-xl px-4 text-[12px] font-extrabold tracking-widest appearance-none focus:outline-none transition-colors", getActionColors(editingPolicy.action))}>
                          <option value="ALLOW">ALLOW</option>
                          <option value="WARN">WARN</option>
                          <option value="BLOCK">BLOCK</option>
                       </select>`
);

// 6. Risk Threshold input mapping
// In the original, there was no input, just a visual bar. We need to add an input range.
// "cursor-ew-resize" div is the handle. 
content = content.replace(
  `<div className="relative w-full h-2.5 bg-[#111] border border-white/[0.1] rounded-full mt-4 group">
                      <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: \`\${editingPolicy.risk_threshold}%\` }} />
                      <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] cursor-ew-resize group-hover:scale-110 transition-transform" style={{ left: \`calc(\${editingPolicy.risk_threshold}% - 10px)\` }} />
                    </div>`,
  `<div className="relative w-full mt-4 flex items-center">
                      <input type="range" min="0" max="100" value={editingPolicy.risk_threshold} onChange={e => handleEditChange('risk_threshold', parseInt(e.target.value))} className="w-full h-2.5 bg-[#111] border border-white/[0.1] rounded-full appearance-none outline-none z-20 cursor-pointer opacity-0" />
                      <div className="absolute top-0 left-0 w-full h-2.5 bg-[#111] border border-white/[0.1] rounded-full pointer-events-none">
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: \`\${editingPolicy.risk_threshold}%\` }} />
                        <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]" style={{ left: \`calc(\${editingPolicy.risk_threshold}% - 10px)\` }} />
                      </div>
                    </div>`
);

// 7. Enable toggle
content = content.replace(
  `<button 
                        className={cn("w-10 h-5 rounded-full relative transition-colors duration-300 focus:outline-none shadow-inner", editingPolicy.enabled ? "bg-indigo-500" : "bg-neutral-800")}
                      >`,
  `<button 
                        onClick={() => handleEditChange('enabled', !editingPolicy.enabled)}
                        className={cn("w-10 h-5 rounded-full relative transition-colors duration-300 focus:outline-none shadow-inner", editingPolicy.enabled ? "bg-indigo-500" : "bg-neutral-800")}
                      >`
);

fs.writeFileSync(filePath, content);
console.log('Editor script update complete.');
