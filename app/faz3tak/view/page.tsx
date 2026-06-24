"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RequestDetailClient } from "@/components/faz3tak/RequestDetailClient";

function ViewInner() {
  const ref = useSearchParams().get("ref") ?? "";
  return <RequestDetailClient requestId={ref} />;
}

export default function ViewPage() {
  return (
    <Suspense fallback={<div className="container-page py-16 text-sm text-slate-500">جارٍ التحميل…</div>}>
      <ViewInner />
    </Suspense>
  );
}
