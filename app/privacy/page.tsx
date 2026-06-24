import type { Metadata } from "next";
import { PageHeader, DemoBadge } from "@/components/ui";
import { DeleteLocalData } from "@/components/DeleteLocalData";

export const metadata: Metadata = {
  title: "الخصوصية",
  description:
    "سياسة الخصوصية للنموذج التجريبي «وصّل دم»: لا نجمع بيانات طبية، والبيانات تبقى محليًا في متصفحك فقط.",
};

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader
        title="الخصوصية"
        subtitle="كيف يتعامل النموذج التجريبي مع بياناتك."
      >
        <DemoBadge />
      </PageHeader>

      <div className="container-page py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <section className="card">
            <h2 className="text-lg font-bold">بياناتك تبقى في متصفحك</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              هذا النموذج التجريبي لا يحتوي على خادم خلفي أو قاعدة بيانات. كل ما
              تُدخله (تسجيل نية التبرع، نموذج الاستعداد، الملاحظات، تعديلات اللوحة
              التجريبية) يُحفظ <strong>محليًا في ذاكرة متصفحك (localStorage)</strong> على
              جهازك فقط، ولا يُرسل إلى أي جهة أو خادم.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              هذا يعني أن البيانات تظهر فقط على هذا المتصفح وهذا الجهاز، وتختفي إذا
              مسحت بيانات الموقع أو استخدمت متصفحًا/جهازًا آخر.
            </p>
          </section>

          <section className="card">
            <h2 className="text-lg font-bold">ما الذي لا نجمعه</h2>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
              <li>• لا نجمع الرقم الوطني أو السجلات الطبية أو التشخيص.</li>
              <li>• لا نعرض أرقام هواتف المتبرعين أو بياناتهم الشخصية علنًا.</li>
              <li>• لا نربط المتبرعين بالمرضى ولا نعرض كميات مخزون فعلية.</li>
              <li>• لا نرسل رسائل نصية أو بريدًا إلكترونيًا في النموذج التجريبي.</li>
            </ul>
          </section>

          <DeleteLocalData />
        </div>
      </div>
    </div>
  );
}
