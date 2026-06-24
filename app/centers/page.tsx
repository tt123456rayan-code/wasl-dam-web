"use client";

import { useMemo, useState } from "react";
import { PageHeader, DemoBadge, EmptyState } from "@/components/ui";
import { centers } from "@/data/centers";
import { GOVERNORATES } from "@/lib/types";
import { mapsSearchUrl } from "@/lib/utils";

export default function CentersPage() {
  const [query, setQuery] = useState("");
  const [gov, setGov] = useState("");

  const results = useMemo(() => {
    const q = query.trim();
    return centers.filter((c) => {
      const matchQ = q === "" || c.name.includes(q) || c.address.includes(q);
      const matchG = gov === "" || c.governorate === gov;
      return matchQ && matchG;
    });
  }, [query, gov]);

  const govs = GOVERNORATES.filter((g) =>
    centers.some((c) => c.governorate === g)
  );

  return (
    <div>
      <PageHeader
        title="مراكز التبرع"
        subtitle="ابحث عن مراكز التبرع الرسمية حسب الاسم أو المحافظة. جميع المراكز المعروضة بيانات تجريبية لأغراض العرض."
      >
        <DemoBadge />
      </PageHeader>

      <div className="container-page py-8">
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
              {govs.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          النتائج: {results.length} مركز
        </p>

        {centers.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="لا توجد مراكز" message="لم تتم إضافة أي مراكز بعد." />
          </div>
        ) : results.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="لا توجد نتائج مطابقة"
              message="جرّب تعديل كلمة البحث أو اختيار محافظة مختلفة."
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {results.map((c) => (
              <article key={c.id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-bold">{c.name}</h2>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {c.governorate}
                  </span>
                </div>
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
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
