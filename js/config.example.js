// Copy to config.js and provide values from Supabase project settings.
// The anon key is designed for browser use; security is enforced by RLS policies.
window.WEDA_CONFIG = {
  supabaseUrl: "https://YOUR_PROJECT.supabase.co",
  supabaseAnonKey: "YOUR_PUBLIC_ANON_KEY",
  maxDocumentBytes: 15 * 1024 * 1024,
  maxPresentationBytes: 30 * 1024 * 1024
};
