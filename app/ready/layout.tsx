import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سجّل نيتك للتبرع",
  description:
    "سجّل رغبتك بالتبرع بالدم. تُحفظ البيانات محليًا في متصفحك فقط وليست موعدًا أو موافقة طبية.",
};

export default function ReadyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
