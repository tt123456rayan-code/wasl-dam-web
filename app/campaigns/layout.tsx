import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حملات التبرع",
  description:
    "حملات تبرع تجريبية مع حالة محسوبة تلقائيًا من تاريخها. بيانات تجريبية فقط.",
};

export default function CampaignsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
