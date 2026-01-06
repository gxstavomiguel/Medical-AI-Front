import { createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment.supabase';

export const supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    storageKey: 'sb-auth-token',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});
