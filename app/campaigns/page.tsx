"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader, DemoBadge, EmptyState, SourceLine } from "@/components/ui";
import { CampaignStatusBadge } from "@/components/CampaignStatusBadge";
import { ReportButton } from "@/components/ReportButton";
import { campaigns } from "@/data/campaigns";
import {
  BLOOD_TYPES,
  CAMPAIGN_STATUS_LABELS,
  GOVERNORATES,
  type BloodType,
  type CampaignStatus,
} from "@/lib/types";
import { formatArabicDate, formatTimeRange, getCampaignStatus } from "@/lib/utils";
import { useNow } from "@/lib/useNow";

export default function CampaignsPage() {
  const [gov, setGov] = useState("");
  const [status, setStatus] = useState<"" | CampaignStatus>("");
  const [type, setType] = useState<"" | BloodType>("");
  const now = useNow();

  const results = useMemo(() => {
    return campaigns.filter((c) => {
      const mg = gov === "" || c.governorate === gov;
      const ms =
        status === "" ||
        (now !== null && getCampaignStatus(c, now) === status);
      const mt = type === "" || c.neededTypes.includes(type);
      return mg && ms && mt;
    });
  }, [gov, status, type, now]);

  return (
    <div>
      <PageHeader
        title="الحملات"
        subtitle="حملات تبرع تجريبية من جهات منظّمة (بيانات تجريبية). تُحسب حالة كل حملة تلقائيًا من تاريخها. اختر حملة لعرض التفاصيل وتسجيل نيتك للتبرع."
      >
        <DemoBadge />
      </PageHeader>

      <div className="container-page py-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="gov">المحافظة</label>
            <select id="gov" className="input" value={gov} onChange={(e) => setGov(e.target.value)}>
              <option value="">كل المحافظات</option>
              {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="status">الحالة</label>
            <select
              id="status"
              className="input"
              value={status}
              onChange={(e) => setStatus(e.target.value as "" | CampaignStatus)}
            >
              <option value="">الكل</option>
              <option value="upcoming">{CAMPAIGN_STATUS_LABELS.upcoming}</option>
              <option value="active">{CAMPAIGN_STATUS_LABELS.active}</option>
              <option value="ended">{CAMPAIGN_STATUS_LABELS.ended}</option>
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
                  <CampaignStatusBadge campaign={c} />
                  <span className="rounded-full bg-blood-50 px-2.5 py-1 text-xs font-medium text-blood-700 dark:bg-blood-500/10 dark:text-blood-300">
                    {c.governorate}
                  </span>
                </div>
                <h2 className="mt-2 text-lg font-bold">{c.title}</h2>
                <dl className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <div>{formatArabicDate(c.startDateTime)} — {formatTimeRange(c.startDateTime, c.endDateTime)}</div>
                  <div>{c.location} ({c.governorate})</div>
                  <div>المنظّم: {c.organizer}</div>
                </dl>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.neededTypes.map((t) => (
                    <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-4">
                  <Link href={`/campaigns/${c.id}`} className="btn-primary w-full">
                    عرض التفاصيل
                  </Link>
                </div>
                <SourceLine source={c.source} lastUpdated={c.lastUpdated} />
                <ReportButton targetType="campaign" targetId={c.id} targetName={c.title} />
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
