import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة تجريبية",
  description:
    "لوحة تجريبية لتعديل البيانات محليًا في المتصفح — غير مرتبطة بوزارة الصحة وليست لوحة إنتاج.",
};

export default function DemoAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
