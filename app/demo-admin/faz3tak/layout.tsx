import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة فزعتك التجريبية",
  description:
    "لوحة إشراف تجريبية لطلبات فزعتك — لا تمثل جهة طبية ولا تتحقق من التبرعات.",
};

export default function Faz3takAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
