import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سأتوجه للتبرع",
  description: "تسجيل نية تبرع. نموذج تجريبي — لا يستخدم لطلبات الدم الحقيقية.",
};

export default function PledgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
