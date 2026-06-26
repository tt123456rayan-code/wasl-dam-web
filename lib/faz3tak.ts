import type { BloodType } from "@/lib/types";

// مستوى الإلحاح
export type UrgencyLevel = "normal" | "important" | "urgent";

export const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  normal: "عادي",
  important: "مهم",
  urgent: "عاجل",
};

// حالة الطلب — بعضها يُحسب تلقائيًا
export type RequestStatus =
  | "needsDonors" // بحاجة لمتبرعين
  | "almostComplete" // اقترب الاكتمال
  | "completed" // تمت الفزعة
  | "closed" // مغلق
  | "expired"; // منتهي

export const STATUS_LABELS: Record<RequestStatus, string> = {
  needsDonors: "بحاجة لمتبرعين",
  almostComplete: "اقترب الاكتمال",
  completed: "تمت الفزعة",
  closed: "مغلق",
  expired: "منتهي",
};

// وضع الخصوصية لاسم صاحب الطلب
export type RequesterPrivacyMode = "fullName" | "partialName" | "referenceOnly";

export const PRIVACY_LABELS: Record<RequesterPrivacyMode, string> = {
  fullName: "الاسم الكامل",
  partialName: "الاسم الأول + الحرف الأول من العائلة",
  referenceOnly: "رقم الطلب فقط",
};

// نوع البلد للفصيلة المطلوبة
export type RequestBloodType = BloodType | "unknown";

export type RequestUpdateType =
  | "created"
  | "countUpdated"
  | "remainingEdited"
  | "urgencyChanged"
  | "expiryExtended"
  | "noteAdded"
  | "statusChanged";

// سجل نشاط مرئي لكل تحديث من صاحب الطلب
export interface RequestUpdate {
  id: string;
  at: string; // ISO timestamp
  type: RequestUpdateType;
  message: string;
}

// التحكم النهائي اليدوي من صاحب الطلب
export type ManualTerminalStatus = "closed" | "notNeeded";

export interface BloodRequest {
  id: string; // المرجع، مثل FZ-2026-1048
  createdAt: string;
  requesterFullName: string; // مخزّن، لا يُعرض دائمًا حسب الخصوصية
  privacyMode: RequesterPrivacyMode;
  requesterMobile?: string; // لاستخدام الحساب الخاص فقط — لا يُعرض علنًا أبدًا
  hospital: string;
  governorate: string;
  bloodType: RequestBloodType;
  unitsRequired: number;
  unitsCompleted: number; // يحدّثه صاحب الطلب فقط
  urgency: UrgencyLevel;
  expiry: string; // ISO
  publicMessage: string;
  manualStatus?: ManualTerminalStatus; // مغلق / لم يعد مطلوبًا
  updates: RequestUpdate[];
  token: string; // رمز إدارة خاص
  isDemo: boolean;
  hidden?: boolean; // إخفاء إشرافي
}

// نية تبرّع (محلية فقط، لا تؤثر على العدد المكتمل إطلاقًا)
export interface DonorIntent {
  id: string;
  requestId: string;
  firstName: string;
  governorate: string;
  bloodType: RequestBloodType;
  availableTime: string;
  createdAt: string;
}

// بلاغ عن معلومة غير صحيحة
export interface IncorrectInformationReport {
  id: string;
  requestId: string;
  reason: string;
  createdAt: string;
}

// إجراء إشرافي
export type ModerationActionType = "hide" | "unhide" | "remove";

export interface ModerationAction {
  id: string;
  requestId: string;
  action: ModerationActionType;
  reason: string;
  at: string;
}

// سجل تدقيق عام (إشرافي)
export interface AuditLogEntry {
  id: string;
  at: string;
  actor: "requester" | "moderator";
  requestId: string;
  description: string;
}

// نموذج موحّد للعرض العام (من Supabase view أو محليًا)
export interface RequestView {
  id: string;
  createdAt: string;
  displayName: string;
  privacyMode: RequesterPrivacyMode;
  hospital: string;
  governorate: string;
  bloodType: RequestBloodType;
  unitsRequired: number;
  unitsCompleted: number;
  urgency: UrgencyLevel;
  expiry: string;
  publicMessage: string;
  manualStatus: ManualTerminalStatus | null;
  isDemo: boolean;
}

