import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إلغاء اشتراك إشعارات فزعتك",
  description: "إلغاء اشتراكك في إشعارات فزعتك.",
};

export default function UnsubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
