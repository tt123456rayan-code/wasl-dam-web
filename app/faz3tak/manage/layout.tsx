import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إدارة طلب فزعتك",
  description:
    "إدارة طلبك وتحديث عدد التبرعات باستخدام رقم الطلب ورمز الإدارة. نموذج تجريبي — لا يستخدم لطلبات الدم الحقيقية.",
};

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
