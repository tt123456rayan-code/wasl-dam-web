"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PledgeClient } from "@/components/faz3tak/PledgeClient";

function PledgeInner() {
  const ref = useSearchParams().get("ref") ?? "";
  return <PledgeClient requestId={ref} />;
}

export default function PledgePage() {
  return (
    <Suspense fallback={<div className="container-page py-16 text-sm text-slate-500">جارٍ التحميل…</div>}>
      <PledgeInner />
    </Suspense>
  );
}
