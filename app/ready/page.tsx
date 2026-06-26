"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader, DemoBadge, EligibilityNotice } from "@/components/ui";
import { BLOOD_TYPES, GOVERNORATES } from "@/lib/types";
import { supabase, isSupabaseEnabled } from "@/lib/supabase";

interface FormState {
  fullName: string;
  email: string;
  mobile: string;
  governorate: string;
  bloodType: string;
  lastDonation: string;
  subscribeNotifications: boolean;
  consent: boolean;
}

const initial: FormState = {
  fullName: "",
  email: "",
  mobile: "",
  governorate: "",
  bloodType: "",
  lastDonation: "",
  subscribeNotifications: true,
  consent: false,
};

export default function ReadyPage() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (form.fullName.trim().length < 3) e.fullName = "يرجى إدخال الاسم الكامل (3 أحرف على الأقل).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "يرجى إدخال بريد إلكتروني صحيح.";
    if (form.mobile && !/^0?\d{8,10}$/.test(form.mobile.trim())) e.mobile = "رقم الهاتف غير صحيح (اختياري).";
    if (!form.governorate) e.governorate = "يرجى اختيار المحافظة.";
    if (!form.bloodType) e.bloodType = "يرجى اختيار فصيلة الدم أو «لا أعرف».";
    if (!form.consent) e.consent = "يلزم الموافقة للمتابعة.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;

    // تسجيل الاشتراك في إشعارات فزعتك إن وافق وكان Supabase مفعّلًا
    if (form.subscribeNotifications && isSupabaseEnabled && supabase) {
      try {
        await supabase.rpc("faz3_subscribe", {
          p_email: form.email.trim(),
          p_first_name: form.fullName.trim().split(/\s+/)[0] ?? "",
          p_governorate: form.governorate,
          p_blood_type: form.bloodType === "unknown" ? "" : form.bloodType,
        });
      } catch {
        // لا نوقف التسجيل إن فشل الاشتراك
      }
    }

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl dark:bg-emerald-500/15">
            ✓
          </div>
          <h1 className="mt-5 text-3xl font-extrabold">شكرًا لاستعدادك للعطاء</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            تم تسجيل نيتك للتبرع. هذا ليس موعدًا ولا موافقة طبية — القرار النهائي
            للتبرع يعود لكادر بنك الدم الرسمي عند مراجعتك للمركز.
            {form.subscribeNotifications && (
              <> وسنرسل لك إشعارًا عبر البريد عند توفّر طلب فزعة في محافظتك.</>
            )}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/centers" className="btn-primary">ابحث عن أقرب مركز</Link>
            <Link href="/campaigns" className="btn-secondary">تصفّح الحملات</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="سجّل نيتك للتبرع"
        subtitle="سجّل رغبتك بالتبرع واشترك بإشعارات فزعتك لتلقّي تنبيه عند توفّر طلب فزعة في محافظتك."
      >
        <DemoBadge />
      </PageHeader>

      <div className="container-page py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <form onSubmit={submit} noValidate className="lg:col-span-2 space-y-5">
            <Field label="الاسم الكامل" error={errors.fullName} htmlFor="fullName">
              <input
                id="fullName"
                className="input"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </Field>

            <Field label="البريد الإلكتروني" error={errors.email} htmlFor="email">
              <input
                id="email"
                type="email"
                className="input"
                placeholder="example@mail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Field>

            <Field label="رقم الهاتف المحمول (اختياري)" error={errors.mobile} htmlFor="mobile">
              <input
                id="mobile"
                inputMode="numeric"
                className="input"
                placeholder="07XXXXXXXX"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="المحافظة" error={errors.governorate} htmlFor="gov">
                <select
                  id="gov"
                  className="input"
                  value={form.governorate}
                  onChange={(e) => setForm({ ...form, governorate: e.target.value })}
                >
                  <option value="">اختر المحافظة</option>
                  {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>

              <Field label="فصيلة الدم" error={errors.bloodType} htmlFor="bt">
                <select
                  id="bt"
                  className="input"
                  value={form.bloodType}
                  onChange={(e) => setForm({ ...form, bloodType: e.target.value })}
                >
                  <option value="">اختر الفصيلة</option>
                  {BLOOD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  <option value="unknown">لا أعرف</option>
                </select>
              </Field>
            </div>

            <Field label="تاريخ آخر تبرع (اختياري)" htmlFor="last">
              <input
                id="last"
                type="date"
                className="input"
                value={form.lastDonation}
                onChange={(e) => setForm({ ...form, lastDonation: e.target.value })}
              />
            </Field>

            <div>
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blood-600 focus:ring-blood-500"
                  checked={form.subscribeNotifications}
                  onChange={(e) => setForm({ ...form, subscribeNotifications: e.target.checked })}
                />
                <span className="text-slate-600 dark:text-slate-400">
                  أرغب بتلقّي إشعار عبر البريد عند توفّر طلب فزعة في محافظتي (يمكنك إلغاء الاشتراك لاحقًا).
                </span>
              </label>
            </div>

            <div>
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blood-600 focus:ring-blood-500"
                  checked={form.consent}
                  onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                />
                <span className="text-slate-600 dark:text-slate-400">
                  أوافق على حفظ هذه البيانات محليًا على متصفحي لأغراض التذكير فقط،
                  وأفهم أن هذا التسجيل ليس موافقة طبية ولا موعدًا رسميًا.
                </span>
              </label>
              {errors.consent && (
                <p className="mt-1 text-sm text-blood-600">{errors.consent}</p>
              )}
            </div>

            <button type="submit" className="btn-primary w-full sm:w-auto">
              تسجيل النية
            </button>
          </form>

          <aside className="space-y-4">
            <EligibilityNotice />
            <div className="card text-sm text-slate-600 dark:text-slate-400">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">خصوصيتك أولًا</h2>
              <p className="mt-2">
                لا نطلب الرقم الوطني أو أي بيانات طبية، ولا تظهر بياناتك لأي شخص آخر،
                وتبقى محفوظة على هذا المتصفح فقط.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  htmlFor,
  children,
}: {
  label: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label" htmlFor={htmlFor}>{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-blood-600">{error}</p>}
    </div>
  );
}
