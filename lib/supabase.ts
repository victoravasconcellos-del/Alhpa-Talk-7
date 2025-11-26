
import { createClient } from '@supabase/supabase-js';

const PROVIDED_SUPABASE_URL = 'https://rrfbmlknbtkritjxwdoo.supabase.co';
const PROVIDED_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyZmJtbGtuYnRrcml0anh3ZG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MTQyODcsImV4cCI6MjA3OTQ5MDI4N30.hdYud3me56voU7CVIbbjTgxaXALUZuz0NmE427ozKgk';

const supabaseUrl = process.env.SUPABASE_URL || PROVIDED_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || PROVIDED_SUPABASE_ANON_KEY;

// Helper to ensure URL is valid to prevent "Failed to construct 'URL'" runtime error
const getValidUrl = (url?: string) => {
  try {
    if (!url) return 'https://placeholder.supabase.co';
    new URL(url);
    return url;
  } catch (e) {
    return 'https://placeholder.supabase.co';
  }
};

// Create client with validated URL and explicit session persistence
export const supabase = createClient(
  getValidUrl(supabaseUrl), 
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true, // Garante que a sessão seja salva no LocalStorage
      autoRefreshToken: true, // Renova o token automaticamente quando expira
      detectSessionInUrl: true // Necessário para links mágicos e OAuth
    }
  }
);

export const isSupabaseConfigured = () => {
    return !!supabaseUrl && supabaseUrl.startsWith('http') && !!supabaseAnonKey;
};
