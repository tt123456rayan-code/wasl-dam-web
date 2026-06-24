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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const list = readJSON<string[]>(STORAGE_KEYS.campaignInterests, []);
    setRegistered(list.includes(campaignId));
    setReady(true);
  }, [campaignId]);

  function register() {
    const list = readJSON<string[]>(STORAGE_KEYS.campaignInterests, []);
    if (!list.includes(campaignId)) {
      writeJSON(STORAGE_KEYS.campaignInterests, [...list, campaignId]);
    }
    setRegistered(true);
  }

  function cancel() {
    const list = readJSON<string[]>(STORAGE_KEYS.campaignInterests, []);
    writeJSON(
      STORAGE_KEYS.campaignInterests,
      list.filter((id) => id !== campaignId)
    );
    setRegistered(false);
  }

  if (!ready) {
    return (
      <button className="btn-primary w-full" disabled>
        جارٍ التحميل…
      </button>
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
