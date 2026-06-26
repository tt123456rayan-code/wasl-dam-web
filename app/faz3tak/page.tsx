"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/ui";
import {
  Faz3DemoBadge,
  Faz3EmergencyNotice,
  Faz3MedicalNotice,
} from "@/components/faz3tak/ui";
import { RequestCard } from "@/components/faz3tak/RequestCard";
import { isSupabaseEnabled, listRequests } from "@/lib/faz3tak-data";
import {
  STATUS_LABELS,
  URGENCY_LABELS,
  deriveStatus,
  type RequestBloodType,
  type RequestStatus,
  type RequestView,
  type UrgencyLevel,
} from "@/lib/faz3tak";
import { BLOOD_TYPES, GOVERNORATES } from "@/lib/types";
import { useNow } from "@/lib/useNow";

export default function Faz3takBoardPage() {
  const [requests, setRequests] = useState<RequestView[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const now = useNow();

  const [gov, setGov] = useState("");
  const [bt, setBt] = useState<"" | RequestBloodType>("");
  const [urgency, setUrgency] = useState<"" | UrgencyLevel>("");
  const [status, setStatus] = useState<"" | RequestStatus>("");

  useEffect(() => {
    let active = true;
    listRequests()
      .then((rows) => {
        if (active) setRequests(rows);
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, []);

  const results = useMemo(() => {
    return requests.filter((r) => {
      const mg = gov === "" || r.governorate === gov;
      const mb = bt === "" || r.bloodType === bt;
      const mu = urgency === "" || r.urgency === urgency;
      const ms = status === "" || (now !== null && deriveStatus(r, now) === status);
      return mg && mb && mu && ms;
    });
  }, [requests, gov, bt, urgency, status, now]);

  return (
    <div>
      <section className="border-b border-slate-200 bg-gradient-to-b from-blood-50/60 to-white dark:border-slate-800 dark:from-blood-900/10 dark:to-slate-950">
        <div className="container-page py-12 sm:py-16">
          <Faz3DemoBadge />
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            فزعتك توصل للحالات المحتاجة عبر المستشفيات
          </h1>
          <p className="mt-2 text-lg font-semibold text-slate-600 dark:text-slate-300">
            طلبات دم للحالات داخل المستشفيات
          </p>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
            اطّلع على الطلب، توجه للمستشفى، وتبرع باسم الحالة أو رقم الطلب. الفحص
            والقبول يتمّان من خلال بنك الدم أو المستشفى، والمنصة لا تصدر قرارًا طبيًا.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/faz3tak/request" className="btn-primary">أنشئ طلب فزعة</Link>
            <Link href="/faz3tak/subscribe" className="btn-secondary">اشترك بالإشعارات</Link>
            <Link href="/faz3tak/manage" className="btn-secondary">إدارة طلبي</Link>
            <Link href="/faz3tak/my-pledges" className="btn-secondary">تبرعاتي المسجّلة</Link>
          </div>
        </div>
      </section>

      <div className="container-page space-y-6 py-8">
        <Faz3EmergencyNotice />

        {!isSupabaseEnabled && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            قاعدة البيانات غير مُعدّة في هذه النسخة (لم تُضبط مفاتيح Supabase)، لذا لا
            تظهر طلبات. بعد ضبط المفاتيح ستظهر الطلبات الحقيقية هنا.
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label" htmlFor="gov">المحافظة</label>
            <select id="gov" className="input" value={gov} onChange={(e) => setGov(e.target.value)}>
              <option value="">كل المحافظات</option>
              {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="bt">الفصيلة</label>
            <select id="bt" className="input" value={bt} onChange={(e) => setBt(e.target.value as "" | RequestBloodType)}>
              <option value="">كل الفصائل</option>
              {BLOOD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              <option value="unknown">حسب توجيه بنك الدم</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="urg">الإلحاح</label>
            <select id="urg" className="input" value={urgency} onChange={(e) => setUrgency(e.target.value as "" | UrgencyLevel)}>
              <option value="">الكل</option>
              {(Object.keys(URGENCY_LABELS) as UrgencyLevel[]).map((u) => (
                <option key={u} value={u}>{URGENCY_LABELS[u]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="st">الحالة</label>
            <select id="st" className="input" value={status} onChange={(e) => setStatus(e.target.value as "" | RequestStatus)}>
              <option value="">الكل</option>
              {(Object.keys(STATUS_LABELS) as RequestStatus[]).map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">النتائج: {results.length} طلب</p>
          <Faz3DemoBadge />
        </div>

        {!loaded ? (
          <p className="text-sm text-slate-500">جارٍ التحميل…</p>
        ) : error ? (
          <EmptyState title="تعذّر تحميل الطلبات" message="حدث خطأ في الاتصال بقاعدة البيانات. حاول لاحقًا." />
        ) : results.length === 0 ? (
          <EmptyState title="لا توجد طلبات مطابقة" message="جرّب تغيير الفلاتر، أو أنشئ طلب فزعة جديدًا." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((r) => (
              <RequestCard key={r.id} req={r} />
            ))}
          </div>
        )}

        <Faz3MedicalNotice />
      </div>
    </div>
  );
}
