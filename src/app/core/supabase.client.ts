import { createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment.supabase';

export const supabase = createClient(
  environment.supabaseUrl,
  environment.supabaseAnonKey,
  {
    auth: {
      storage: window.localStorage,
      persistSession: true,
    },
  }
);
