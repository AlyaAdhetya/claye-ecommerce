import { createClient } from '@supabase/supabase-js';

const getStoredVal = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const getSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || getStoredVal('claye_supabase_url') || 'https://nzoqrzdpyhhzxuwmrcux.supabase.co';
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || getStoredVal('claye_supabase_anon_key') || '';
  return { url, anonKey };
};

export const isSupabaseConfigured = () => {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(
    url &&
    anonKey &&
    url.startsWith('https://') &&
    !url.includes('your-project-ref') &&
    !anonKey.includes('your-anon-key') &&
    anonKey.length > 20
  );
};

let clientInstance = null;
let currentKey = '';

export const getClient = () => {
  const { url, anonKey } = getSupabaseConfig();
  if (!isSupabaseConfigured()) return null;
  if (!clientInstance || currentKey !== anonKey) {
    clientInstance = createClient(url, anonKey);
    currentKey = anonKey;
  }
  return clientInstance;
};

// Dynamic client proxy: jika kredensial diupdate di Admin, koneksi langsung aktif
export const supabase = new Proxy({}, {
  get(target, prop) {
    const client = getClient();
    if (!client) return undefined;
    const val = client[prop];
    return typeof val === 'function' ? val.bind(client) : val;
  }
});
