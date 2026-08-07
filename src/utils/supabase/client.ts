import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  if (typeof window !== 'undefined') {
    // Suppress Next.js overlay for Supabase auth refresh errors caused by invalid local tokens
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && (event.reason.name === 'AuthRetryableFetchError' || event.reason.message?.includes('refresh'))) {
        event.preventDefault();
      }
    });
  }

  return client;
}
