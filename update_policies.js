const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/dashboard/policies-client.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update the property access names
content = content.replace(/editingPolicy\.riskThreshold/g, 'editingPolicy.risk_threshold');
content = content.replace(/editingPolicy\.category/g, 'editingPolicy.category_id');
content = content.replace(/policy\.category/g, 'policy.category_id');
content = content.replace(/policy\.updatedAt/g, 'policy.updated_at');
content = content.replace(/editingPolicy\.updatedAt/g, 'editingPolicy.updated_at');

// 2. Add supabase and workspace logic to PoliciesClient
const oldHookStart = `export function PoliciesClient() {
  const [isMounted, setIsMounted] = useState(false);
  const [policies, setPolicies] = useState<Policy[]>(DEFAULT_POLICIES);
  const [search, setSearch] = useState("");
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [showTester, setShowTester] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  useEffect(() => setIsMounted(true), []);

  const totalActive = policies.filter(p => p.enabled).length;
  const totalDisabled = policies.length - totalActive;`;

const newHookStart = `export function PoliciesClient() {
  const { activeWorkspace, activeRole } = useWorkspace();
  const supabase = createClient();
  const [isMounted, setIsMounted] = useState(false);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [search, setSearch] = useState("");
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [showTester, setShowTester] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (activeWorkspace) {
      loadPolicies();
    }
  }, [activeWorkspace]);

  const loadPolicies = async () => {
    if (!activeWorkspace) return;
    const { data } = await supabase.from('workspace_policies').select('*').eq('workspace_id', activeWorkspace.id).order('priority', { ascending: true });
    
    if (data && data.length > 0) {
      setPolicies(data as Policy[]);
    } else {
      // Seed default policies
      const seedData = DEFAULT_POLICIES.map(p => ({ ...p, workspace_id: activeWorkspace.id }));
      const { data: inserted } = await supabase.from('workspace_policies').insert(seedData).select();
      if (inserted) {
        setPolicies(inserted as Policy[]);
      }
    }
  };

  const totalActive = policies.filter(p => p.enabled).length;
  const totalDisabled = policies.length - totalActive;`;

content = content.replace(oldHookStart, newHookStart);

// 3. Update handleToggle
const oldHandleToggle = `  const handleToggle = (id: string) => {
    setPolicies(policies.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };`;

const newHandleToggle = `  const handleToggle = async (id: string) => {
    if (activeRole === 'VIEWER' || activeRole === 'DEVELOPER') return;
    const policy = policies.find(p => p.id === id);
    if (!policy) return;
    const nextEnabled = !policy.enabled;
    // Optimistic update
    setPolicies(policies.map(p => p.id === id ? { ...p, enabled: nextEnabled } : p));
    await supabase.from('workspace_policies').update({ enabled: nextEnabled }).eq('id', id);
  };`;

content = content.replace(oldHandleToggle, newHandleToggle);

// 4. Update Reorder handler
const oldReorderGroup = `<Reorder.Group axis="y" values={policies} onReorder={setPolicies} className="divide-y divide-white/[0.03]">`;
const newReorderGroup = `<Reorder.Group axis="y" values={policies} onReorder={handleReorder} className="divide-y divide-white/[0.03]">`;
content = content.replace(oldReorderGroup, newReorderGroup);

// Insert handleReorder and handleSavePolicy just after handleToggle
const newHandlers = `
  const handleReorder = async (newOrder: Policy[]) => {
    if (activeRole === 'VIEWER' || activeRole === 'DEVELOPER') return;
    setPolicies(newOrder);
    const updates = newOrder.map((p, i) => ({ id: p.id, priority: i }));
    for (const update of updates) {
      await supabase.from('workspace_policies').update({ priority: update.priority }).eq('id', update.id);
    }
  };

  const handleCreate = () => {
    if (activeRole === 'VIEWER' || activeRole === 'DEVELOPER') return;
    setEditingPolicy({
      id: '',
      workspace_id: activeWorkspace?.id || '',
      name: 'New Policy',
      description: '',
      category_id: 'prompt_injection',
      action: 'BLOCK',
      risk_threshold: 75,
      provider_scope: 'All Providers',
      priority: policies.length,
      enabled: true,
      is_default: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  };

  const handleDelete = async (id: string) => {
    if (activeRole === 'VIEWER' || activeRole === 'DEVELOPER') return;
    setPolicies(policies.filter(p => p.id !== id));
    await supabase.from('workspace_policies').delete().eq('id', id);
  };
`;
content = content.replace(newHandleToggle, newHandleToggle + newHandlers);

// 5. Connect Create Policy button
const oldCreateBtn = `<button className="h-10 px-5 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/50 rounded-xl text-[13px] font-bold text-white flex items-center transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]">
            <Plus className="w-4 h-4 mr-2" /> Create Policy
          </button>`;
const newCreateBtn = `<button onClick={handleCreate} disabled={activeRole === 'VIEWER' || activeRole === 'DEVELOPER'} className="h-10 px-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 disabled:text-white/50 border border-indigo-500/50 rounded-xl text-[13px] font-bold text-white flex items-center transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]">
            <Plus className="w-4 h-4 mr-2" /> Create Policy
          </button>`;
content = content.replace(oldCreateBtn, newCreateBtn);

const oldEmptyCreateBtn = `<button className="h-10 px-5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[13px] font-bold text-white transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                Create Your First Policy
              </button>`;
const newEmptyCreateBtn = `<button onClick={handleCreate} disabled={activeRole === 'VIEWER' || activeRole === 'DEVELOPER'} className="h-10 px-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 rounded-xl text-[13px] font-bold text-white transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                Create Your First Policy
              </button>`;
content = content.replace(oldEmptyCreateBtn, newEmptyCreateBtn);

// 6. Connect Delete button
content = content.replace(/<button className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-400\/10 transition-all" title="Delete">/g, 
  `<button onClick={() => handleDelete(policy.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Delete">`);

fs.writeFileSync(filePath, content);
console.log('Update complete.');
