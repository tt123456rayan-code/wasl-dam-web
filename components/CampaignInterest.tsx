"use client";

import { useEffect, useState } from "react";
import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";

export function CampaignInterest({
  campaignId,
  campaignTitle,
}: {
  campaignId: string;
  campaignTitle: string;
}) {
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState(false);

  // المزامنة مع التخزين المحلي بعد التركيب — الزر يعمل فورًا دون شاشة "تحميل"
  useEffect(() => {
    try {
      const list = readJSON<string[]>(STORAGE_KEYS.campaignInterests, []);
      setRegistered(list.includes(campaignId));
    } catch {
      setError(true);
    }
  }, [campaignId]);

  function register() {
    try {
      const list = readJSON<string[]>(STORAGE_KEYS.campaignInterests, []);
      if (!list.includes(campaignId)) {
        writeJSON(STORAGE_KEYS.campaignInterests, [...list, campaignId]);
      }
      setRegistered(true);
      setError(false);
    } catch {
      setError(true);
    }
  }

  function cancel() {
    try {
      const list = readJSON<string[]>(STORAGE_KEYS.campaignInterests, []);
      writeJSON(
        STORAGE_KEYS.campaignInterests,
        list.filter((id) => id !== campaignId)
      );
      setRegistered(false);
    } catch {
      setError(true);
    }
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
        تعذّر الوصول إلى التخزين المحلي في متصفحك (قد يكون التصفح الخاص مفعّلًا). يمكنك
        مع ذلك التوجه إلى مركز التبرع مباشرة دون تسجيل نية.
      </div>
    );
  }

  if (registered) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
          ✓ تم تسجيل نيتك لحملة «{campaignTitle}» على هذا المتصفح.
        </p>
        <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
          هذا تذكير محلي فقط وليس موعدًا ولا موافقة طبية. القرار النهائي للتبرع يعود
          لكادر بنك الدم الرسمي.
        </p>
        <button onClick={cancel} className="btn-secondary mt-3">
          إلغاء التسجيل
        </button>
      </div>
    );
  }

  return (
    <button onClick={register} className="btn-primary w-full">
      سجّل نية التبرع
    </button>
  );
}
