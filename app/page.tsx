import Link from "next/link";
import { Logo } from "@/components/Logo";
import { CampaignStatusBadge } from "@/components/CampaignStatusBadge";
import {
  DemandBadge,
  DemoBadge,
  EmergencyNotice,
  SafetyNotice,
} from "@/components/ui";
import { campaigns } from "@/data/campaigns";
import { demandByGovernorate } from "@/data/demand";
import { BLOOD_TYPES } from "@/lib/types";
import { formatArabicDate, formatTimeRange } from "@/lib/utils";

export default function HomePage() {
  const overview = demandByGovernorate[0]; // عمّان كنظرة عامة تجريبية
  const featured = [...campaigns]
    .sort(
      (a, b) =>
        new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
    )
    .slice(0, 3);

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

      {/* Blood demand overview */}
      <section className="container-page py-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="section-title">نظرة عامة على حالة الطلب</h2>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              مؤشر مبسّط حسب فصيلة الدم (مثال: محافظة {overview.governorate}).
            </p>
          </div>
          <DemoBadge />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BLOOD_TYPES.map((bt) => (
            <div key={bt} className="card flex flex-col items-center gap-2 text-center">
              <span className="text-2xl font-extrabold text-blood-600">{bt}</span>
              <DemandBadge status={overview.statuses[bt]} />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/demand" className="text-sm font-semibold text-blood-600 hover:text-blood-700">
            عرض كل المحافظات ←
          </Link>
        </div>
      </section>

      {/* Featured campaigns */}
      <section className="border-y border-slate-200 bg-slate-50 py-14 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="container-page">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="section-title">حملات تبرع تجريبية</h2>
            <DemoBadge />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {featured.map((c) => (
              <Link key={c.id} href={`/campaigns/${c.id}`} className="card hover:border-blood-300 hover:shadow-md">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {c.governorate}
                  </span>
                  <CampaignStatusBadge campaign={c} />
                </div>
                <h3 className="mt-2 text-base font-bold">{c.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {formatArabicDate(c.startDateTime)} —{" "}
                  {formatTimeRange(c.startDateTime, c.endDateTime)}
                </p>
                <p className="mt-3 text-sm font-semibold text-blood-600">التفاصيل ←</p>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/campaigns" className="btn-secondary">عرض كل الحملات</Link>
          </div>
        </div>
      </section>

      {/* Three steps */}
      <section className="container-page py-14">
        <h2 className="section-title text-center">كيف تعمل المنصة؟</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { n: "١", t: "ابحث", d: "ابحث عن مركز تبرع أو حملة قريبة منك ضمن البيانات التجريبية." },
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
