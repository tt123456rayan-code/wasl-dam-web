import type { Metadata } from "next";
import { demoRequests } from "@/data/faz3tak";
import { RequestDetailClient } from "@/components/faz3tak/RequestDetailClient";

export function generateStaticParams() {
  return demoRequests.map((r) => ({ requestId: r.id }));
}

export function generateMetadata({
  params,
}: {
  params: { requestId: string };
}): Metadata {
  return {
    title: `طلب ${params.requestId}`,
    description: "تفاصيل طلب فزعتك. نموذج تجريبي — لا يستخدم لطلبات الدم الحقيقية.",
  };
}

export default function RequestDetailPage({
  params,
}: {
  params: { requestId: string };
}) {
  return <RequestDetailClient requestId={params.requestId} />;
}
