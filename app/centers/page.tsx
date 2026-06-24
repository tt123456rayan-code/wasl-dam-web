"use client";

import { useMemo, useState } from "react";
import { PageHeader, DemoBadge, EmptyState, SourceLine } from "@/components/ui";
import { OfficialCentersFinder } from "@/components/OfficialCentersFinder";
import { ReportButton } from "@/components/ReportButton";
import { centers } from "@/data/centers";
import { GOVERNORATES } from "@/lib/types";
import { isCenterOpenNow, mapsSearchUrl } from "@/lib/utils";
import { useNow } from "@/lib/useNow";

export default function CentersPage() {
  const [query, setQuery] = useState("");
  const [gov, setGov] = useState("");
  const [openOnly, setOpenOnly] = useState(false);
  const now = useNow();

  const results = useMemo(() => {
    const q = query.trim();
    const nowDate = now !== null ? new Date(now) : null;
    return centers.filter((c) => {
      const matchQ = q === "" || c.name.includes(q) || c.address.includes(q);
      const matchG = gov === "" || c.governorate === gov;
      const matchOpen =
        !openOnly || (nowDate !== null && isCenterOpenNow(c, nowDate));
      return matchQ && matchG && matchOpen;
    });
  }, [query, gov, openOnly, now]);

  return (
    <div>
      <PageHeader
        title="مراكز التبرع"
        subtitle="استخدم أداة البحث الحيّة في الأعلى للعثور على مراكز التبرع الحقيقية عبر مصادر رسمية، أو تصفّح الأمثلة التجريبية أدناه لمعاينة شكل المنصة."
      >
        <DemoBadge />
      </PageHeader>

      <div className="container-page py-8">
        <OfficialCentersFinder />

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold">أمثلة تجريبية للعرض</h2>
          <DemoBadge />
        </div>
        <p className="mb-4 mt-1 text-sm text-slate-500 dark:text-slate-400">
          المراكز أدناه بيانات تجريبية خيالية لعرض شكل المنصة فقط — وليست مراكز حقيقية.
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="search">ابحث باسم المركز أو العنوان</label>
            <input
              id="search"
              className="input"
              placeholder="مثال: عمّان، مركز تبرع…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="gov">المحافظة</label>
            <select id="gov" className="input" value={gov} onChange={(e) => setGov(e.target.value)}>
              <option value="">كل المحافظات</option>
              {GOVERNORATES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-blood-600 focus:ring-blood-500"
            checked={openOnly}
            onChange={(e) => setOpenOnly(e.target.checked)}
          />
          <span className="text-slate-700 dark:text-slate-300">
            المفتوحة الآن فقط (حسب ساعات العمل التجريبية)
          </span>
        </label>

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          النتائج: {results.length} مركز
        </p>

        {centers.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="لا توجد مراكز" message="لا توجد بيانات تجريبية للمراكز حاليًا." />
          </div>
        ) : results.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="لا توجد نتائج مطابقة"
              message="جرّب تعديل كلمة البحث أو المحافظة أو إلغاء فلتر «المفتوحة الآن»."
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {results.map((c) => {
              const open =
                now !== null ? isCenterOpenNow(c, new Date(now)) : null;
              return (
                <article key={c.id} className="card">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-bold">{c.name}</h2>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {c.governorate}
                    </span>
                  </div>
                  {open !== null && (
                    <span
                      className={
                        open
                          ? "mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                          : "mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-500/20 dark:bg-slate-800 dark:text-slate-300"
                      }
                    >
                      <span className={`h-2 w-2 rounded-full ${open ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {open ? "مفتوح الآن" : "مغلق الآن"}
                    </span>
                  )}
                  <dl className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex gap-2"><dt className="font-medium text-slate-700 dark:text-slate-300">العنوان:</dt><dd>{c.address}</dd></div>
                    <div className="flex gap-2"><dt className="font-medium text-slate-700 dark:text-slate-300">الدوام:</dt><dd>{c.hours}</dd></div>
                  </dl>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.services.map((s) => (
                      <span key={s} className="rounded-full bg-blood-50 px-2.5 py-1 text-xs font-medium text-blood-700 dark:bg-blood-500/10 dark:text-blood-300">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4">
                    <a
                      href={mapsSearchUrl(`${c.name} ${c.governorate} ${c.address}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary w-full"
                    >
                      الاتجاهات عبر خرائط Google
                    </a>
                  </div>
                  <SourceLine source={c.source} lastUpdated={c.lastUpdated} />
                  <ReportButton targetType="center" targetId={c.id} targetName={c.name} />
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
