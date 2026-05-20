import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dxmfavdiygtkoghrreui.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4bWZhdmRpeWd0a29naHJyZXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODk0MTksImV4cCI6MjA5NDA2NTQxOX0.wMzUor68FkmRVrKQWRpTp-sbJofnRaRKuEty4Rq-A1w';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
