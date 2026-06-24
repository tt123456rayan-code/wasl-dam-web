"use client";

import { useState } from "react";
import { ALL_STORAGE_KEYS, removeKey } from "@/lib/storage";

export function DeleteLocalData() {
  const [done, setDone] = useState(false);

  function deleteAll() {
    ALL_STORAGE_KEYS.forEach((key) => removeKey(key));
    setDone(true);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-base font-bold">حذف بياناتي المحلية</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        يحذف هذا الإجراء جميع البيانات التي حفظها النموذج التجريبي في متصفحك (نيّات
        التبرع، تسجيلات الاستعداد، الملاحظات، وتعديلات اللوحة التجريبية). لا يؤثر هذا
        على أي خادم لأن كل البيانات محفوظة محليًا في متصفحك فقط.
      </p>
      <button onClick={deleteAll} className="btn-primary mt-4">
        حذف كل بياناتي المحلية
      </button>
      {done && (
        <p className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          ✓ تم حذف بياناتك المحلية من هذا المتصفح.
        </p>
      )}
    </div>
  );
}
