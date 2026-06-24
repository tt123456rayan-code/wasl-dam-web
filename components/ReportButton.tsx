"use client";

import { useState } from "react";
import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";

interface ReportRecord {
  targetType: "center" | "campaign";
  targetId: string;
  targetName: string;
  reason: string;
  createdAt: string;
}

export function ReportButton({
  targetType,
  targetId,
  targetName,
}: {
  targetType: "center" | "campaign";
  targetId: string;
  targetName: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (reason.trim().length < 3) return;
    const list = readJSON<ReportRecord[]>(STORAGE_KEYS.reports, []);
    const record: ReportRecord = {
      targetType,
      targetId,
      targetName,
      reason: reason.trim(),
      createdAt: new Date().toISOString(),
    };
    writeJSON(STORAGE_KEYS.reports, [...list, record]);
    setDone(true);
  }

  if (done) {
    return (
      <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-300">
        ✓ شكرًا لك. تم حفظ ملاحظتك محليًا على متصفحك فقط (لا تُرسل لأي جهة في النموذج
        التجريبي).
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 text-xs font-medium text-slate-500 underline-offset-2 hover:text-blood-600 hover:underline dark:text-slate-400"
      >
        الإبلاغ عن معلومة غير صحيحة
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
      <label className="label" htmlFor={`report-${targetId}`}>
        ما المعلومة غير الصحيحة؟ (تجريبي — يُحفظ محليًا فقط)
      </label>
      <textarea
        id={`report-${targetId}`}
        className="input min-h-20"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="مثال: ساعات العمل غير صحيحة"
      />
      <div className="mt-2 flex gap-2">
        <button type="submit" className="btn-primary px-4 py-2 text-xs">
          إرسال الملاحظة
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn-secondary px-4 py-2 text-xs"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
