"use client";

// مساعدات تخزين محلية للنموذج التجريبي — تبقى داخل متصفح المستخدم فقط
export const STORAGE_KEYS = {
  campaignInterests: "wasl-dam:campaign-interests",
  donorReadiness: "wasl-dam:donor-readiness",
  reports: "wasl-dam:reports",
  adminCampaigns: "wasl-dam:admin-campaigns",
  adminCenters: "wasl-dam:admin-centers",
  adminDemand: "wasl-dam:admin-demand",
} as const;

// كل مفاتيح التخزين المحلية للنموذج التجريبي (تُستخدم في حذف البيانات المحلية)
export const ALL_STORAGE_KEYS: string[] = [
  "wasl-dam:campaign-interests",
  "wasl-dam:donor-readiness",
  "wasl-dam:reports",
  "wasl-dam:admin-campaigns",
  "wasl-dam:admin-centers",
  "wasl-dam:admin-demand",
  "wasl-dam:theme",
];

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // تجاهل أخطاء التخزين في النموذج التجريبي
  }
}

export function removeKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // تجاهل
  }
}
