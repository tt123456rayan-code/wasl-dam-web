"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/ui";
import {
  Faz3DemoBadge,
  Faz3EmergencyNotice,
  Faz3MedicalNotice,
} from "@/components/faz3tak/ui";
import {
  PRIVACY_LABELS,
  URGENCY_LABELS,
  type RequestBloodType,
  type RequesterPrivacyMode,
  type UrgencyLevel,
} from "@/lib/faz3tak";
import {
  createRequest,
  DbNotConfiguredError,
  isSupabaseEnabled,
} from "@/lib/faz3tak-data";
import { centers } from "@/data/centers";
import { BLOOD_TYPES, GOVERNORATES } from "@/lib/types";

interface FormState {
  requesterFullName: string;
  privacyMode: RequesterPrivacyMode;
  requesterMobile: string;
  hospital: string;
  governorate: string;
  bloodType: RequestBloodType | "";
  unitsRequired: string;
  urgency: UrgencyLevel;
  expiry: string;
  publicMessage: string;
  consent: boolean;
}

const initial: FormState = {
  requesterFullName: "",
  privacyMode: "partialName",
  requesterMobile: "",
  hospital: "",
  governorate: "",
  bloodType: "",
  unitsRequired: "",
  urgency: "important",
  expiry: "",
  publicMessage: "",
  consent: false,
};

