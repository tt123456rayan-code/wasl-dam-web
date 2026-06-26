# إعداد نظام إشعارات فزعتك عبر البريد الإلكتروني

## الفكرة
عند توفّر طلب فزعة جديد، يُرسَل بريد تلقائي لكل مشترك في نفس المحافظة فيه:
- تفاصيل الطلب (المستشفى، الفصيلة، الوحدات، رقم الطلب)
- رابط مباشر للطلب
- رابط إلغاء الاشتراك

## المعمارية
1. **جدول `faz3_subscribers`:** بريد + محافظة + رمز إلغاء اشتراك. محمي بـ RLS (لا
   يُقرأ من المتصفح). التسجيل/الإلغاء عبر RPCs.
2. **Edge Function `notify-subscribers`:** تُستدعى عبر Database Webhook (أو Cron أو
   يدويًا). تجلب الطلبات الجديدة غير المُبلّغ عنها + مشتركي المحافظة المطابقة →
   ترسل البريد عبر Resend (مجاني حتى 3,000/شهر) → تعلّم الطلب كمُبلّغ.
3. **صفحتا الاشتراك/الإلغاء:** `/faz3tak/subscribe` و`/faz3tak/unsubscribe?token=...`.

## خطوات التفعيل

### 1) شغّل الهجرة
```sql
-- الصق محتوى supabase/migrations/0004_donor_subscriptions.sql في SQL Editor
```

### 2) أنشئ حساب Resend (مجاني)
https://resend.com → Sign up → API Keys → أنشئ مفتاح.

### 3) انشر الـ Edge Function
```bash
supabase login
supabase link --project-ref nqlvdikrctwndtkrdmae
supabase functions deploy notify-subscribers
```

### 4) اضبط Secrets
```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxx
supabase secrets set SITE_URL=https://tt123456rayan-code.github.io/wasl-dam-web
```
(SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY مُتاحة تلقائيًا داخل Edge Functions.)

### 5) أنشئ Database Webhook (اختياري — أو شغّل يدويًا/Cron)
- Supabase → Database → Webhooks → New
- Table: `faz3_requests` · Event: `INSERT`
- Edge Function: `notify-subscribers`

أو بدلًا من Webhook، فعّل Cron كل 5 دقائق:
```sql
select cron.schedule('notify-faz3tak', '*/5 * * * *',
  $$ select net.http_post(
    url := current_setting('supabase_functions_endpoint') || '/notify-subscribers',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('supabase.anon_key'))
  ) $$
);
```

## الأمان
- الأرقام/البريد لا تظهر علنًا (RLS يمنع قراءة الجدول من anon).
- كل رسالة فيها رابط إلغاء اشتراك يعمل بنقرة واحدة.
- إرسال مرة واحدة لكل طلب (عمود `is_notified`).
- مستقبلًا: إضافة حدّ معدّل + اعتماد إشرافي للطلب قبل الإرسال.

## استبدال المزوّد
الـ Edge Function مصمّمة بحيث يسهل استبدال Resend بأي مزوّد (Mailgun, SendGrid,
Amazon SES) — فقط بدّل الجزء الذي يستدعي `fetch(RESEND_API, ...)`.
