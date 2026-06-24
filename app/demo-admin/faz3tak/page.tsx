"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/faz3tak/ui";
import {
  deriveStatus,
  type BloodRequest,
  type IncorrectInformationReport,
  type ModerationAction,
  type ModerationActionType,
} from "@/lib/faz3tak";
import {
  addModeration,
  loadModeration,
  loadReports,
  loadRequests,
  removeRequest,
  saveRequests,
} from "@/lib/faz3tak-storage";
import { formatArabicDateTime } from "@/lib/utils";

const DEMO_PASSWORD = "demo1234";

export default function Faz3takModerationPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdError, setPwdError] = useState(false);

  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [reports, setReports] = useState<IncorrectInformationReport[]>([]);
  const [audit, setAudit] = useState<ModerationAction[]>([]);
  const [loaded, setLoaded] = useState(false);

  function refresh() {
    setRequests(loadRequests());
    setReports(loadReports());
    setAudit(loadModeration());
  }

  useEffect(() => {
    refresh();
    setLoaded(true);
  }, []);

  function record(requestId: string, action: ModerationActionType, reason: string) {
    addModeration({
      id: `mod-${Date.now()}`,
      requestId,
      action,
      reason,
      at: new Date().toISOString(),
    });
  }

  function setHidden(req: BloodRequest, hidden: boolean) {
    const reason = window.prompt("سبب الإجراء الإشرافي (اختياري):") ?? "";
    const list = loadRequests().map((r) => (r.id === req.id ? { ...r, hidden } : r));
    saveRequests(list);
    record(req.id, hidden ? "hide" : "unhide", reason || "بدون سبب");
    refresh();
  }

  function remove(req: BloodRequest) {
    if (!window.confirm("إزالة هذا الطلب من اللوحة التجريبية؟")) return;
    const reason = window.prompt("سبب الإزالة (اختياري):") ?? "";
    removeRequest(req.id);
    record(req.id, "remove", reason || "بدون سبب");
    refresh();
  }

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
              if (pwd === DEMO_PASSWORD) {
                setUnlocked(true);
                setPwdError(false);
              } else setPwdError(true);
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
        لوحة تجريبية — لا تمثل جهة طبية. الإشراف لا يتحقق طبيًا من التبرعات ولا يغيّر
        عدد التبرعات المكتمل (إلا كإجراء إشرافي عند الضرورة). كل الإجراءات محلية على
        متصفحك فقط.
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">إشراف طلبات فزعتك</h1>
        <Link href="/faz3tak" className="btn-secondary px-4 py-2 text-sm">لوحة فزعتك</Link>
      </div>

      {!loaded ? (
        <p className="mt-8 text-sm text-slate-500">جارٍ التحميل…</p>
      ) : (
        <div className="mt-6 space-y-8">
          {/* Requests */}
          <section>
            <h2 className="text-lg font-bold">كل الطلبات ({requests.length})</h2>
            <div className="mt-3 space-y-3">
              {requests.map((r) => {
                const reqReports = reports.filter((rep) => rep.requestId === r.id);
                return (
                  <div key={r.id} className="card">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300">{r.id}</span>
                        <StatusBadge status={deriveStatus(r, Date.now())} />
                        {r.hidden && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs dark:bg-slate-700">مخفي</span>}
                        {reqReports.length > 0 && (
                          <span className="rounded-full bg-blood-100 px-2 py-0.5 text-xs font-semibold text-blood-700 dark:bg-blood-500/15 dark:text-blood-300">
                            {reqReports.length} بلاغ
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {r.hidden ? (
                          <button className="btn-secondary px-3 py-1.5 text-xs" onClick={() => setHidden(r, false)}>إظهار</button>
                        ) : (
                          <button className="btn-secondary px-3 py-1.5 text-xs" onClick={() => setHidden(r, true)}>إخفاء</button>
                        )}
                        <button className="btn-secondary px-3 py-1.5 text-xs" onClick={() => remove(r)}>إزالة</button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-semibold">{r.hospital} — {r.governorate}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      المطلوب {r.unitsRequired} · المكتمل {r.unitsCompleted}
                    </p>

                    <details className="mt-2 text-sm">
                      <summary className="cursor-pointer text-slate-600 dark:text-slate-400">سجل تحديثات صاحب الطلب ({r.updates.length})</summary>
                      <ul className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                        {[...r.updates].reverse().map((u) => (
                          <li key={u.id}>• {u.message} — {formatArabicDateTime(u.at)}</li>
                        ))}
                      </ul>
                    </details>

                    {reqReports.length > 0 && (
                      <details className="mt-2 text-sm">
                        <summary className="cursor-pointer text-blood-700 dark:text-blood-300">بلاغات المستخدمين</summary>
                        <ul className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                          {reqReports.map((rep) => (
                            <li key={rep.id}>• {rep.reason} — {formatArabicDateTime(rep.createdAt)}</li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Audit log */}
          <section>
            <h2 className="text-lg font-bold">سجل إجراءات الإشراف ({audit.length})</h2>
            {audit.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">لا توجد إجراءات بعد.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {[...audit].reverse().map((a) => (
                  <li key={a.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                    <span className="font-semibold">
                      {a.action === "hide" ? "إخفاء" : a.action === "unhide" ? "إظهار" : "إزالة"}
                    </span>{" "}
                    — <span className="font-mono">{a.requestId}</span>
                    <span className="text-slate-500 dark:text-slate-400"> · {a.reason} · {formatArabicDateTime(a.at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
