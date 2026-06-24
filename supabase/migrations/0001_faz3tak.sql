-- =====================================================================
-- فزعتك | Faz3tak — هجرة قاعدة البيانات (Supabase / Postgres)
-- تصميم آمن: RLS مفعّل، لا وصول مباشر للجدول الأساسي من المتصفح،
-- الوصول العام عبر عرض (view) يخفي البيانات الحساسة + دوال RPC تتحقق من
-- رمز الإدارة وتطبّق القواعد خادم-جانبيًا.
-- شغّل هذا الملف في Supabase SQL Editor.
-- =====================================================================

create extension if not exists pgcrypto;

do $$ begin
  create type faz3_urgency as enum ('normal','important','urgent');
exception when duplicate_object then null; end $$;

do $$ begin
  create type faz3_privacy as enum ('fullName','partialName','referenceOnly');
exception when duplicate_object then null; end $$;

do $$ begin
  create type faz3_manual_status as enum ('closed','notNeeded');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- الجداول
-- ---------------------------------------------------------------------
create table if not exists faz3_requests (
  id                  text primary key,
  created_at          timestamptz not null default now(),
  requester_full_name text not null,
  privacy_mode        faz3_privacy not null default 'partialName',
  requester_mobile    text,                 -- خاص: لا يُعرض علنًا أبدًا
  hospital            text not null,
  governorate         text not null,
  blood_type          text not null,        -- 'A+' ... أو 'unknown'
  units_required      int  not null check (units_required between 1 and 50),
  units_completed     int  not null default 0 check (units_completed >= 0),
  urgency             faz3_urgency not null default 'important',
  expiry              timestamptz not null,
  public_message      text not null default '',
  manual_status       faz3_manual_status,
  token_hash          text not null,        -- تجزئة رمز الإدارة (لا يُخزَّن الرمز نصًا)
  is_demo             boolean not null default false,
  hidden              boolean not null default false,
  constraint faz3_completed_not_exceed check (units_completed <= units_required)
);

create table if not exists faz3_updates (
  id          uuid primary key default gen_random_uuid(),
  request_id  text not null references faz3_requests(id) on delete cascade,
  at          timestamptz not null default now(),
  type        text not null,
  message     text not null
);

