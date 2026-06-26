-- =====================================================================
-- نظام اشتراك المتبرعين للإشعارات عبر البريد الإلكتروني
-- عند توفّر طلب فزعة معتمَد في نفس محافظة المشترك → Edge Function
-- ترسل إيميلًا فيه رابط الطلب + رابط إلغاء الاشتراك.
-- =====================================================================

create table if not exists faz3_subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           text not null,
  first_name      text not null default '',
  governorate     text not null,
  blood_type      text,                    -- اختياري: لتصفية أدقّ مستقبلًا
  subscribed_at   timestamptz not null default now(),
  unsubscribe_token text not null default encode(gen_random_bytes(16), 'hex'),
  active          boolean not null default true,
  constraint faz3_sub_unique_email_gov unique (email, governorate)
);

-- RLS: لا أحد يقرأ جدول المشتركين من المتصفح (قراءة من Edge Function فقط عبر service_role)
alter table faz3_subscribers enable row level security;
-- لا سياسة select/insert/update/delete لـ anon = ممنوع تمامًا

-- RPC: اشتراك (مفتوح لـ anon — يسجّل بموافقة صريحة)
create or replace function faz3_subscribe(
  p_email text, p_first_name text, p_governorate text, p_blood_type text
) returns text -- يُعيد unsubscribe_token
language plpgsql security definer set search_path = public, extensions as $$
declare v_token text;
begin
  if p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'invalid email';
  end if;
  -- إذا موجود سابقًا → أعد تفعيله
  update faz3_subscribers set active = true, first_name = p_first_name,
    blood_type = nullif(p_blood_type, '')
  where email = lower(trim(p_email)) and governorate = p_governorate
  returning unsubscribe_token into v_token;
  if found then return v_token; end if;
  -- إنشاء جديد
  insert into faz3_subscribers(email, first_name, governorate, blood_type)
  values (lower(trim(p_email)), p_first_name, p_governorate, nullif(p_blood_type, ''))
  returning unsubscribe_token into v_token;
  return v_token;
end; $$;

-- RPC: إلغاء الاشتراك (بالرمز — لا يحتاج مصادقة)
create or replace function faz3_unsubscribe(p_token text)
returns void language plpgsql security definer set search_path = public as $$
begin
  update faz3_subscribers set active = false where unsubscribe_token = p_token;
  if not found then raise exception 'invalid token'; end if;
end; $$;

grant execute on function faz3_subscribe(text,text,text,text) to anon, authenticated;
grant execute on function faz3_unsubscribe(text) to anon, authenticated;

-- =====================================================================
-- عمود is_notified: لتتبّع هل تمّ إرسال إشعار لطلب ما (تُحدّثه Edge Function)
-- =====================================================================
alter table faz3_requests add column if not exists is_notified boolean not null default false;
