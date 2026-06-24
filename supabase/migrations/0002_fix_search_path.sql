-- =====================================================================
-- رقعة: إصلاح search_path ليشمل سكيمة extensions (مكان pgcrypto في Supabase)
-- شغّل هذا الملف بعد 0001 لإصلاح خطأ: function crypt(text, text) does not exist
-- آمن لإعادة التشغيل (create or replace).
-- =====================================================================

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

create or replace function faz3_check(p_ref text, p_token text)
returns faz3_requests language plpgsql security definer set search_path = public, extensions as $$
declare r faz3_requests;
begin
  select * into r from faz3_requests where id = p_ref;
  if not found or r.token_hash <> crypt(p_token, r.token_hash) then
    raise exception 'unauthorized';
  end if;
  return r;
end; $$;