create table if not exists faz3_reports (
  id          uuid primary key default gen_random_uuid(),
  request_id  text not null references faz3_requests(id) on delete cascade,
  reason      text not null,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- اسم العرض العام حسب الخصوصية (لا يكشف الاسم الكامل إلا إذا اختاره صاحب الطلب)
-- ---------------------------------------------------------------------
create or replace function faz3_display_name(full_name text, privacy faz3_privacy, ref text)
returns text language sql immutable as $$
  select case
    when privacy = 'referenceOnly' then 'طلب رقم ' || ref
    when privacy = 'partialName' then
      split_part(trim(full_name), ' ', 1) ||
      case when array_length(string_to_array(trim(full_name), ' '), 1) > 1
        then ' ' || left(split_part(trim(full_name), ' ',
             array_length(string_to_array(trim(full_name), ' '), 1)), 1) || '.'
        else '' end
    else trim(full_name)
  end;
$$;

-- عرض عام آمن: بدون رقم الهاتف، الاسم حسب الخصوصية، فقط الطلبات غير المخفيّة
create or replace view faz3_requests_public as
  select
    id, created_at,
    faz3_display_name(requester_full_name, privacy_mode, id) as display_name,
    privacy_mode, hospital, governorate, blood_type,
    units_required, units_completed, urgency, expiry, public_message,
    manual_status, is_demo
  from faz3_requests
  where hidden = false;

-- ---------------------------------------------------------------------
-- RLS: منع الوصول المباشر للجداول من anon (الوصول عبر العرض/الدوال فقط)
-- ---------------------------------------------------------------------
alter table faz3_requests enable row level security;
alter table faz3_updates  enable row level security;
alter table faz3_reports  enable row level security;

-- قراءة سجل التحديثات للطلبات غير المخفيّة فقط
drop policy if exists faz3_updates_read on faz3_updates;
create policy faz3_updates_read on faz3_updates for select to anon, authenticated
  using (exists (select 1 from faz3_requests r where r.id = request_id and r.hidden = false));

-- منح القراءة على العرض العام فقط
grant select on faz3_requests_public to anon, authenticated;

-- ---------------------------------------------------------------------
-- RPC: إنشاء طلب (الخادم يولّد المرجع والرمز ويعيد الرمز مرة واحدة)
-- ---------------------------------------------------------------------
create or replace function faz3_create_request(
  p_full_name text, p_privacy faz3_privacy, p_mobile text,
  p_hospital text, p_governorate text, p_blood_type text,
  p_units int, p_urgency faz3_urgency, p_expiry timestamptz, p_message text
) returns table(id text, token text)
language plpgsql security definer set search_path = public, extensions as $$
declare v_id text; v_token text;
begin
  if p_units < 1 or p_units > 50 then raise exception 'invalid units'; end if;
  if p_expiry <= now() then raise exception 'expiry must be in the future'; end if;
  loop
    v_id := 'FZ-' || extract(year from now())::int || '-' || (1000 + floor(random()*9000))::int;
    exit when not exists (select 1 from faz3_requests where faz3_requests.id = v_id);
  end loop;
  v_token := encode(gen_random_bytes(6), 'hex');
  insert into faz3_requests(
    id, requester_full_name, privacy_mode, requester_mobile, hospital, governorate,
    blood_type, units_required, units_completed, urgency, expiry, public_message, token_hash)
  values (v_id, p_full_name, p_privacy, nullif(p_mobile, ''), p_hospital, p_governorate,
    p_blood_type, p_units, 0, p_urgency, p_expiry, p_message, crypt(v_token, gen_salt('bf')));
  insert into faz3_updates(request_id, type, message) values (v_id, 'created', 'تم إنشاء الطلب');
  return query select v_id, v_token;
end; $$;

-- التحقق من الرمز (مساعد داخلي)
create or replace function faz3_check(p_ref text, p_token text)
returns faz3_requests language plpgsql security definer set search_path = public, extensions as $
declare r faz3_requests;
begin
  select * into r from faz3_requests where id = p_ref;
  if not found or r.token_hash <> crypt(p_token, r.token_hash) then
    raise exception 'unauthorized';
  end if;
  return r;
end; $$;

-- RPC: تحديث العدد المكتمل (محصور بالحد، إغلاق تلقائي عند الاكتمال)
create or replace function faz3_update_count(p_ref text, p_token text, p_completed int)
returns void language plpgsql security definer set search_path = public, extensions as $
declare r faz3_requests; v int;
begin
  r := faz3_check(p_ref, p_token);
  v := greatest(0, least(p_completed, r.units_required));
  update faz3_requests set units_completed = v where id = p_ref;
  insert into faz3_updates(request_id, type, message)
    values (p_ref, 'countUpdated', 'تم تحديث العدد إلى ' || v || ' من ' || r.units_required);
  if v >= r.units_required then
    insert into faz3_updates(request_id, type, message)
      values (p_ref, 'statusChanged', 'تمت الفزعة — اكتمل الاحتياج');
  end if;
end; $$;

-- RPC: ملاحظة عامة / إلحاح / تمديد / حالة نهائية
create or replace function faz3_add_note(p_ref text, p_token text, p_note text)
returns void language plpgsql security definer set search_path = public, extensions as $
declare r faz3_requests;
begin
  r := faz3_check(p_ref, p_token);
  insert into faz3_updates(request_id, type, message)
    values (p_ref, 'noteAdded', 'ملاحظة من صاحب الطلب: ' || p_note);
end; $$;

create or replace function faz3_set_urgency(p_ref text, p_token text, p_urgency faz3_urgency)
returns void language plpgsql security definer set search_path = public, extensions as $
declare r faz3_requests;
begin
  r := faz3_check(p_ref, p_token);
  update faz3_requests set urgency = p_urgency where id = p_ref;
  insert into faz3_updates(request_id, type, message)
    values (p_ref, 'urgencyChanged', 'تم تغيير مستوى الإلحاح');
end; $$;

create or replace function faz3_extend_expiry(p_ref text, p_token text, p_expiry timestamptz)
returns void language plpgsql security definer set search_path = public, extensions as $
declare r faz3_requests;
begin
  r := faz3_check(p_ref, p_token);
  if p_expiry <= now() or p_expiry <= r.expiry then raise exception 'invalid expiry'; end if;
  update faz3_requests set expiry = p_expiry where id = p_ref;
  insert into faz3_updates(request_id, type, message)
    values (p_ref, 'expiryExtended', 'تم تمديد تاريخ الانتهاء');
end; $$;

create or replace function faz3_set_status(p_ref text, p_token text, p_status faz3_manual_status)
returns void language plpgsql security definer set search_path = public, extensions as $
declare r faz3_requests;
begin
  r := faz3_check(p_ref, p_token);
  update faz3_requests set manual_status = p_status where id = p_ref;
  insert into faz3_updates(request_id, type, message)
    values (p_ref, 'statusChanged', case when p_status = 'closed' then 'أُغلق الطلب' else 'لم يعد الطلب مطلوبًا' end);
end; $$;

-- RPC: بلاغ عن معلومة غير صحيحة
create or replace function faz3_add_report(p_ref text, p_reason text)
returns void language plpgsql security definer set search_path = public, extensions as $
begin
  if not exists (select 1 from faz3_requests where id = p_ref) then raise exception 'not found'; end if;
  insert into faz3_reports(request_id, reason) values (p_ref, p_reason);
end; $$;

-- منح تنفيذ الدوال للعميل العام
grant execute on function faz3_create_request(text,faz3_privacy,text,text,text,text,int,faz3_urgency,timestamptz,text) to anon, authenticated;
grant execute on function faz3_update_count(text,text,int) to anon, authenticated;
grant execute on function faz3_add_note(text,text,text) to anon, authenticated;
grant execute on function faz3_set_urgency(text,text,faz3_urgency) to anon, authenticated;
grant execute on function faz3_extend_expiry(text,text,timestamptz) to anon, authenticated;
grant execute on function faz3_set_status(text,text,faz3_manual_status) to anon, authenticated;
grant execute on function faz3_add_report(text,text) to anon, authenticated;

-- ملاحظة: إجراءات الإشراف (إخفاء/إزالة) لا تُمنح لـ anon عمدًا؛
-- تُنفَّذ عبر مفتاح خدمة (service_role) من بيئة آمنة فقط — وليس من المتصفح.
