"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/ui";
import { Faz3DemoBadge, Faz3EmergencyNotice } from "@/components/faz3tak/ui";
import { BLOOD_TYPES, GOVERNORATES } from "@/lib/types";
import { supabase, isSupabaseEnabled } from "@/lib/supabase";

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "يرجى إدخال بريد إلكتروني صحيح.";
    if (firstName.trim().length < 2) e.firstName = "يرجى إدخال الاسم الأول.";
    if (!governorate) e.governorate = "يرجى اختيار المحافظة.";
    if (!consent) e.consent = "يلزم الموافقة للمتابعة.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    if (!supabase || !isSupabaseEnabled) {
      setSubmitError("قاعدة البيانات غير مُعدّة في هذه النسخة.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.rpc("faz3_subscribe", {
        p_email: email.trim(),
        p_first_name: firstName.trim(),
        p_governorate: governorate,
        p_blood_type: bloodType || null,
      });
      if (error) throw error;
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("invalid email")) setSubmitError("البريد الإلكتروني غير صحيح.");
      else setSubmitError("تعذّر الاشتراك. حاول لاحقًا.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="container-page py-12">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl dark:bg-emerald-500/15">✓</div>
            <h1 className="mt-4 text-2xl font-extrabold">تم الاشتراك</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              سنرسل لك إشعارًا عبر البريد عند توفّر طلب فزعة في <strong>{governorate}</strong>. يمكنك إلغاء الاشتراك في أي وقت من رابط أسفل كل رسالة.
            </p>
          </div>
          <div className="card mt-5 text-sm text-slate-600 dark:text-slate-400">
            <p>
              ملاحظة: لن نشارك بريدك مع أي جهة، ولا نرسل أكثر من إشعار واحد لكل طلب
              فزعة جديد في محافظتك. المنصة لا تتحقق طبيًا من التبرعات.
            </p>
            <Link href="/faz3tak" className="btn-primary mt-4">العودة إلى لوحة فزعتك</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="اشتراك إشعارات فزعتك"
        subtitle="اشترك لتلقّي بريد إلكتروني تلقائي عند توفّر طلب فزعة جديد في محافظتك. مجاني، ويمكنك إلغاء الاشتراك في أي وقت."
      >
        <Faz3DemoBadge />
      </PageHeader>

      <div className="container-page py-8">
        {!isSupabaseEnabled && (
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            قاعدة البيانات غير مُعدّة — الاشتراك يتطلب ضبط مفاتيح Supabase.
          </div>
        )}

        <form onSubmit={submit} noValidate className="mx-auto max-w-lg space-y-5">
          <Field label="البريد الإلكتروني" error={errors.email} htmlFor="email">
            <input id="email" type="email" className="input" placeholder="example@mail.com"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>

          <Field label="الاسم الأول" error={errors.firstName} htmlFor="fn">
            <input id="fn" className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </Field>

          <Field label="المحافظة (ستتلقى إشعارات طلبات هذه المحافظة)" error={errors.governorate} htmlFor="gov">
            <select id="gov" className="input" value={governorate} onChange={(e) => setGovernorate(e.target.value)}>
              <option value="">اختر المحافظة</option>
              {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>

          <Field label="فصيلة دمك (اختياري — للمستقبل)" htmlFor="bt">
            <select id="bt" className="input" value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
              <option value="">لا أرغب بتحديد</option>
              {BLOOD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>

          <div>
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-blood-600 focus:ring-blood-500"
                checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span className="text-slate-600 dark:text-slate-400">
                أوافق على تلقّي إشعارات بريد إلكتروني عند توفّر طلبات فزعة في محافظتي.
                أفهم أنني أستطيع إلغاء الاشتراك في أي وقت، وأن بريدي لن يُشارَك مع أي جهة.
              </span>
            </label>
            {errors.consent && <p className="mt-1 text-sm text-blood-600">{errors.consent}</p>}
          </div>

          {submitError && <p className="text-sm text-blood-600">{submitError}</p>}

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? "جارٍ التسجيل…" : "اشتراك"}
          </button>
        </form>

        <div className="mx-auto mt-8 max-w-lg">
          <Faz3EmergencyNotice />
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, htmlFor, children }: {
  label: string; error?: string; htmlFor: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label" htmlFor={htmlFor}>{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-blood-600">{error}</p>}
    </div>
  );
}