// ===== أدوات مساعدة =====

export function bloodTypeLabel(bt: RequestBloodType): string {
  return bt === "unknown" ? "حسب توجيه بنك الدم" : bt;
}

export function remainingUnits(req: Pick<BloodRequest, "unitsRequired" | "unitsCompleted">): number {
  return Math.max(0, req.unitsRequired - req.unitsCompleted);
}

export function clampCompleted(completed: number, required: number): number {
  if (Number.isNaN(completed)) return 0;
  return Math.min(Math.max(0, Math.floor(completed)), required);
}

export function progressPercent(req: Pick<BloodRequest, "unitsRequired" | "unitsCompleted">): number {
  if (req.unitsRequired <= 0) return 0;
  return Math.min(100, Math.round((req.unitsCompleted / req.unitsRequired) * 100));
}

// تُحسب الحالة تلقائيًا من العدد والتاريخ والحالة اليدوية
export function deriveStatus(
  req: {
    unitsRequired: number;
    unitsCompleted: number;
    manualStatus?: ManualTerminalStatus | null;
    expiry: string;
  },
  nowMs: number
): RequestStatus {
  if (req.unitsCompleted >= req.unitsRequired) return "completed";
  if (req.manualStatus === "closed" || req.manualStatus === "notNeeded") return "closed";
  if (nowMs > new Date(req.expiry).getTime()) return "expired";
  const ratio = req.unitsRequired > 0 ? req.unitsCompleted / req.unitsRequired : 0;
  if (ratio >= 0.6 && remainingUnits(req) > 0) return "almostComplete";
  return "needsDonors";
}

// هل ما زال الطلب يستقبل نيّات التبرع؟
export function isAcceptingPledges(status: RequestStatus): boolean {
  return status === "needsDonors" || status === "almostComplete";
}

export function requesterDisplayName(req: Pick<BloodRequest, "requesterFullName" | "privacyMode" | "id">): string {
  if (req.privacyMode === "referenceOnly") return `طلب رقم ${req.id}`;
  const parts = req.requesterFullName.trim().split(/\s+/).filter(Boolean);
  if (req.privacyMode === "partialName") {
    const first = parts[0] ?? "";
    const family = parts.length > 1 ? parts[parts.length - 1] : "";
    return family ? `${first} ${family.charAt(0)}.` : first;
  }
  return req.requesterFullName.trim();
}

export function generateReference(existingIds: string[] = []): string {
  const year = new Date().getFullYear();
  let ref = "";
  do {
    const n = Math.floor(1000 + Math.random() * 9000);
    ref = `FZ-${year}-${n}`;
  } while (existingIds.includes(ref));
  return ref;
}

export function generateToken(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let t = "";
  for (let i = 0; i < 8; i += 1) {
    t += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TK-${t}`;
}

export function formatCountdown(nowMs: number, expiryIso: string): string {
  const diff = new Date(expiryIso).getTime() - nowMs;
  if (Number.isNaN(diff) || diff <= 0) return "منتهي";
  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days} يوم و${hours} ساعة`;
  if (hours > 0) return `${hours} ساعة و${minutes} دقيقة`;
  return `${minutes} دقيقة`;
}

export const statusStyles: Record<RequestStatus, string> = {
  needsDonors:
    "bg-blood-50 text-blood-700 ring-blood-600/20 dark:bg-blood-500/10 dark:text-blood-300 dark:ring-blood-400/20",
  almostComplete:
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20",
  completed:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
  closed:
    "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-700/40 dark:text-slate-300 dark:ring-slate-500/20",
  expired:
    "bg-slate-100 text-slate-500 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-500/20",
};

export const urgencyStyles: Record<UrgencyLevel, string> = {
  normal:
    "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-300",
  important:
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300",
  urgent:
    "bg-blood-50 text-blood-700 ring-blood-600/20 dark:bg-blood-500/10 dark:text-blood-300",
};
