"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/faz3tak/ui";
import { EmptyState } from "@/components/ui";
import { deriveStatus, type RequestView } from "@/lib/faz3tak";
import { isSupabaseEnabled, listRequests } from "@/lib/faz3tak-data";
import { formatArabicDateTime } from "@/lib/utils";

const DEMO_PASSWORD = "demo1234";

export default function Faz3takModerationPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdError, setPwdError] = useState(false);

  const [requests, setRequests] = useState<RequestView[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!unlocked) return;
    let active = true;
    listRequests()
      .then((rows) => active && setRequests(rows))
      .catch(() => {})
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, [unlocked]);

  if (!unlocked) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-md">
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-semibold text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            لوحة تجريبية — لا تمثل جهة طبية
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pwd === DEMO_PASSWORD) setUnlocked(true);
              else setPwdError(true);
            }}
            className="card mt-5"
          >
            <h1 className="text-xl font-bold">إشراف فزعتك (تجريبي)</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              بوابة كلمة مرور تجريبية فقط. كلمة المرور:
              <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">demo1234</code>
            </p>
            <input type="password" className="input mt-4" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="كلمة المرور التجريبية" />
            {pwdError && <p className="mt-1 text-sm text-blood-600">كلمة المرور غير صحيحة.</p>}
            <button type="submit" className="btn-primary mt-4 w-full">دخول</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-semibold text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
        لوحة تجريبية — لا تمثل جهة طبية. لا تتحقق طبيًا من التبرعات.
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">إشراف طلبات فزعتك</h1>
        <Link href="/faz3tak" className="btn-secondary px-4 py-2 text-sm">لوحة فزعتك</Link>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
        هذه نظرة قراءة فقط للطلبات العامة الحقيقية. إجراءات الإشراف (إخفاء/إزالة طلب،
        ومراجعة البلاغات الخاصة) تتطلب صلاحية إدارية آمنة (service role) عبر خادم
        مخصّص، ولا تُنفَّذ من المتصفح في هذا النموذج لأسباب أمنية.
      </div>

      {!isSupabaseEnabled ? (
        <div className="mt-6">
          <EmptyState title="قاعدة البيانات غير مُعدّة" message="اضبط مفاتيح Supabase لعرض الطلبات الحقيقية." />
        </div>
      ) : !loaded ? (
        <p className="mt-6 text-sm text-slate-500">جارٍ التحميل…</p>
      ) : requests.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="لا توجد طلبات" message="لا توجد طلبات عامة حاليًا." />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300">{r.id}</span>
                  <StatusBadge status={deriveStatus(r, Date.now())} />
                </div>
                <Link href={`/faz3tak/view?ref=${encodeURIComponent(r.id)}`} className="text-sm font-medium text-blood-600 hover:text-blood-700">عرض</Link>
              </div>
              <p className="mt-2 text-sm font-semibold">{r.hospital} — {r.governorate}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                المطلوب {r.unitsRequired} · المكتمل {r.unitsCompleted} · أُنشئ {formatArabicDateTime(r.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
