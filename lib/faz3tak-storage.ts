"use client";

import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import { demoRequests } from "@/data/faz3tak";
import type {
  BloodRequest,
  DonorIntent,
  IncorrectInformationReport,
  ModerationAction,
} from "@/lib/faz3tak";

// كل بيانات فزعتك محلية في المتصفح فقط. تُزرع البيانات التجريبية عند أول تحميل.

export function loadRequests(): BloodRequest[] {
  const stored = readJSON<BloodRequest[] | null>(STORAGE_KEYS.faz3Requests, null);
  if (stored === null) {
    const seed = demoRequests.map((r) => ({ ...r, updates: [...r.updates] }));
    writeJSON(STORAGE_KEYS.faz3Requests, seed);
    return seed;
  }
  return stored;
}

export function saveRequests(list: BloodRequest[]): void {
  writeJSON(STORAGE_KEYS.faz3Requests, list);
}

export function getRequest(id: string): BloodRequest | undefined {
  return loadRequests().find((r) => r.id === id);
}

export function upsertRequest(req: BloodRequest): void {
  const list = loadRequests();
  const idx = list.findIndex((r) => r.id === req.id);
  if (idx >= 0) list[idx] = req;
  else list.push(req);
  saveRequests(list);
}

export function removeRequest(id: string): void {
  saveRequests(loadRequests().filter((r) => r.id !== id));
}

// ===== نيّات التبرع (محلية فقط) =====
export function loadPledges(): DonorIntent[] {
  return readJSON<DonorIntent[]>(STORAGE_KEYS.faz3Pledges, []);
}

export function addPledge(p: DonorIntent): void {
  writeJSON(STORAGE_KEYS.faz3Pledges, [...loadPledges(), p]);
}

export function pledgeCountFor(requestId: string): number {
  return loadPledges().filter((p) => p.requestId === requestId).length;
}

// ===== البلاغات =====
export function loadReports(): IncorrectInformationReport[] {
  return readJSON<IncorrectInformationReport[]>(STORAGE_KEYS.faz3Reports, []);
}

export function addReport(r: IncorrectInformationReport): void {
  writeJSON(STORAGE_KEYS.faz3Reports, [...loadReports(), r]);
}

// ===== إجراءات الإشراف (سجل تدقيق) =====
export function loadModeration(): ModerationAction[] {
  return readJSON<ModerationAction[]>(STORAGE_KEYS.faz3Moderation, []);
}

export function addModeration(a: ModerationAction): void {
  writeJSON(STORAGE_KEYS.faz3Moderation, [...loadModeration(), a]);
}
