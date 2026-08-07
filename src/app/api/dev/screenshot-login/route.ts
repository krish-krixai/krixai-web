import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    return NextResponse.json({ error: 'Missing service role key' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl!, serviceRoleKey);
  
  // Find any user
  const { data: { users }, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
  
  if (error || !users || users.length === 0) {
    return NextResponse.json({ error: 'No users found' }, { status: 500 });
  }

  const user = users[0];
  if (!user.email) {
    return NextResponse.json({ error: 'User has no email' }, { status: 500 });
  }  
  // Create a session (mock or generate link)
  // Actually, Supabase has a way to generate a link for magic link login
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: user.email,
  });

  if (linkError) {
    return NextResponse.json({ error: linkError.message }, { status: 500 });
  }

  return NextResponse.json({ url: linkData.properties.action_link }, { status: 200 });
}
