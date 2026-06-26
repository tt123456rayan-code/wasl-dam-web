// =====================================================================
// Edge Function: إرسال إشعار بريد إلكتروني لمشتركي المحافظة عند طلب فزعة جديد
// يُستدعى عبر Database Webhook (على INSERT في faz3_requests) أو يدويًا.
// المتغيّرات المطلوبة (Supabase Edge Function Secrets):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//   RESEND_API_KEY (أو أي مزوّد بريد — يسهل استبداله)
//   SITE_URL (مثل https://tt123456rayan-code.github.io/wasl-dam-web)
// =====================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API = "https://api.resend.com/emails";

Deno.serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://tt123456rayan-code.github.io/wasl-dam-web";

    if (!resendKey) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not set" }), { status: 500 });
    }

    // --- اختر الطلبات الجديدة غير المُبلّغ عنها ---
    const { data: requests, error: reqErr } = await supabase
      .from("faz3_requests")
      .select("id, hospital, governorate, blood_type, units_required, urgency, expiry, public_message")
      .eq("is_notified", false)
      .eq("hidden", false)
      .gt("expiry", new Date().toISOString());

    if (reqErr) throw reqErr;
    if (!requests || requests.length === 0) {
      return new Response(JSON.stringify({ sent: 0, reason: "no new requests" }), { status: 200 });
    }

    let totalSent = 0;

    for (const request of requests) {
      // جلب المشتركين النشطين في نفس المحافظة
      const { data: subs, error: subErr } = await supabase
        .from("faz3_subscribers")
        .select("email, first_name, unsubscribe_token")
        .eq("governorate", request.governorate)
        .eq("active", true);

      if (subErr) throw subErr;
      if (!subs || subs.length === 0) {
        // لا مشتركين — علّمه كمُبلّغ لتفادي التكرار
        await supabase.from("faz3_requests").update({ is_notified: true }).eq("id", request.id);
        continue;
      }

      const requestUrl = `${siteUrl}/faz3tak/view?ref=${encodeURIComponent(request.id)}`;
      const bloodLabel = request.blood_type === "unknown" ? "حسب توجيه بنك الدم" : request.blood_type;

      for (const sub of subs) {
        const unsubUrl = `${siteUrl}/faz3tak/unsubscribe?token=${sub.unsubscribe_token}`;
        const html = `
          <div dir="rtl" style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px">
            <h2 style="color:#c01736">🩸 فزعتك — طلب تبرع جديد بالقرب منك</h2>
            <p>مرحبًا ${sub.first_name || ""}،</p>
            <p>يوجد طلب فزعة جديد في <strong>${request.governorate}</strong>:</p>
            <table style="border-collapse:collapse;width:100%;margin:12px 0">
              <tr><td style="padding:6px;border:1px solid #e2e8f0"><strong>المستشفى</strong></td><td style="padding:6px;border:1px solid #e2e8f0">${request.hospital}</td></tr>
              <tr><td style="padding:6px;border:1px solid #e2e8f0"><strong>الفصيلة</strong></td><td style="padding:6px;border:1px solid #e2e8f0">${bloodLabel}</td></tr>
              <tr><td style="padding:6px;border:1px solid #e2e8f0"><strong>الوحدات</strong></td><td style="padding:6px;border:1px solid #e2e8f0">${request.units_required} وحدة</td></tr>
              <tr><td style="padding:6px;border:1px solid #e2e8f0"><strong>رقم الطلب</strong></td><td style="padding:6px;border:1px solid #e2e8f0">${request.id}</td></tr>
            </table>
            <p><a href="${requestUrl}" style="display:inline-block;padding:12px 24px;background:#c01736;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold">اطّلع على الطلب</a></p>
            <p style="font-size:12px;color:#64748b;margin-top:20px">
              يتم الفحص والقبول من خلال بنك الدم أو المستشفى. المنصة لا تتحقق طبيًا من التبرعات.<br>
              في الطوارئ تواصل مباشرة مع المستشفى.
            </p>
            <hr style="margin:16px 0;border:none;border-top:1px solid #e2e8f0">
            <p style="font-size:11px;color:#94a3b8">
              وصلك هذا لأنك مشترك في إشعارات فزعتك — ${request.governorate}.<br>
              <a href="${unsubUrl}">إلغاء الاشتراك</a>
            </p>
          </div>`;

        // إرسال عبر Resend (استبدِل هذا الجزء لأي مزوّد آخر)
        await fetch(RESEND_API, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "فزعتك | Faz3tak <notifications@resend.dev>",
            to: sub.email,
            subject: `🩸 طلب فزعة جديد في ${request.governorate} — ${request.id}`,
            html,
          }),
        });
        totalSent++;
      }

      // علّم الطلب كمُبلّغ
      await supabase.from("faz3_requests").update({ is_notified: true }).eq("id", request.id);
    }

    return new Response(JSON.stringify({ sent: totalSent }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
