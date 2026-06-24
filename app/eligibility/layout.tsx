import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الأهلية التوعوية",
  description:
    "فحص توعوي مبدئي فقط دون تشخيص أو موافقة طبية. القرار النهائي للتبرع لكادر بنك الدم الرسمي.",
};

export default function EligibilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
