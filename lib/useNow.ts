"use client";

import { useEffect, useState } from "react";

/**
 * يعيد اللحظة الحالية (ms) أو null قبل التحميل على العميل.
 * إعادة null في أول رسم تمنع اختلاف الترطيب (hydration mismatch)
 * بين توليد الصفحة الثابت ووقت التشغيل، ثم تُحدّث القيمة بعد التركيب.
 */
export function useNow(intervalMs = 60_000): number | null {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
