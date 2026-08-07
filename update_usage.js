const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/dashboard/usage-client.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add imports
content = content.replace(
  `import { twMerge } from "tailwind-merge";`,
  `import { twMerge } from "tailwind-merge";\n\nimport { createClient } from "@/utils/supabase/client";\nimport { useWorkspace } from "@/components/providers/workspace-provider";`
);

// 2. Add subscription state and fetch logic
const oldHooks = `export function UsageClient() {
  const [isMounted, setIsMounted] = useState(false);
  const [timeRange, setTimeRange] = useState("30 Days");
  
  useEffect(() => // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true), []);`;

const newHooks = `export function UsageClient() {
  const { activeWorkspace } = useWorkspace();
  const [isMounted, setIsMounted] = useState(false);
  const [timeRange, setTimeRange] = useState("30 Days");
  const [subscription, setSubscription] = useState<any>(null);
  
  const supabase = createClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (activeWorkspace) {
      const fetchSubscription = async () => {
        const { data, error } = await supabase
          .from('workspace_subscriptions')
          .select('*')
          .eq('workspace_id', activeWorkspace.id)
          .single();
        if (data && !error) {
          setSubscription(data);
        }
      };
      fetchSubscription();
    }
  }, [activeWorkspace]);`;

content = content.replace(oldHooks, newHooks);

// 3. Update loading condition to wait for subscription
const oldLoading = `  if (!isMounted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-neutral-500">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-[13px] font-mono">Loading Usage Data...</span>
      </div>
    );
  }`;

const newLoading = `  if (!isMounted || !subscription) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-neutral-500">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-[13px] font-mono">Loading Usage Data...</span>
      </div>
    );
  }`;

content = content.replace(oldLoading, newLoading);

// 4. Update data variables
const oldData = `  // Current Plan Mock Data
  const monthlyLimit = 50000;
  const used = 18420;
  const remaining = monthlyLimit - used;
  const usagePercentage = (used / monthlyLimit) * 100;`;

const newData = `  // Current Plan Real Data
  const monthlyLimit = subscription?.included_scans || 50000;
  const used = subscription?.scans_used || 0;
  const remaining = Math.max(0, monthlyLimit - used);
  const usagePercentage = Math.min(100, (used / monthlyLimit) * 100);`;

content = content.replace(oldData, newData);

// 5. Update "Current Plan" box (e.g. Starter text)
const oldPlanName = `<span className="text-[28px] font-black tracking-tight text-white leading-none">Starter</span>`;
const newPlanName = `<span className="text-[28px] font-black tracking-tight text-white leading-none uppercase">{subscription?.plan_name || 'Starter'}</span>`;
content = content.replace(oldPlanName, newPlanName);

// Update period end date in UI
const oldResetDate = `<span className="text-white ml-2">Aug 1, 2024</span>`;
const newResetDate = `<span className="text-white ml-2">{new Date(subscription?.period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>`;
content = content.replace(oldResetDate, newResetDate);

fs.writeFileSync(filePath, content);
console.log('Update usage-client.tsx complete.');
