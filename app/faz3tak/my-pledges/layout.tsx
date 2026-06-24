import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تبرعاتي المسجّلة",
  description:
    "نيّات التبرع المحفوظة محليًا على متصفحك. نموذج تجريبي — لا يستخدم لطلبات الدم الحقيقية.",
};

export default function MyPledgesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
