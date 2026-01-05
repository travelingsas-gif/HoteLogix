import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ntczqtbxrqyvwohlqrqc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50Y3pxdGJ4cnF5dndvaGxxcnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NDQyMjMsImV4cCI6MjA4MzIyMDIyM30.HxwBipTiZZyLjucGJoLmSJclWaxbS4t8ayiSsW8IpWg';

export const isConfigured = !!supabaseUrl && !!supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);