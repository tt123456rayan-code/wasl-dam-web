"use client";

import { useMemo, useState } from "react";
import { PageHeader, DemoBadge, DemandBadge } from "@/components/ui";
import { demandByGovernorate, demandLastUpdated } from "@/data/demand";
import { BLOOD_TYPES } from "@/lib/types";
import { formatArabicDateTime } from "@/lib/utils";

export default function DemandPage() {
  const [gov, setGov] = useState(demandByGovernorate[0]?.governorate ?? "");

  const record = useMemo(
    () => demandByGovernorate.find((d) => d.governorate === gov),
    [gov]
  );

  return (
    <div>
      <PageHeader
        title="حالة الطلب على الدم"
        subtitle="مؤشر عام لحالة الطلب حسب فصيلة الدم والمحافظة. لا نعرض كميات المخزون، بل حالة الطلب فقط."
      >
        <DemoBadge />
      </PageHeader>

      <div className="container-page py-8">
        <div className="max-w-xs">
          <label className="label" htmlFor="gov">اختر المحافظة</label>
          <select id="gov" className="input" value={gov} onChange={(e) => setGov(e.target.value)}>
            {demandByGovernorate.map((d) => (
              <option key={d.governorate} value={d.governorate}>{d.governorate}</option>
            ))}
          </select>
        </div>

        {record && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BLOOD_TYPES.map((bt) => (
              <div key={bt} className="card flex flex-col items-center gap-2 text-center">
                <span className="text-3xl font-extrabold text-blood-600">{bt}</span>
                <DemandBadge status={record.statuses[bt]} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span>
            آخر تحديث (تجريبي): {formatArabicDateTime(demandLastUpdated)}
          </span>
          <DemoBadge />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Legend status="متوفر" desc="لا يوجد احتياج ملحّ حاليًا." color="bg-emerald-500" />
          <Legend status="بحاجة دعم" desc="يُستحسن التبرع لدعم المخزون." color="bg-amber-500" />
          <Legend status="احتياج عاجل" desc="هناك حاجة مرتفعة لهذه الفصيلة." color="bg-blood-600" />
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
          هذه المؤشرات بيانات تجريبية لأغراض العرض فقط. الحالات الحقيقية تتطلب
          اعتمادًا من المصدر الرسمي (بنك الدم / وزارة الصحة)، ولا تُعرض هنا أي كميات
          مخزون فعلية.
        </div>
      </div>
    </div>
  );
}

function Legend({ status, desc, color }: { status: string; desc: string; color: string }) {
  return (
    <div className="card flex items-start gap-3">
      <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${color}`} />
      <div>
        <p className="text-sm font-semibold">{status}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
      </div>
    </div>
  );
}
