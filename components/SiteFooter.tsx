import Link from "next/link";
import { Logo } from "@/components/Logo";

export function SiteFooter() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="container-page py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <Logo />
              <span className="text-lg font-bold">وصّل دم</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-slate-600 dark:text-slate-400">
              منصة دعم رقمية تساعدك على إيجاد مراكز التبرع ومتابعة الحملات (بيانات
              تجريبية). هذه المنصة ليست بنك دم ولا تقدّم تقييمًا طبيًا.
            </p>
            <p className="mt-4 demo-badge">⚠ نموذج تجريبي — بيانات تجريبية فقط</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">روابط</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/faz3tak" className="hover:text-blood-600">فزعتك — طلبات الحالات</Link></li>
              <li><Link href="/faq" className="hover:text-blood-600">الأسئلة الشائعة</Link></li>
              <li><Link href="/eligibility" className="hover:text-blood-600">الأهلية التوعوية</Link></li>
              <li><Link href="/demand" className="hover:text-blood-600">حالة الطلب</Link></li>
              <li><Link href="/privacy" className="hover:text-blood-600">الخصوصية</Link></li>
              <li><Link href="/terms" className="hover:text-blood-600">الشروط وإخلاء المسؤولية</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">الخصوصية والتواصل</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>لا نعرض بيانات المتبرعين علنًا.</li>
              <li>لا نجمع بيانات طبية أو أرقامًا وطنية.</li>
              {contactEmail ? (
                <li>للتواصل: {contactEmail}</li>
              ) : (
                <li>
                  <Link href="/faq" className="hover:text-blood-600">
                    الأسئلة الشائعة والدعم
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <p>نموذج تجريبي تابع لمبادرة همّة الشبابية (NYIJO) — غير مرتبط بوزارة الصحة.</p>
          <p className="mt-1">
            هذا المشروع لأغراض العرض والاختبار فقط ولا يمثل نظامًا رسميًا أو بنك دم.
          </p>
        </div>
      </div>
    </footer>
  );
}
