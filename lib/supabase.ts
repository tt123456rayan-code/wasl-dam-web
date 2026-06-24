import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// يُفعّل Supabase فقط عند توفّر متغيّرات البيئة. خلاف ذلك يبقى التطبيق على
// التخزين المحلي (localStorage) دون أي كسر — هذا يسمح بالانتقال التدريجي.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseEnabled = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseEnabled
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: false },
    })
  : null;
