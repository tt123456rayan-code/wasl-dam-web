"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/ui";
import {
  Faz3DemoBadge,
  Faz3MedicalNotice,
  ProgressBlock,
  StatusBadge,
} from "@/components/faz3tak/ui";
import {
  URGENCY_LABELS,
  deriveStatus,
  remainingUnits,
  type ManualTerminalStatus,
  type RequestView,
  type UrgencyLevel,
} from "@/lib/faz3tak";
import {
  addNote,
  extendExpiry,
  getRequestView,
  getUpdates,
  setStatus,
  setUrgency,
  updateCount,
  type UpdateRow,
} from "@/lib/faz3tak-data";
import { pledgeCountFor } from "@/lib/faz3tak-storage";
import { formatArabicDateTime } from "@/lib/utils";

const CONFIRM_TEXT =
  "أؤكد أنني تحققت من هذا التحديث مع الجهة الطبية أو من خلال الحالة.";

function describeError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (msg.includes("unauthorized")) return "رمز الإدارة غير صحيح لهذا الطلب.";
  return "تعذّر تنفيذ العملية. حاول لاحقًا.";
}

export default function ManagePage() {
  const [ref, setRef] = useState("");
  const [token, setToken] = useState("");
  const [authError, setAuthError] = useState("");
  const [req, setReq] = useState<RequestView | null>(null);
  const [updates, setUpdates] = useState<UpdateRow[]>([]);

  const [countInput, setCountInput] = useState("");
  const [note, setNote] = useState("");
  const [urgency, setUrgencyState] = useState<UrgencyLevel>("important");
  const [expiry, setExpiry] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function refreshFrom(id: string) {
    const [v, u] = await Promise.all([getRequestView(id), getUpdates(id)]);
    setReq(v);
    setUpdates(u);
    if (v) {
      setCountInput(String(v.unitsCompleted));
      setUrgencyState(v.urgency);
    }
  }

  async function authenticate(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    setBusy(true);
    try {
      const v = await getRequestView(ref.trim());
      if (!v) {
        setAuthError("رقم الطلب غير موجود.");
        return;
      }
      await refreshFrom(v.id);
      setRef(v.id);
    } catch {
      setAuthError("تعذّر الوصول إلى قاعدة البيانات.");
    } finally {
      setBusy(false);
    }
  }

  function flash(m: string) {
    setMsg(m);
    setTimeout(() => setMsg(""), 4000);
  }

  async function run(action: () => Promise<void>, okMsg: string) {
    if (!req) return;
    setBusy(true);
    try {
      await action();
      await refreshFrom(req.id);
      flash(okMsg);
    } catch (e) {
      flash(describeError(e));
    } finally {
      setBusy(false);
    }
  }

  function applyCount() {
    if (!req) return;
    if (!window.confirm(CONFIRM_TEXT)) return;
    void run(() => updateCount(req.id, token.trim(), Number(countInput)), "تم تحديث عدد التبرعات.");
  }

  function markComplete() {
    if (!req) return;
    if (!window.confirm(CONFIRM_TEXT)) return;
    void run(() => updateCount(req.id, token.trim(), req.unitsRequired), "تمت الفزعة — أُغلق الطلب.");
  }

  function submitNote() {
    if (!req || note.trim().length < 3) return;
    void run(() => addNote(req.id, token.trim(), note.trim()), "تمت إضافة الملاحظة.").then(() => setNote(""));
  }

  function changeUrgency() {
    if (!req) return;
    void run(() => setUrgency(req.id, token.trim(), urgency), "تم تحديث مستوى الإلحاح.");
  }

  function doExtend() {
    if (!req || !expiry) return;
    const t = new Date(expiry).getTime();
    if (t <= Date.now() || t <= new Date(req.expiry).getTime()) {
      flash("تاريخ التمديد يجب أن يكون في المستقبل وبعد التاريخ الحالي.");
      return;
    }
    void run(() => extendExpiry(req.id, token.trim(), new Date(expiry).toISOString()), "تم تمديد تاريخ الانتهاء.").then(() => setExpiry(""));
  }

  function markTerminal(kind: ManualTerminalStatus) {
    if (!req) return;
    const label = kind === "closed" ? "إغلاق الطلب" : "وضع علامة لم يعد مطلوبًا";
    if (!window.confirm(`${label}؟`)) return;
    void run(() => setStatus(req.id, token.trim(), kind), label + " — تم.");
  }

  if (!req) {
    return (
      <div>
        <PageHeader
          title="إدارة طلب فزعتك"
          subtitle="أدخل رقم الطلب ورمز الإدارة الخاص لتحديث حالة طلبك وعدد التبرعات."
        >
          <Faz3DemoBadge />
        </PageHeader>
        <div className="container-page py-8">
          <form onSubmit={authenticate} className="card mx-auto max-w-md space-y-4">
            <div>
              <label className="label" htmlFor="ref">رقم الطلب</label>
              <input id="ref" className="input font-mono" placeholder="FZ-2026-1234" value={ref} onChange={(e) => setRef(e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="tok">رمز الإدارة الخاص</label>
              <input id="tok" className="input font-mono" placeholder="الرمز الذي ظهر عند الإنشاء" value={token} onChange={(e) => setToken(e.target.value)} />
            </div>
            {authError && <p className="text-sm text-blood-600">{authError}</p>}
            <button type="submit" disabled={busy} className="btn-primary w-full">{busy ? "جارٍ التحقق…" : "دخول"}</button>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              يُتحقق من رمز الإدارة على الخادم عند كل تحديث؛ بدون الرمز الصحيح لا يمكن تعديل الطلب.
            </p>
          </form>
        </div>
      </div>
    );
  }

  const status = deriveStatus(req, Date.now());
  const remaining = remainingUnits(req);
  const isComplete = req.unitsCompleted >= req.unitsRequired;
  const isActive = status === "needsDonors" || status === "almostComplete";
  const pledges = pledgeCountFor(req.id);

  return (
    <div className="container-page py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link href="/faz3tak" className="text-sm font-semibold text-blood-600 hover:text-blood-700">→ لوحة فزعتك</Link>
        <button className="btn-secondary px-4 py-2 text-xs" onClick={() => { setReq(null); setToken(""); }}>خروج</button>
      </div>

      {isComplete && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl dark:bg-emerald-500/15">✓</div>
          <h2 className="mt-3 text-2xl font-extrabold">تمت الفزعة — اكتمل الاحتياج</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            شكرًا لك ولكل من فزع. أُغلق الطلب تلقائيًا وتوقّف استقبال نيّات التبرع الجديدة.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{req.id}</span>
        <StatusBadge status={status} />
        <Faz3DemoBadge />
      </div>
      <h1 className="mt-2 text-2xl font-extrabold">{req.hospital} — {req.governorate}</h1>

      {msg && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium dark:border-slate-700 dark:bg-slate-900/40">
          {msg}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card">
            <ProgressBlock required={req.unitsRequired} completed={req.unitsCompleted} />
          </div>

          <div className="card">
            <h2 className="text-base font-bold">تحديث عدد التبرعات المكتملة</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              لا يمكن أن يتجاوز العدد المطلوب ({req.unitsRequired}). المتبقي يُحسب تلقائيًا ({remaining}).
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <div>
                <label className="label" htmlFor="count">العدد المكتمل</label>
                <input id="count" type="number" min={0} max={req.unitsRequired} className="input w-32"
                  value={countInput} disabled={!isActive} onChange={(e) => setCountInput(e.target.value)} />
              </div>
              <button className="btn-primary" onClick={applyCount} disabled={!isActive || busy}>تأكيد التحديث</button>
              {isActive && <button className="btn-secondary" onClick={markComplete} disabled={busy}>وضع علامة «تمت الفزعة»</button>}
            </div>
          </div>

          <div className="card">
            <h2 className="text-base font-bold">إضافة ملاحظة عامة</h2>
            <textarea className="input mt-3 min-h-20" value={note} onChange={(e) => setNote(e.target.value)} placeholder="تحديث عام للحالة" disabled={!isActive} />
            <button className="btn-secondary mt-3" onClick={submitNote} disabled={!isActive || busy || note.trim().length < 3}>إضافة الملاحظة</button>
          </div>

          <div className="card">
            <h2 className="text-base font-bold">سجل النشاط</h2>
            {updates.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">لا توجد تحديثات بعد.</p>
            ) : (
              <ol className="mt-4 space-y-3">
                {[...updates].reverse().map((u, i) => (
                  <li key={`${u.at}-${i}`} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blood-600" />
                    <div>
                      <p className="text-sm font-medium">{u.message}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{formatArabicDateTime(u.at)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card">
            <h2 className="text-base font-bold">مستوى الإلحاح</h2>
            <div className="mt-3 flex gap-2">
              <select className="input" value={urgency} onChange={(e) => setUrgencyState(e.target.value as UrgencyLevel)} disabled={!isActive}>
                {(Object.keys(URGENCY_LABELS) as UrgencyLevel[]).map((u) => (
                  <option key={u} value={u}>{URGENCY_LABELS[u]}</option>
                ))}
              </select>
              <button className="btn-secondary" onClick={changeUrgency} disabled={!isActive || busy}>تحديث</button>
            </div>
          </div>

          <div className="card">
            <h2 className="text-base font-bold">تمديد تاريخ الانتهاء</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">متاح فقط أثناء نشاط الطلب.</p>
            <input type="datetime-local" className="input mt-3" value={expiry} onChange={(e) => setExpiry(e.target.value)} disabled={!isActive} />
            <button className="btn-secondary mt-3" onClick={doExtend} disabled={!isActive || busy || !expiry}>تمديد</button>
          </div>

          <div className="card">
            <h2 className="text-base font-bold">حالة الطلب</h2>
            <div className="mt-3 flex flex-col gap-2">
              <button className="btn-secondary" onClick={() => markTerminal("closed")} disabled={isComplete || busy}>مغلق</button>
              <button className="btn-secondary" onClick={() => markTerminal("notNeeded")} disabled={isComplete || busy}>لم يعد مطلوبًا</button>
            </div>
          </div>

          <div className="card">
            <h2 className="text-base font-bold">نيّات التبرع</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              عدد من سجّلوا نية التوجّه للتبرع (محلي على هذا المتصفح): <span className="font-bold">{pledges}</span>
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              نيّات التبرع لا تغيّر عدد التبرعات المكتمل إطلاقًا؛ أنت من يحدّثه بعد التأكد.
            </p>
          </div>

          <Faz3MedicalNotice />
        </aside>
      </div>
    </div>
  );
}
