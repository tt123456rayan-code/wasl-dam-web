-- =====================================================================
-- رقعة: قراءة سجل التحديثات عبر دالة security definer
-- سبب: سياسة RLS على faz3_updates كانت تعتمد على استعلام فرعي من
-- faz3_requests وهو نفسه محجوب بـ RLS عن anon، فلم تظهر التحديثات.
-- الحل: دالة تتجاوز RLS بأمان وتعيد تحديثات الطلبات غير المخفيّة فقط.
-- شغّلها في SQL Editor بعد 0001 و0002. آمنة لإعادة التشغيل.
-- =====================================================================

create or replace function faz3_get_updates(p_ref text)
returns table(at timestamptz, type text, message text)
language sql security definer set search_path = public, extensions as $$
  select u.at, u.type, u.message
  from faz3_updates u
  join faz3_requests r on r.id = u.request_id
  where u.request_id = p_ref and r.hidden = false
  order by u.at;
$$;

grant execute on function faz3_get_updates(text) to anon, authenticated;
