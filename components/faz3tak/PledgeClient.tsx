"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  bloodTypeLabel,
  deriveStatus,
  isAcceptingPledges,
  type RequestView,
  type RequestBloodType,
} from "@/lib/faz3tak";
import { Faz3DemoBadge, Faz3EmergencyNotice } from "@/components/faz3tak/ui";
import { getRequestView } from "@/lib/faz3tak-data";
import { addPledge } from "@/lib/faz3tak-storage";
import { BLOOD_TYPES, GOVERNORATES } from "@/lib/types";
import { mapsSearchUrl } from "@/lib/utils";
import { useNow } from "@/lib/useNow";

const TIME_OPTIONS = ["في أقرب وقت", "صباحًا", "ظهرًا", "مساءً", "خلال اليومين القادمين"];

export function PledgeClient({ requestId }: { requestId: string }) {
  const [req, setReq] = useState<RequestView | null>(null);
  const [loaded, setLoaded] = useState(false);
  const now = useNow();

  const [firstName, setFirstName] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [bloodType, setBloodType] = useState<RequestBloodType | "">("");
  const [availableTime, setAvailableTime] = useState(TIME_OPTIONS[0]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;
    getRequestView(requestId)
      .then((r) => active && setReq(r))
      .catch(() => {})
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, [requestId]);

  if (!loaded) {
    return <div className="container-page py-16 text-sm text-slate-500">جارٍ التحميل…</div>;
  }

  if (!req) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="text-2xl font-bold">الطلب غير متوفر</h1>
        <Link href="/faz3tak" className="btn-primary mt-6">العودة إلى لوحة فزعتك</Link>
      </div>
    );
  }

  const status = now !== null ? deriveStatus(req, now) : "needsDonors";
  const accepting = now !== null && isAcceptingPledges(status);

  if (now !== null && !accepting) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="text-2xl font-bold">هذا الطلب لم يعد يستقبل تسجيلات</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          قد يكون الطلب قد اكتمل (تمت الفزعة) أو انتهت مدته أو أُغلق.
        </p>
        <Link href={`/faz3tak/view?ref=${encodeURIComponent(req.id)}`} className="btn-primary mt-6">عرض تفاصيل الطلب</Link>
      </div>
    );
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (firstName.trim().length < 2) e.firstName = "يرجى إدخال الاسم الأول.";
    if (!governorate) e.governorate = "يرجى اختيار المحافظة.";
    if (!bloodType) e.bloodType = "يرجى اختيار الفصيلة أو «لا أعرف».";
    if (!consent) e.consent = "يلزم الموافقة للمتابعة.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!req || !validate()) return;
    addPledge({
      id: `pl-${Date.now()}`,
      requestId: req.id,
      firstName: firstName.trim(),
      governorate,
      bloodType: bloodType as RequestBloodType,
      availableTime,
      createdAt: new Date().toISOString(),
    });
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) {
    return (
      <div className="container-page py-12">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl dark:bg-emerald-500/15">♥</div>
            <h1 className="mt-4 text-2xl font-extrabold">شكرًا لفزعتك</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">تم حفظ نيتك محليًا على هذا المتصفح فقط.</p>
          </div>
          <div className="card mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-2"><span className="text-slate-500 dark:text-slate-400">رقم الطلب</span><span className="font-mono font-bold">{req.id}</span></div>
            <div className="flex justify-between gap-2"><span className="text-slate-500 dark:text-slate-400">المستشفى</span><span className="font-semibold">{req.hospital} — {req.governorate}</span></div>
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 leading-relaxed text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
              توجه إلى المستشفى أو بنك الدم واذكر اسم الحالة أو رقم الطلب. لا يتم احتساب
              التبرع داخل المنصة تلقائيًا؛ يقوم صاحب الطلب بتحديث حالته بعد التأكد.
            </p>
            <div className="flex flex-wrap gap-2">
              <a href={mapsSearchUrl(`${req.hospital} ${req.governorate}`)} target="_blank" rel="noopener noreferrer" className="btn-primary">الاتجاهات للمستشفى</a>
              <Link href="/faz3tak/my-pledges" className="btn-secondary">تبرعاتي المسجّلة</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <Link href={`/faz3tak/view?ref=${encodeURIComponent(req.id)}`} className="text-sm font-semibold text-blood-600 hover:text-blood-700">
        → العودة لتفاصيل الطلب
      </Link>
      <div className="mt-4 max-w-xl">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-extrabold">سأتوجه للتبرع</h1>
          <Faz3DemoBadge />
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          طلب <span className="font-mono font-semibold">{req.id}</span> — {req.hospital} ({req.governorate}) — الفصيلة: {bloodTypeLabel(req.bloodType)}
        </p>

        <form onSubmit={submit} noValidate className="mt-6 space-y-5">
          <Field label="الاسم الأول" error={errors.firstName} htmlFor="fn">
            <input id="fn" className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </Field>
          <Field label="المحافظة" error={errors.governorate} htmlFor="gov">
            <select id="gov" className="input" value={governorate} onChange={(e) => setGovernorate(e.target.value)}>
              <option value="">اختر المحافظة</option>
              {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="فصيلتك" error={errors.bloodType} htmlFor="bt">
            <select id="bt" className="input" value={bloodType} onChange={(e) => setBloodType(e.target.value as RequestBloodType)}>
              <option value="">اختر الفصيلة</option>
              {BLOOD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              <option value="unknown">لا أعرف</option>
            </select>
          </Field>
          <Field label="الوقت المتاح" htmlFor="time">
            <select id="time" className="input" value={availableTime} onChange={(e) => setAvailableTime(e.target.value)}>
              {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <div>
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-blood-600 focus:ring-blood-500"
                checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span className="text-slate-600 dark:text-slate-400">
                أفهم أن هذا تسجيل نية محلي فقط، وأن الفحص والقبول يتمّان من خلال بنك
                الدم أو المستشفى، وأن المنصة لا تتحقق طبيًا من التبرع.
              </span>
            </label>
            {errors.consent && <p className="mt-1 text-sm text-blood-600">{errors.consent}</p>}
          </div>
          <button type="submit" className="btn-primary w-full sm:w-auto">تأكيد النية</button>
        </form>

        <div className="mt-6">
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
