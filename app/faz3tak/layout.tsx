import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "فزعتك — طلبات دم للحالات داخل المستشفيات",
  description:
    "لوحة طلبات تبرع بالدم لحالات داخل المستشفيات. نموذج تجريبي — لا يستخدم لطلبات الدم الحقيقية.",
};

export default function Faz3takLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
