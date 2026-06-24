"use client";

import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import type { DonorIntent } from "@/lib/faz3tak";

// نيّات التبرع تبقى محلية في المتصفح فقط (حسب التصميم) ولا تؤثر على العدد المكتمل.
export function loadPledges(): DonorIntent[] {
  return readJSON<DonorIntent[]>(STORAGE_KEYS.faz3Pledges, []);
}

export function addPledge(p: DonorIntent): void {
  writeJSON(STORAGE_KEYS.faz3Pledges, [...loadPledges(), p]);
}

export function pledgeCountFor(requestId: string): number {
  return loadPledges().filter((p) => p.requestId === requestId).length;
}
