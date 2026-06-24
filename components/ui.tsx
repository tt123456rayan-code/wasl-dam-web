import { DEMAND_LABELS, type DemandStatus } from "@/lib/types";
import { cn, demandStyles } from "@/lib/utils";

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span className={cn("demo-badge", className)}>⚠ بيانات تجريبية</span>
  );
}

export function DemandBadge({ status }: { status: DemandStatus }) {
  const style = demandStyles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        style.badge
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", style.dot)} />
      {DEMAND_LABELS[status]}
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="container-page py-10">
        <h1 className="section-title">{title}</h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}

export function EligibilityNotice() {
  return (
    <div className="rounded-2xl border border-blood-200 bg-blood-50 p-4 text-sm leading-relaxed text-blood-800 dark:border-blood-500/30 dark:bg-blood-500/10 dark:text-blood-200">
      هذا فحص توعوي مبدئي فقط، والقرار النهائي للتبرع يعود لكادر بنك الدم الرسمي.
    </div>
  );
}

export function SafetyNotice() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-base font-bold">تنبيه مهم حول السلامة والخصوصية</h3>
      <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <li>• هذه المنصة ليست بنك دم ولا تربط المتبرعين بالمرضى مباشرة.</li>
        <li>• لا نجمع الرقم الوطني أو السجلات الطبية أو التشخيص.</li>
        <li>• لا نعرض أرقام هواتف المتبرعين أو بياناتهم الشخصية علنًا.</li>
        <li>• لا نعرض كميات المخزون، بل حالة الطلب فقط (متوفر / بحاجة دعم / احتياج عاجل).</li>
        <li>• القرار النهائي للتبرع يعود دائمًا لكادر بنك الدم الرسمي.</li>
      </ul>
    </div>
  );
}

export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900/40">
      <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
        {title}
      </p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
