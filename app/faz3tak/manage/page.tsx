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
  clampCompleted,
  deriveStatus,
  remainingUnits,
  type BloodRequest,
  type ManualTerminalStatus,
  type RequestUpdate,
  type RequestUpdateType,
  type UrgencyLevel,
} from "@/lib/faz3tak";
import { getRequest, pledgeCountFor, upsertRequest } from "@/lib/faz3tak-storage";
import { formatArabicDateTime } from "@/lib/utils";

const CONFIRM_TEXT =
  "أؤكد أنني تحققت من هذا التحديث مع الجهة الطبية أو من خلال الحالة.";

let updateSeq = 0;
function makeUpdate(type: RequestUpdateType, message: string): RequestUpdate {
  updateSeq += 1;
  return { id: `up-${Date.now()}-${updateSeq}`, at: new Date().toISOString(), type, message };
}

export default function ManagePage() {
  const [ref, setRef] = useState("");
  const [token, setToken] = useState("");
  const [authError, setAuthError] = useState("");
  const [req, setReq] = useState<BloodRequest | null>(null);

  const [countInput, setCountInput] = useState("");
  const [note, setNote] = useState("");
  const [urgency, setUrgency] = useState<UrgencyLevel>("important");
  const [expiry, setExpiry] = useState("");
  const [msg, setMsg] = useState("");

  function authenticate(e: React.FormEvent) {
    e.preventDefault();
    const found = getRequest(ref.trim());
    if (!found || found.token !== token.trim()) {
      setAuthError("رقم الطلب أو رمز الإدارة غير صحيح.");
      return;
    }
    setAuthError("");
    setReq(found);
    setCountInput(String(found.unitsCompleted));
    setUrgency(found.urgency);
  }

  function persist(updated: BloodRequest, message: string) {
    upsertRequest(updated);
    setReq(updated);
    setMsg(message);
    setTimeout(() => setMsg(""), 4000);
  }

  function applyCount() {
    if (!req) return;
    const target = req.unitsRequired;
    const val = clampCompleted(Number(countInput), target);
    if (!window.confirm(CONFIRM_TEXT)) return;
    const updates = [...req.updates, makeUpdate("countUpdated", `تم تحديث العدد إلى ${val} من ${target}`)];
    if (val >= target) {
      updates.push(makeUpdate("statusChanged", "تمت الفزعة — اكتمل الاحتياج"));
    }
    persist({ ...req, unitsCompleted: val, updates }, "تم تحديث عدد التبرعات.");
    setCountInput(String(val));
  }

  function addNote() {
    if (!req || note.trim().length < 3) return;
    const updates = [...req.updates, makeUpdate("noteAdded", `ملاحظة من صاحب الطلب: ${note.trim()}`)];
    persist({ ...req, updates }, "تمت إضافة الملاحظة.");
    setNote("");
  }

  function changeUrgency() {
    if (!req || urgency === req.urgency) return;
    const updates = [...req.updates, makeUpdate("urgencyChanged", `تم تغيير مستوى الإلحاح إلى «${URGENCY_LABELS[urgency]}»`)];
    persist({ ...req, urgency, updates }, "تم تحديث مستوى الإلحاح.");
  }

  function extendExpiry() {
    if (!req || !expiry) return;
    const t = new Date(expiry).getTime();
    if (t <= Date.now() || t <= new Date(req.expiry).getTime()) {
      setMsg("تاريخ التمديد يجب أن يكون في المستقبل وبعد التاريخ الحالي.");
      return;
    }
    const updates = [...req.updates, makeUpdate("expiryExtended", `تم تمديد تاريخ الانتهاء إلى ${formatArabicDateTime(new Date(expiry).toISOString())}`)];
    persist({ ...req, expiry: new Date(expiry).toISOString(), updates }, "تم تمديد تاريخ الانتهاء.");
    setExpiry("");
  }

  function markComplete() {
    if (!req) return;
    if (!window.confirm(CONFIRM_TEXT)) return;
    const target = req.unitsRequired;
    const updates = [
      ...req.updates,
      makeUpdate("countUpdated", `تم تحديث العدد إلى ${target} من ${target}`),
      makeUpdate("statusChanged", "تمت الفزعة — اكتمل الاحتياج"),
    ];
    persist({ ...req, unitsCompleted: target, updates }, "تمت الفزعة — أُغلق الطلب.");
    setCountInput(String(target));
  }

  function markTerminal(kind: ManualTerminalStatus) {
    if (!req) return;
    const label = kind === "closed" ? "أُغلق الطلب" : "لم يعد الطلب مطلوبًا";
    if (!window.confirm(`${label}؟`)) return;
    const updates = [...req.updates, makeUpdate("statusChanged", label)];
    persist({ ...req, manualStatus: kind, updates }, label);
  }

  // ===== شاشة الدخول =====
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
              <input id="ref" className="input font-mono" placeholder="FZ-2026-1048" value={ref} onChange={(e) => setRef(e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="tok">رمز الإدارة الخاص</label>
              <input id="tok" className="input font-mono" placeholder="TK-XXXXXXXX" value={token} onChange={(e) => setToken(e.target.value)} />
            </div>
            {authError && <p className="text-sm text-blood-600">{authError}</p>}
            <button type="submit" className="btn-primary w-full">دخول</button>
            <details className="text-xs text-slate-500 dark:text-slate-400">
              <summary className="cursor-pointer">للتجربة على البيانات التجريبية</summary>
              <p className="mt-2">جرّب الطلب <span className="font-mono">FZ-2026-1048</span> بالرمز <span className="font-mono">TK-DEMO1048</span>.</p>
            </details>
          </form>
        </div>
      </div>
    );
  }

  // ===== لوحة الإدارة =====
  const status = deriveStatus(req, Date.now());
  const remaining = remainingUnits(req);
  const isComplete = req.unitsCompleted >= req.unitsRequired;
  const isActive = status === "needsDonors" || status === "almostComplete";
  const pledges = pledgeCountFor(req.id);

  return (
    <div className="container-page py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link href="/faz3tak" className="text-sm font-semibold text-blood-600 hover:text-blood-700">→ لوحة فزعتك</Link>
        <button className="btn-secondary px-4 py-2 text-xs" onClick={() => setReq(null)}>تسجيل الخروج</button>
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
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
          {msg}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card">
            <ProgressBlock required={req.unitsRequired} completed={req.unitsCompleted} />
          </div>

          {/* Update completed count */}
          <div className="card">
            <h2 className="text-base font-bold">تحديث عدد التبرعات المكتملة</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              لا يمكن أن يتجاوز العدد المطلوب ({req.unitsRequired}). المتبقي يُحسب تلقائيًا ({remaining}).
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <div>
                <label className="label" htmlFor="count">العدد المكتمل</label>
                <input id="count" type="number" min={0} max={req.unitsRequired} className="input w-32"
                  value={countInput} disabled={!isActive && !isComplete}
                  onChange={(e) => setCountInput(e.target.value)} />
              </div>
              <button className="btn-primary" onClick={applyCount} disabled={!isActive}>تأكيد التحديث</button>
              {isActive && (
                <button className="btn-secondary" onClick={markComplete}>وضع علامة «تمت الفزعة»</button>
              )}
            </div>
          </div>

          {/* Public note */}
          <div className="card">
            <h2 className="text-base font-bold">إضافة ملاحظة عامة</h2>
            <textarea className="input mt-3 min-h-20" value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="تحديث عام للحالة" disabled={!isActive} />
            <button className="btn-secondary mt-3" onClick={addNote} disabled={!isActive || note.trim().length < 3}>إضافة الملاحظة</button>
          </div>

          {/* Activity history */}
          <div className="card">
            <h2 className="text-base font-bold">سجل النشاط</h2>
            <ol className="mt-4 space-y-3">
              {[...req.updates].reverse().map((u) => (
                <li key={u.id} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blood-600" />
                  <div>
                    <p className="text-sm font-medium">{u.message}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{formatArabicDateTime(u.at)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card">
            <h2 className="text-base font-bold">مستوى الإلحاح</h2>
            <div className="mt-3 flex gap-2">
              <select className="input" value={urgency} onChange={(e) => setUrgency(e.target.value as UrgencyLevel)} disabled={!isActive}>
                {(Object.keys(URGENCY_LABELS) as UrgencyLevel[]).map((u) => (
                  <option key={u} value={u}>{URGENCY_LABELS[u]}</option>
                ))}
              </select>
              <button className="btn-secondary" onClick={changeUrgency} disabled={!isActive}>تحديث</button>
            </div>
          </div>

          <div className="card">
            <h2 className="text-base font-bold">تمديد تاريخ الانتهاء</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">متاح فقط أثناء نشاط الطلب.</p>
            <input type="datetime-local" className="input mt-3" value={expiry} onChange={(e) => setExpiry(e.target.value)} disabled={!isActive} />
            <button className="btn-secondary mt-3" onClick={extendExpiry} disabled={!isActive || !expiry}>تمديد</button>
          </div>

          <div className="card">
            <h2 className="text-base font-bold">حالة الطلب</h2>
            <div className="mt-3 flex flex-col gap-2">
              <button className="btn-secondary" onClick={() => markTerminal("closed")} disabled={isComplete}>مغلق</button>
              <button className="btn-secondary" onClick={() => markTerminal("notNeeded")} disabled={isComplete}>لم يعد مطلوبًا</button>
            </div>
          </div>

          <div className="card">
            <h2 className="text-base font-bold">نيّات التبرع</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              عدد من سجّلوا نية التوجّه للتبرع (محلي فقط): <span className="font-bold">{pledges}</span>
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
