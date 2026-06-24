"use client";

import { useState } from "react";
import { addReport } from "@/lib/faz3tak-storage";

export function ReportRequest({ requestId }: { requestId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (reason.trim().length < 3) return;
    addReport({
      id: `rep-${Date.now()}`,
      requestId,
      reason: reason.trim(),
      createdAt: new Date().toISOString(),
    });
    setDone(true);
  }

  if (done) {
    return (
      <p className="text-sm text-emerald-700 dark:text-emerald-300">
        ✓ شكرًا لك. تم حفظ بلاغك محليًا على متصفحك فقط ليطّلع عليه الإشراف التجريبي.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-slate-500 underline-offset-2 hover:text-blood-600 hover:underline dark:text-slate-400"
      >
        الإبلاغ عن معلومة غير صحيحة
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
      <label className="label" htmlFor={`rep-${requestId}`}>
        ما المعلومة غير الصحيحة؟ (تجريبي — يُحفظ محليًا فقط)
      </label>
      <textarea
        id={`rep-${requestId}`}
        className="input min-h-20"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="مثال: اسم المستشفى غير صحيح"
      />
      <div className="mt-2 flex gap-2">
        <button type="submit" className="btn-primary px-4 py-2 text-xs">إرسال البلاغ</button>
        <button type="button" onClick={() => setOpen(false)} className="btn-secondary px-4 py-2 text-xs">
          إلغاء
        </button>
      </div>
    </form>
  );
}