export default function CreateRequestPage() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [created, setCreated] = useState<{ id: string; token: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const hospitalNames = Array.from(new Set(centers.map((c) => c.name)));

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (form.requesterFullName.trim().length < 3) e.requesterFullName = "يرجى إدخال الاسم الكامل.";
    if (form.requesterMobile && !/^0?\d{8,10}$/.test(form.requesterMobile.trim()))
      e.requesterMobile = "رقم الهاتف غير صحيح.";
    if (form.hospital.trim().length < 2) e.hospital = "يرجى إدخال اسم المستشفى.";
    if (!form.governorate) e.governorate = "يرجى اختيار المحافظة.";
    if (!form.bloodType) e.bloodType = "يرجى اختيار الفصيلة أو «حسب توجيه بنك الدم».";
    const units = Number(form.unitsRequired);
    if (!Number.isInteger(units) || units < 1 || units > 50) e.unitsRequired = "أدخل عدد وحدات صحيح (1 إلى 50).";
    if (!form.expiry) e.expiry = "يرجى تحديد تاريخ ووقت الانتهاء.";
    else if (new Date(form.expiry).getTime() <= Date.now()) e.expiry = "يجب أن يكون تاريخ الانتهاء في المستقبل.";
    if (form.publicMessage.trim().length < 5) e.publicMessage = "اكتب رسالة عامة قصيرة.";
    if (!form.consent) e.consent = "يلزم الموافقة للمتابعة.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setBusy(true);
    try {
      const res = await createRequest({
        fullName: form.requesterFullName.trim(),
        privacy: form.privacyMode,
        mobile: form.requesterMobile.trim(),
        hospital: form.hospital.trim(),
        governorate: form.governorate,
        bloodType: form.bloodType as RequestBloodType,
        units: Number(form.unitsRequired),
        urgency: form.urgency,
        expiry: new Date(form.expiry).toISOString(),
        message: form.publicMessage.trim(),
      });
      setCreated(res);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(
        err instanceof DbNotConfiguredError
          ? "قاعدة البيانات غير مُعدّة في هذه النسخة، فلا يمكن إنشاء طلب حقيقي حاليًا."
          : "تعذّر إنشاء الطلب. تأكد من البيانات وحاول لاحقًا."
      );
    } finally {
      setBusy(false);
    }
  }

  if (created) {
    return (
      <div className="container-page py-12">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl dark:bg-emerald-500/15">✓</div>
            <h1 className="mt-4 text-2xl font-extrabold">تم إنشاء طلب الفزعة</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              احفظ رقم الطلب ورمز الإدارة الخاص — ستحتاجهما لتحديث حالة الطلب لاحقًا.
            </p>
          </div>
          <div className="card mt-5 space-y-3">
            <Row label="رقم الطلب (مرجع عام)" value={created.id} />
            <Row label="رمز الإدارة الخاص (لا تشاركه)" value={created.token} />
            <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              أنت مسؤول عن تحديث حالة الطلب وعدد التبرعات بعد تأكيدها مع المستشفى.
              المنصة لا تتحقق طبيًا من التبرعات.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/faz3tak/manage" className="btn-primary">إدارة الطلب</Link>
              <Link href={`/faz3tak/view?ref=${encodeURIComponent(created.id)}`} className="btn-secondary">عرض الطلب العام</Link>
              <Link href="/faz3tak" className="btn-secondary">لوحة فزعتك</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="إنشاء طلب فزعة"
        subtitle="أنشئ طلبًا عامًا لحالة بحاجة لتبرع بالدم داخل مستشفى. لا تُطلب أي بيانات طبية أو رقم وطني."
      >
        <Faz3DemoBadge />
      </PageHeader>

      <div className="container-page py-8">
        {!isSupabaseEnabled && (
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            قاعدة البيانات غير مُعدّة في هذه النسخة؛ إنشاء الطلبات يتطلب ضبط مفاتيح Supabase.
          </div>
        )}
        <div className="grid gap-8 lg:grid-cols-3">
          <form onSubmit={submit} noValidate className="space-y-5 lg:col-span-2">
            <Field label="اسم صاحب الطلب الكامل" error={errors.requesterFullName} htmlFor="name">
              <input id="name" className="input" value={form.requesterFullName}
                onChange={(e) => setForm({ ...form, requesterFullName: e.target.value })} />
            </Field>

            <Field label="طريقة عرض الاسم للعامة" htmlFor="privacy">
              <select id="privacy" className="input" value={form.privacyMode}
                onChange={(e) => setForm({ ...form, privacyMode: e.target.value as RequesterPrivacyMode })}>
                {(Object.keys(PRIVACY_LABELS) as RequesterPrivacyMode[]).map((p) => (
                  <option key={p} value={p}>{PRIVACY_LABELS[p]}</option>
                ))}
              </select>
            </Field>

            <Field label="رقم الهاتف (لاستخدامك الخاص فقط — لا يُعرض علنًا)" error={errors.requesterMobile} htmlFor="mobile">
              <input id="mobile" inputMode="numeric" className="input" placeholder="07XXXXXXXX"
                value={form.requesterMobile}
                onChange={(e) => setForm({ ...form, requesterMobile: e.target.value })} />
            </Field>

            <Field label="اسم المستشفى" error={errors.hospital} htmlFor="hospital">
              <input id="hospital" list="hospitals" className="input" value={form.hospital}
                onChange={(e) => setForm({ ...form, hospital: e.target.value })} />
              <datalist id="hospitals">
                {hospitalNames.map((h) => <option key={h} value={h} />)}
              </datalist>
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="المحافظة" error={errors.governorate} htmlFor="gov">
                <select id="gov" className="input" value={form.governorate}
                  onChange={(e) => setForm({ ...form, governorate: e.target.value })}>
                  <option value="">اختر المحافظة</option>
                  {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="الفصيلة المطلوبة" error={errors.bloodType} htmlFor="bt">
                <select id="bt" className="input" value={form.bloodType}
                  onChange={(e) => setForm({ ...form, bloodType: e.target.value as RequestBloodType })}>
                  <option value="">اختر الفصيلة</option>
                  {BLOOD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  <option value="unknown">حسب توجيه بنك الدم</option>
                </select>
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="عدد الوحدات المطلوبة" error={errors.unitsRequired} htmlFor="units">
                <input id="units" type="number" min={1} max={50} className="input"
                  value={form.unitsRequired}
                  onChange={(e) => setForm({ ...form, unitsRequired: e.target.value })} />
              </Field>
              <Field label="مستوى الإلحاح" htmlFor="urg">
                <select id="urg" className="input" value={form.urgency}
                  onChange={(e) => setForm({ ...form, urgency: e.target.value as UrgencyLevel })}>
                  {(Object.keys(URGENCY_LABELS) as UrgencyLevel[]).map((u) => (
                    <option key={u} value={u}>{URGENCY_LABELS[u]}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="تاريخ ووقت انتهاء الطلب" error={errors.expiry} htmlFor="expiry">
              <input id="expiry" type="datetime-local" className="input" value={form.expiry}
                onChange={(e) => setForm({ ...form, expiry: e.target.value })} />
            </Field>

            <Field label="رسالة عامة قصيرة عن الطلب" error={errors.publicMessage} htmlFor="msg">
              <textarea id="msg" className="input min-h-24" value={form.publicMessage}
                onChange={(e) => setForm({ ...form, publicMessage: e.target.value })}
                placeholder="مثال: نحتاج دعمكم لتغطية احتياج الحالة." />
            </Field>

            <div>
              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-blood-600 focus:ring-blood-500"
                  checked={form.consent}
                  onChange={(e) => setForm({ ...form, consent: e.target.checked })} />
                <span className="text-slate-600 dark:text-slate-400">
                  أوافق على نشر هذه المعلومات علنًا حسب خيار الخصوصية، وأفهم أنني مسؤول
                  عن تحديث حالة الطلب وعدد التبرعات بعد تأكيدها مع المستشفى، وأن المنصة
                  لا تتحقق طبيًا من التبرعات.
                </span>
              </label>
              {errors.consent && <p className="mt-1 text-sm text-blood-600">{errors.consent}</p>}
            </div>

            {submitError && <p className="text-sm text-blood-600">{submitError}</p>}

            <button type="submit" disabled={busy} className="btn-primary w-full sm:w-auto">
              {busy ? "جارٍ الإنشاء…" : "إنشاء الطلب"}
            </button>
          </form>

          <aside className="space-y-4">
            <div className="card text-sm text-slate-600 dark:text-slate-400">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">لا نطلب بيانات حسّاسة</h2>
              <p className="mt-2">
                لا نطلب الرقم الوطني أو التشخيص أو التقارير الطبية أو رقم الغرفة أو رقم
                الملف. لا تُنشر أسماء المتبرعين ولا أرقامهم.
              </p>
            </div>
            <Faz3MedicalNotice />
            <Faz3EmergencyNotice />
          </aside>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-mono text-base font-bold">{value}</span>
    </div>
  );
}
