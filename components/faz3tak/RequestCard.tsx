"use client";

import Link from "next/link";
import {
  bloodTypeLabel,
  deriveStatus,
  formatCountdown,
  isAcceptingPledges,
  type RequestView,
} from "@/lib/faz3tak";
import { StatusBadge, UrgencyBadge, ProgressBlock } from "@/components/faz3tak/ui";
import { mapsSearchUrl } from "@/lib/utils";
import { useNow } from "@/lib/useNow";

export function RequestCard({ req }: { req: RequestView }) {
  const now = useNow();
  const status = now !== null ? deriveStatus(req, now) : "needsDonors";
  const accepting = now !== null && isAcceptingPledges(status);

  return (
    <article className="card flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {req.id}
        </span>
        <div className="flex items-center gap-2">
          <UrgencyBadge level={req.urgency} />
          {now !== null && <StatusBadge status={status} />}
        </div>
      </div>

      <h3 className="mt-3 text-lg font-bold">{req.displayName}</h3>
      <dl className="mt-1 space-y-0.5 text-sm text-slate-600 dark:text-slate-400">
        <div>{req.hospital} — {req.governorate}</div>
        <div>الفصيلة المطلوبة: <span className="font-semibold text-blood-700 dark:text-blood-300">{bloodTypeLabel(req.bloodType)}</span></div>
      </dl>

      <div className="mt-4">
        <ProgressBlock required={req.unitsRequired} completed={req.unitsCompleted} />
      </div>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        تنتهي خلال: {now !== null ? formatCountdown(now, req.expiry) : "…"}
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link href={`/faz3tak/view?ref=${encodeURIComponent(req.id)}`} className="btn-secondary flex-1">
          تفاصيل الطلب
        </Link>
        <a
          href={mapsSearchUrl(`${req.hospital} ${req.governorate}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex-1"
        >
          الاتجاهات
        </a>
      </div>

      <div className="mt-2">
        {accepting ? (
          <Link href={`/faz3tak/pledge?ref=${encodeURIComponent(req.id)}`} className="btn-primary w-full">
            سأتوجه للتبرع
          </Link>
        ) : (
          <button className="btn-primary w-full" disabled>
            {now === null ? "…" : "الطلب لا يستقبل تسجيلات حاليًا"}
          </button>
        )}
      </div>
    </article>
  );
}
