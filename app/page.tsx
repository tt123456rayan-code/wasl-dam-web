import Link from "next/link";
import { Logo } from "@/components/Logo";
import { EmergencyNotice, SafetyNotice } from "@/components/ui";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-blood-50/60 to-white dark:border-slate-800 dark:from-blood-900/10 dark:to-slate-950">
        <div className="container-page py-16 sm:py-20">
          <p className="demo-badge">نموذج تجريبي تابع لمبادرة همّة الشبابية</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            تبرعك أقرب… وحياتهم تستمر
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            ابحث عن مركز تبرع قريب، تابع حملات التبرع، وسجّل نيتك للتبرع. منصة دعم
            رقمية فقط — القرار النهائي للتبرع يعود لكادر بنك الدم الرسمي.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/centers" className="btn-primary">
              ابحث عن أقرب مركز
            </Link>
            <Link href="/ready" className="btn-secondary">
              أنا جاهز للتبرع
            </Link>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Logo className="h-5 w-5" />
            بدعم وإلهام من مبادرة همّة الشبابية (NYIJO)
          </p>
        </div>
      </section>

      {/* Emergency notice */}
      <section className="container-page pt-8">
        <EmergencyNotice />
      </section>

      {/* Faz3tak */}
      <section className="container-page py-14">
        <div className="rounded-2xl border border-blood-200 bg-blood-50/60 p-6 dark:border-blood-500/30 dark:bg-blood-500/5 sm:p-8">
          <h2 className="section-title">فزعتك — طلبات دم للحالات داخل المستشفيات</h2>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
            لوحة عامة لطلبات التبرع لحالات داخل المستشفيات: اطّلع على الطلب، توجّه
            للمستشفى، وتبرّع باسم الحالة أو رقم الطلب. الفحص والقبول من خلال بنك الدم
            أو المستشفى.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/faz3tak" className="btn-primary">تصفّح طلبات فزعتك</Link>
            <Link href="/faz3tak/request" className="btn-secondary">أنشئ طلب فزعة</Link>
          </div>
        </div>
      </section>

      {/* Campaigns */}
      <section className="border-y border-slate-200 bg-slate-50 py-14 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="container-page">
          <h2 className="section-title">حملات التبرع</h2>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
            حملات التبرع أحداث مؤقتة تُعلَن عبر القنوات الرسمية والإخبارية. اعثر على
            الحملات الحقيقية الحالية عبر مصادر حيّة، وتأكّد من تفاصيلها قبل التوجّه.
          </p>
          <div className="mt-6">
            <Link href="/campaigns" className="btn-primary">
              ابحث عن حملات التبرع الحقيقية
            </Link>
          </div>
        </div>
      </section>

      {/* Three steps */}
      <section className="container-page py-14">
        <h2 className="section-title text-center">كيف تعمل المنصة؟</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { n: "١", t: "ابحث", d: "اعثر على مركز تبرع حقيقي قريب أو حملة حالية عبر المصادر الرسمية والخريطة." },
            { n: "٢", t: "سجّل نيتك", d: "سجّل رغبتك بالتبرع لتذكير نفسك — التسجيل ليس موعدًا ولا موافقة طبية." },
            { n: "٣", t: "توجّه لمركز التبرع", d: "اذهب إلى مركز التبرع حيث يقرر كادر بنك الدم الرسمي أهليتك." },
          ].map((s) => (
            <div key={s.n} className="card text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blood-600 text-xl font-bold text-white">
                {s.n}
              </div>
              <h3 className="mt-4 text-lg font-bold">{s.t}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Safety */}
      <section className="container-page pb-16">
        <SafetyNotice />
      </section>
    </div>
  );
}
