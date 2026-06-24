import type { Metadata } from "next";
import { demoRequests } from "@/data/faz3tak";
import { PledgeClient } from "@/components/faz3tak/PledgeClient";

export function generateStaticParams() {
  return demoRequests.map((r) => ({ requestId: r.id }));
}

export const metadata: Metadata = {
  title: "سأتوجه للتبرع",
  description: "تسجيل نية تبرع. نموذج تجريبي — لا يستخدم لطلبات الدم الحقيقية.",
};

export default function PledgePage({
  params,
}: {
  params: { requestId: string };
}) {
  return <PledgeClient requestId={params.requestId} />;
}
