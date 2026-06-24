import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مراكز التبرع",
  description:
    "مرافق صحية حكومية معروفة في الأردن قد تتوفر فيها خدمة التبرع بالدم، مع بحث مباشر على الخريطة. نموذج غير رسمي — تأكّد من المرفق مباشرةً.",
};

export default function CentersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
