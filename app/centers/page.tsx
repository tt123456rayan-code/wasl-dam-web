"use client";

import { useMemo, useState } from "react";
import { PageHeader, EmptyState } from "@/components/ui";
import { OfficialCentersFinder } from "@/components/OfficialCentersFinder";
import { ReportButton } from "@/components/ReportButton";
import { centers } from "@/data/centers";
import { GOVERNORATES } from "@/lib/types";
import { mapsSearchUrl } from "@/lib/utils";

export default function CentersPage() {
  const [query, setQuery] = useState("");
  const [gov, setGov] = useState("");

  const results = useMemo(() => {
    const q = query.trim();
    return centers.filter((c) => {
      const matchQ =
        q === "" || c.name.includes(q) || c.kind.includes(q) || c.note.includes(q);
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
        subtitle="مرافق صحية حكومية معروفة في الأردن قد تتوفر فيها خدمة التبرع بالدم، مع بحث مباشر على الخريطة للوصول الدقيق."
      />

      <div className="container-page py-8">
        <OfficialCentersFinder />

        <div className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          القائمة أدناه لمرافق صحية حكومية معروفة وليست قائمة رسمية صادرة عن وزارة
          الصحة. هذا النموذج غير رسمي وغير تابع لها. يرجى التأكد من توفّر خدمة التبرع
          والعنوان وساعات العمل من المرفق مباشرةً قبل التوجّه. في الطوارئ اتصل
          بالمستشفى أو بنك الدم مباشرةً.
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="search">ابحث باسم المرفق أو نوعه</label>
            <input
              id="search"
              className="input"
              placeholder="مثال: بنك الدم، مستشفى…"
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
          النتائج: {results.length} مرفق
        </p>

        {results.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="لا توجد نتائج مطابقة"
              message="جرّب تعديل كلمة البحث أو اختيار محافظة مختلفة، أو استخدم البحث المباشر على الخريطة في الأعلى."
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {results.map((c) => (
              <article key={c.id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-bold">{c.name}</h2>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {c.governorate}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-blood-700 dark:text-blood-300">{c.kind}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{c.note}</p>
                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                  تأكّد من توفّر خدمة التبرع والعنوان وساعات العمل عبر الخريطة أو
                  بالاتصال بالمرفق.
                </p>
                <div className="mt-4">
                  <a
                    href={mapsSearchUrl(c.mapsQuery)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full"
                  >
                    الموقع والاتجاهات عبر خرائط Google
                  </a>
                </div>
                <ReportButton targetType="center" targetId={c.id} targetName={c.name} />
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
