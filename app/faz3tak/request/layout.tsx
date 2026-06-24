import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إنشاء طلب فزعة",
  description:
    "أنشئ طلب تبرع بالدم لحالة داخل مستشفى. نموذج تجريبي — لا يستخدم لطلبات الدم الحقيقية.",
};

export default function RequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
