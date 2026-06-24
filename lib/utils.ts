import type { Campaign, CampaignStatus, DemandStatus } from "@/lib/types";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;
}

export function formatArabicDate(iso: string): string {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("ar-JO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  } catch {
    return iso;
  }
}

export function formatArabicTime(iso: string): string {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("ar-JO", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return iso;
  }
}

export function formatArabicDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("ar-JO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return iso;
  }
}

export function formatTimeRange(startIso: string, endIso: string): string {
  return `${formatArabicTime(startIso)} - ${formatArabicTime(endIso)}`;
}

/** يحسب حالة الحملة تلقائيًا من تاريخ البداية والنهاية مقارنةً باللحظة الحالية */
export function getCampaignStatus(
  campaign: Pick<Campaign, "startDateTime" | "endDateTime">,
  nowMs: number
): CampaignStatus {
  const start = new Date(campaign.startDateTime).getTime();
  const end = new Date(campaign.endDateTime).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return "upcoming";
  if (nowMs < start) return "upcoming";
  if (nowMs > end) return "ended";
  return "active";
}

export const demandStyles: Record<
  DemandStatus,
  { badge: string; dot: string }
> = {
  available: {
    badge:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
    dot: "bg-emerald-500",
  },
  needed: {
    badge:
      "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20",
    dot: "bg-amber-500",
  },
  urgent: {
    badge:
      "bg-blood-50 text-blood-700 ring-blood-600/20 dark:bg-blood-500/10 dark:text-blood-300 dark:ring-blood-400/20",
    dot: "bg-blood-600",
  },
};

export const campaignStatusStyles: Record<CampaignStatus, string> = {
  upcoming:
    "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/20",
  active:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
  ended:
    "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-700/40 dark:text-slate-300 dark:ring-slate-500/20",
};
