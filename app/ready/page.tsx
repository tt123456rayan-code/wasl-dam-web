"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader, DemoBadge, EligibilityNotice } from "@/components/ui";
import { BLOOD_TYPES, GOVERNORATES } from "@/lib/types";
import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";

interface FormState {
  fullName: string;
  mobile: string;
  governorate: string;
  bloodType: string;
  lastDonation: string;
  notify: string;
  consent: boolean;
}

const initial: FormState = {
  fullName: "",
  mobile: "",
  governorate: "",
  bloodType: "",
  lastDonation: "",
  notify: "none",
  consent: false,
};

export default function ReadyPage() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (form.fullName.trim().length < 3) e.fullName = "يرجى إدخال الاسم الكامل (3 أحرف على الأقل).";
    if (!/^0?\d{8,10}$/.test(form.mobile.trim())) e.mobile = "يرجى إدخال رقم هاتف صحيح.";
    if (!form.governorate) e.governorate = "يرجى اختيار المحافظة.";
    if (!form.bloodType) e.bloodType = "يرجى اختيار فصيلة الدم أو «لا أعرف».";
    if (!form.consent) e.consent = "يلزم الموافقة للمتابعة.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    const list = readJSON<FormState[]>(STORAGE_KEYS.donorReadiness, []);
    writeJSON(STORAGE_KEYS.donorReadiness, [...list, form]);
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
            تم حفظ نيتك للتبرع محليًا على هذا المتصفح فقط. هذا ليس موعدًا ولا موافقة
            طبية ولا تسجيلًا رسميًا — القرار النهائي للتبرع يعود لكادر بنك الدم الرسمي
            عند مراجعتك للمركز.
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
        subtitle="نموذج بسيط لتسجيل رغبتك بالتبرع. تُحفظ البيانات محليًا على متصفحك فقط ولا تُرسل لأي جهة."
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

            <Field label="رقم الهاتف المحمول" error={errors.mobile} htmlFor="mobile">
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

            <Field label="تفضيل التذكير المستقبلي (اختياري)" htmlFor="notify">
              <select
                id="notify"
                className="input"
                value={form.notify}
                onChange={(e) => setForm({ ...form, notify: e.target.value })}
              >
                <option value="none">لا أرغب بالتذكير</option>
                <option value="future">أرغب بتلقّي تذكير مستقبلًا (ميزة غير مفعّلة بعد)</option>
              </select>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                ملاحظة: النموذج التجريبي لا يرسل أي رسائل نصية أو بريد إلكتروني. هذا
                التفضيل يُحفظ محليًا فقط لقياس الاهتمام بميزة مستقبلية.
              </p>
            </Field>

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
