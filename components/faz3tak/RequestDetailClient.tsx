"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  bloodTypeLabel,
  deriveStatus,
  formatCountdown,
  isAcceptingPledges,
  remainingUnits,
  type RequestView,
} from "@/lib/faz3tak";
import {
  Faz3DemoBadge,
  Faz3EmergencyNotice,
  Faz3MedicalNotice,
  ProgressBlock,
  StatusBadge,
  UrgencyBadge,
} from "@/components/faz3tak/ui";
import { ReportRequest } from "@/components/faz3tak/ReportRequest";
import { getRequestView, getUpdates, type UpdateRow } from "@/lib/faz3tak-data";
import { formatArabicDateTime, mapsSearchUrl } from "@/lib/utils";
import { useNow } from "@/lib/useNow";

export function RequestDetailClient({ requestId }: { requestId: string }) {
  const [req, setReq] = useState<RequestView | null>(null);
  const [updates, setUpdates] = useState<UpdateRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const now = useNow();

  useEffect(() => {
    let active = true;
    Promise.all([getRequestView(requestId), getUpdates(requestId)])
      .then(([r, u]) => {
        if (!active) return;
        setReq(r);
        setUpdates(u);
      })
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
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          قد يكون الطلب غير موجود أو تمّت إزالته.
        </p>
        <Link href="/faz3tak" className="btn-primary mt-6">العودة إلى لوحة فزعتك</Link>
      </div>
    );
  }

  const status = now !== null ? deriveStatus(req, now) : "needsDonors";
  const accepting = now !== null && isAcceptingPledges(status);
  const remaining = remainingUnits(req);

  return (
    <div className="container-page py-10">
      <Link href="/faz3tak" className="text-sm font-semibold text-blood-600 hover:text-blood-700">
        → العودة إلى لوحة فزعتك
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {req.id}
              </span>
              <UrgencyBadge level={req.urgency} />
              {now !== null && <StatusBadge status={status} />}
              <Faz3DemoBadge />
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{req.displayName}</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">{req.publicMessage}</p>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <Detail label="المستشفى" value={req.hospital} />
            <Detail label="المحافظة" value={req.governorate} />
            <Detail label="الفصيلة المطلوبة" value={bloodTypeLabel(req.bloodType)} />
            <Detail label="عدد الوحدات المطلوبة" value={`${req.unitsRequired} وحدة`} />
            <Detail label="تم التبرع للحالة حسب تحديث صاحب الطلب" value={`${req.unitsCompleted} وحدة`} />
            <Detail label="المتبقي حسب تحديث صاحب الطلب" value={`${remaining} وحدة`} />
            <Detail label="تنتهي خلال" value={now !== null ? formatCountdown(now, req.expiry) : "…"} />
            <Detail label="تاريخ الانتهاء" value={formatArabicDateTime(req.expiry)} />
          </dl>

          <div className="card">
            <h2 className="text-base font-bold">التقدّم</h2>
            <div className="mt-3">
              <ProgressBlock required={req.unitsRequired} completed={req.unitsCompleted} />
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              المنصة لا تصدر قرارًا طبيًا ولا تتحقق من قبول التبرع؛ يتم الفحص والقبول من
              خلال بنك الدم أو المستشفى.
            </p>
          </div>

          <div className="card">
            <h2 className="text-base font-bold">سجل التحديثات</h2>
            {updates.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">لا توجد تحديثات بعد.</p>
            ) : (
              <ol className="mt-4 space-y-4">
                {updates.map((u, i) => (
                  <li key={`${u.at}-${i}`} className="flex gap-3">
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blood-600" />
                    <div>
                      <p className="text-sm font-medium">{u.message}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{formatArabicDateTime(u.at)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card">
            <h2 className="text-base font-bold">شارك في الفزعة</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              توجّه للمستشفى وتبرّع باسم الحالة أو رقم الطلب.
            </p>
            <div className="mt-4 space-y-2">
              {accepting ? (
                <Link href={`/faz3tak/pledge?ref=${encodeURIComponent(req.id)}`} className="btn-primary w-full">
                  سأتوجه للتبرع
                </Link>
              ) : (
                <button className="btn-primary w-full" disabled>
                  {now === null ? "…" : "الطلب لا يستقبل تسجيلات حاليًا"}
                </button>
              )}
              <a
                href={mapsSearchUrl(`${req.hospital} ${req.governorate}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full"
              >
                الاتجاهات عبر خرائط Google
              </a>
            </div>
          </div>

          <Faz3MedicalNotice />
          <Faz3EmergencyNotice />

          <div className="card">
            <ReportRequest requestId={req.id} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold">{value}</dd>
    </div>
  );
}
