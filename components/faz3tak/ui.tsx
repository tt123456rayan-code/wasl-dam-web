import {
  STATUS_LABELS,
  URGENCY_LABELS,
  progressPercent,
  remainingUnits,
  statusStyles,
  urgencyStyles,
  type RequestStatus,
  type UrgencyLevel,
} from "@/lib/faz3tak";
import { cn } from "@/lib/utils";

export function Faz3DemoBadge({ className }: { className?: string }) {
  return (
    <span className={cn("demo-badge", className)}>
      ⚠ نموذج تجريبي — لا يستخدم لطلبات الدم الحقيقية
    </span>
  );
}

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        statusStyles[status]
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function UrgencyBadge({ level }: { level: UrgencyLevel }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        urgencyStyles[level]
      )}
    >
      {level === "urgent" && <span aria-hidden>●</span>}
      {URGENCY_LABELS[level]}
    </span>
  );
}

export function ProgressBlock({
  required,
  completed,
}: {
  required: number;
  completed: number;
}) {
  const pct = progressPercent({ unitsRequired: required, unitsCompleted: completed });
  const remaining = remainingUnits({ unitsRequired: required, unitsCompleted: completed });
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-slate-600 dark:text-slate-400">
          المطلوب: <span className="font-bold text-slate-900 dark:text-white">{required}</span> وحدة
        </span>
        <span className="text-slate-600 dark:text-slate-400">
          تم حسب تحديث صاحب الطلب:{" "}
          <span className="font-bold text-emerald-700 dark:text-emerald-300">{completed}</span>
        </span>
        <span className="text-slate-600 dark:text-slate-400">
          المتبقي: <span className="font-bold text-blood-700 dark:text-blood-300">{remaining}</span>
        </span>
      </div>
      <div
        className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-blood-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function Faz3MedicalNotice() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
      يتم تحديث عدد التبرعات من قبل منشئ الطلب بعد تأكيده مع الجهة الطبية. المنصة لا
      تتحقق طبيًا من التبرعات. القرار الطبي والفحص والقبول يتم من خلال بنك الدم أو
      المستشفى، والمنصة لا تصدر قرارًا طبيًا ولا تتحقق من قبول التبرع.
    </div>
  );
}

export function Faz3EmergencyNotice() {
  return (
    <div className="rounded-2xl border border-blood-300 bg-blood-50 p-4 dark:border-blood-500/40 dark:bg-blood-500/10">
      <p className="flex items-start gap-2 text-sm font-semibold leading-relaxed text-blood-800 dark:text-blood-200">
        <span aria-hidden className="mt-0.5">⚠</span>
        <span>
          في الحالات الطارئة، تواصل مباشرة مع المستشفى أو بنك الدم الرسمي. لا تعتمد
          على المنصة بدل خدمات الطوارئ.
        </span>
      </p>
    </div>
  );
}
