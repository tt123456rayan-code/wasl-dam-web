"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader, EmptyState } from "@/components/ui";
import { Faz3DemoBadge, StatusBadge } from "@/components/faz3tak/ui";
import { loadPledges, loadRequests } from "@/lib/faz3tak-storage";
import {
  deriveStatus,
  formatCountdown,
  remainingUnits,
  type BloodRequest,
  type DonorIntent,
} from "@/lib/faz3tak";
import { mapsSearchUrl } from "@/lib/utils";
import { useNow } from "@/lib/useNow";

export default function MyPledgesPage() {
  const [pledges, setPledges] = useState<DonorIntent[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loaded, setLoaded] = useState(false);
  const now = useNow();

  useEffect(() => {
    setPledges(loadPledges());
    setRequests(loadRequests());
    setLoaded(true);
  }, []);

  return (
    <div>
      <PageHeader
        title="تبرعاتي المسجّلة"
        subtitle="نيّات التبرع التي سجّلتها محفوظة محليًا على هذا المتصفح فقط."
      >
        <Faz3DemoBadge />
      </PageHeader>

      <div className="container-page py-8">
        {!loaded ? (
          <p className="text-sm text-slate-500">جارٍ التحميل…</p>
        ) : pledges.length === 0 ? (
          <EmptyState
            title="لا توجد تبرعات مسجّلة"
            message="عند تسجيل نية التبرع لأي طلب ستظهر هنا."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pledges
              .slice()
              .reverse()
              .map((p) => {
                const req = requests.find((r) => r.id === p.requestId);
                const status = req && now !== null ? deriveStatus(req, now) : null;
                return (
                  <article key={p.id} className="card">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {p.requestId}
                      </span>
                      {status && <StatusBadge status={status} />}
                    </div>
                    {req ? (
                      <>
                        <h2 className="mt-2 text-base font-bold">{req.hospital}</h2>
                        <dl className="mt-1 space-y-0.5 text-sm text-slate-600 dark:text-slate-400">
                          <div>{req.governorate}</div>
                          <div>المتبقي حسب تحديث صاحب الطلب: <span className="font-semibold">{remainingUnits(req)}</span> وحدة</div>
                          <div>
                            الحالة الزمنية:{" "}
                            {now !== null ? formatCountdown(now, req.expiry) : "…"}
                          </div>
                        </dl>
                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                          <Link href={`/faz3tak/${req.id}`} className="btn-secondary flex-1">تفاصيل الطلب</Link>
                          <a href={mapsSearchUrl(`${req.hospital} ${req.governorate}`)} target="_blank" rel="noopener noreferrer" className="btn-secondary flex-1">
                            الاتجاهات
                          </a>
                        </div>
                      </>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        لم يعد هذا الطلب متوفرًا على هذا المتصفح.
                      </p>
                    )}
                  </article>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
