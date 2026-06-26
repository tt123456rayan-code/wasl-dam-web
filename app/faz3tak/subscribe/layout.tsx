import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اشتراك إشعارات فزعتك",
  description:
    "اشترك لتلقّي إشعار عبر البريد عند توفّر طلب فزعة في محافظتك. يمكنك إلغاء الاشتراك في أي وقت.",
};

export default function SubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
