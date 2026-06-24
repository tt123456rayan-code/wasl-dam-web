"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader, DemoBadge, DemandBadge, EmptyState } from "@/components/ui";
import { campaigns } from "@/data/campaigns";
import { BLOOD_TYPES, GOVERNORATES, type BloodType } from "@/lib/types";
import { formatArabicDate } from "@/lib/utils";

export default function CampaignsPage() {
  const [gov, setGov] = useState("");
  const [status, setStatus] = useState<"" | "active" | "upcoming">("");
  const [type, setType] = useState<"" | BloodType>("");

  const results = useMemo(() => {
    return campaigns.filter((c) => {
      const mg = gov === "" || c.governorate === gov;
      const ms = status === "" || c.status === status;
      const mt = type === "" || c.neededTypes.includes(type);
      return mg && ms && mt;
    });
  }, [gov, status, type]);

  const govs = GOVERNORATES.filter((g) =>
    campaigns.some((c) => c.governorate === g)
  );

  return (
    <div>
      <PageHeader
        title="الحملات"
        subtitle="حملات تبرع تجريبية معتمدة من جهات منظمة. اختر حملة لعرض التفاصيل وتسجيل نيتك للتبرع."
      >
        <DemoBadge />
      </PageHeader>

      <div className="container-page py-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="gov">المحافظة</label>
            <select id="gov" className="input" value={gov} onChange={(e) => setGov(e.target.value)}>
              <option value="">كل المحافظات</option>
              {govs.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="status">الحالة</label>
            <select
              id="status"
              className="input"
              value={status}
              onChange={(e) => setStatus(e.target.value as "" | "active" | "upcoming")}
            >
              <option value="">الكل</option>
              <option value="active">نشطة الآن</option>
              <option value="upcoming">قادمة</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="type">فصيلة مطلوبة</label>
            <select
              id="type"
              className="input"
              value={type}
              onChange={(e) => setType(e.target.value as "" | BloodType)}
            >
              <option value="">كل الفصائل</option>
              {BLOOD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          النتائج: {results.length} حملة
        </p>

        {results.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="لا توجد حملات مطابقة"
              message="جرّب تغيير الفلاتر لعرض حملات أخرى."
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {results.map((c) => (
              <article key={c.id} className="card flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {c.status === "active" ? "نشطة الآن" : "قادمة"}
                  </span>
                  <DemandBadge status={c.demand} />
                </div>
                <h2 className="mt-2 text-lg font-bold">{c.title}</h2>
                <dl className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <div>{formatArabicDate(c.date)} — {c.time}</div>
                  <div>{c.location} ({c.governorate})</div>
                  <div>المنظّم: {c.organizer}</div>
                </dl>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.neededTypes.map((t) => (
                    <span key={t} className="rounded-full bg-blood-50 px-2 py-0.5 text-xs font-bold text-blood-700 dark:bg-blood-500/10 dark:text-blood-300">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-4">
                  <Link href={`/campaigns/${c.id}`} className="btn-primary w-full">
                    عرض التفاصيل
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
