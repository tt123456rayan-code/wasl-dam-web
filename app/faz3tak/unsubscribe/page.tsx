"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function UnsubInner() {
  const token = useSearchParams().get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    if (!token || !supabase) {
      setStatus("error");
      return;
    }
    (async () => {
      try {
        const { error } = await supabase.rpc("faz3_unsubscribe", { p_token: token });
        setStatus(error ? "error" : "done");
      } catch {
        setStatus("error");
      }
    })();
  }, [token]);

  if (status === "loading") {
    return <p className="text-sm text-slate-500">جارٍ إلغاء الاشتراك…</p>;
  }

  if (status === "error") {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">تعذّر إلغاء الاشتراك</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          قد يكون الرابط غير صحيح أو منتهٍ. إن كنت لا تزال تتلقّى رسائل، تواصل معنا.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl dark:bg-emerald-500/15">✓</div>
      <h1 className="mt-4 text-2xl font-extrabold">تم إلغاء الاشتراك</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        لن تتلقّى إشعارات بريد إلكتروني من فزعتك بعد الآن. يمكنك إعادة الاشتراك في أي وقت.
      </p>
      <Link href="/faz3tak/subscribe" className="btn-secondary mt-6">إعادة الاشتراك</Link>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="container-page py-16">
      <Suspense fallback={<p className="text-sm text-slate-500">جارٍ التحميل…</p>}>
        <UnsubInner />
      </Suspense>
    </div>
  );
}
