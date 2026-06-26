import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تفاصيل الطلب",
  description:
    "تفاصيل طلب فزعتك. نموذج تجريبي — لا يستخدم لطلبات الدم الحقيقية.",
};

export default function ViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
