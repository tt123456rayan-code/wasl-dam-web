import type { Metadata } from "next";
import { PageHeader, DemoBadge, EligibilityNotice, EmergencyNotice } from "@/components/ui";

export const metadata: Metadata = {
  title: "الشروط وإخلاء المسؤولية",
  description:
    "شروط استخدام النموذج التجريبي «وصّل دم» وإخلاء المسؤولية: نموذج تجريبي لأغراض العرض فقط وغير مرتبط بوزارة الصحة.",
};

export default function TermsPage() {
  return (
    <div>
      <PageHeader
        title="الشروط وإخلاء المسؤولية"
        subtitle="طبيعة هذا النموذج التجريبي وحدوده."
      >
        <DemoBadge />
      </PageHeader>

      <div className="container-page py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <section className="card">
            <h2 className="text-lg font-bold">نموذج تجريبي فقط</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              «وصّل دم» نموذج تجريبي تابع لمبادرة همّة الشبابية (NYIJO) لأغراض العرض
              والاختبار فقط. إنه <strong>غير مرتبط بوزارة الصحة</strong> ولا يمثل نظامًا
              رسميًا أو بنك دم، ولا يدّعي أي شراكة أو اعتماد رسمي.
            </p>
          </section>

          <section className="card">
            <h2 className="text-lg font-bold">بيانات تجريبية</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              جميع المراكز والحملات وحالات الطلب المعروضة بيانات خيالية لأغراض العرض،
              وقد لا تعكس أي واقع فعلي. لا يجوز الاعتماد عليها لاتخاذ قرارات حقيقية.
            </p>
          </section>

          <section className="card">
            <h2 className="text-lg font-bold">لا تقييم طبي</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              لا تقدّم المنصة تشخيصًا أو موافقة طبية أو تحديد أهلية. القرار النهائي
              للتبرع يعود دائمًا لكادر بنك الدم الرسمي.
            </p>
            <div className="mt-3">
              <EligibilityNotice />
            </div>
          </section>

          <EmergencyNotice />
        </div>
      </div>
    </div>
  );
}
