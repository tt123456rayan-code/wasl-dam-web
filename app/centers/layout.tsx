import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مراكز التبرع",
  description:
    "ابحث عن مراكز التبرع حسب الاسم أو المحافظة وفلتر المفتوحة الآن. بيانات تجريبية فقط.",
};

export default function CentersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
