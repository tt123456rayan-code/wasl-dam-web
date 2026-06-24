import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حالة الطلب على الدم",
  description:
    "مؤشر عام لحالة الطلب حسب فصيلة الدم والمحافظة (متوفر / بحاجة دعم / احتياج عاجل). بيانات تجريبية فقط.",
};

export default function DemandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
