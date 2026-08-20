import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (!user || authError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const searchParams = new URL(request.url).searchParams;
  const workspace_id = searchParams.get('workspace_id');
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  let query = supabase
    .from('detection_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
    
  if (workspace_id) query = query.eq('workspace_id', workspace_id);
    
  if (status) query = query.eq('status', status);
  if (category) query = query.eq('category', category);
  
  const { data, error, count } = await query;
  
  console.log("FETCHED LOGS:", data?.length, "error:", error?.message);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ data, total: count, limit, offset });
}
