"use client";

import Link from "next/link";
import { useState } from "react";

const DEMO_PASSWORD = "demo1234";

export default function DemoAdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdError, setPwdError] = useState(false);

  if (!unlocked) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-md">
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-semibold text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            لوحة تجريبية — غير مرتبطة بوزارة الصحة
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pwd === DEMO_PASSWORD) setUnlocked(true);
              else setPwdError(true);
            }}
            className="card mt-5"
          >
            <h1 className="text-xl font-bold">الدخول للوحة التجريبية</h1>
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
        لوحة تجريبية — لا تمثل جهة طبية ولا ترتبط بوزارة الصحة.
      </div>
      <h1 className="mt-6 text-2xl font-bold">اللوحة التجريبية</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        أدوات إشراف تجريبية للنموذج.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/demo-admin/faz3tak" className="card hover:border-blood-300 hover:shadow-md">
          <h2 className="text-base font-bold">إشراف فزعتك</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            استعراض طلبات فزعتك الحقيقية من قاعدة البيانات.
          </p>
        </Link>
      </div>
    </div>
  );
}
