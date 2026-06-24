import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حملات التبرع",
  description:
    "اعثر على حملات التبرع بالدم الحقيقية في الأردن عبر مصادر رسمية وإخبارية حيّة. نموذج غير رسمي — تأكّد من التفاصيل قبل التوجّه.",
};

export default function CampaignsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
