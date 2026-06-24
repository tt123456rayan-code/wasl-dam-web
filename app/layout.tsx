import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeScript } from "@/components/ThemeScript";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "وصّل دم | Wasl Dam",
  description:
    "نموذج تجريبي تابع لمبادرة همّة الشبابية لدعم التبرع بالدم: ابحث عن أقرب مركز، تابع الحملات، وسجّل نيتك للتبرع. بيانات تجريبية فقط.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${cairo.variable} font-sans`}>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
