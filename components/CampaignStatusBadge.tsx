"use client";

import { CAMPAIGN_STATUS_LABELS, type Campaign } from "@/lib/types";
import { campaignStatusStyles, cn, getCampaignStatus } from "@/lib/utils";
import { useNow } from "@/lib/useNow";

export function CampaignStatusBadge({
  campaign,
}: {
  campaign: Pick<Campaign, "startDateTime" | "endDateTime">;
}) {
  const now = useNow();

  // قبل التحميل على العميل نعرض عنصرًا محايدًا بنفس الحجم لتفادي اختلاف الترطيب
  if (now === null) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-400 ring-1 ring-inset ring-slate-500/10 dark:bg-slate-800 dark:text-slate-500">
        …
      </span>
    );
  }

  const status = getCampaignStatus(campaign, now);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        campaignStatusStyles[status]
      )}
    >
      {CAMPAIGN_STATUS_LABELS[status]}
    </span>
  );
}
