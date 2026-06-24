import { OFFICIAL_SOURCES } from "@/data/official";
import { GOVERNORATES } from "@/lib/types";
import { mapsSearchUrl } from "@/lib/utils";

// عبارات بحث للحملات الحقيقية
const CAMPAIGN_TERM = "حملة تبرع بالدم";
const newsSearchUrl = (q: string) =>
  `https://www.google.com/search?q=${encodeURIComponent(q)}`;

// أداة للعثور على حملات التبرع الحقيقية عبر مصادر حيّة ورسمية بدلًا من قائمة ثابتة.
export function RealCampaignsFinder() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-blood-200 bg-blood-50/60 p-5 dark:border-blood-500/30 dark:bg-blood-500/5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold">ابحث عن حملات التبرع الحقيقية</h2>
          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-blood-700 ring-1 ring-blood-600/20 dark:bg-slate-900 dark:text-blood-300">
            نتائج حيّة
          </span>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          حملات التبرع أحداث مؤقتة بتاريخ ومكان محددين، وتُعلَن عبر القنوات الرسمية
          والإخبارية. لذلك لا نعرض قائمة ثابتة قد تصبح قديمة؛ استخدم المصادر الحيّة
          أدناه، وتأكّد دائمًا من التاريخ والوقت والمكان من الجهة المنظِّمة قبل التوجّه.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={newsSearchUrl(`${CAMPAIGN_TERM} الأردن`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            أحدث الحملات (بحث مباشر)
          </a>
          <a
            href="https://petra.gov.jo"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            وكالة الأنباء الأردنية (بترا)
          </a>
          <a
            href={OFFICIAL_SOURCES.mohWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            الموقع الرسمي لوزارة الصحة
          </a>
          <a
            href={mapsSearchUrl(OFFICIAL_SOURCES.nationalBloodBankName)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            بنك الدم الوطني (عمّان)
          </a>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            بحث الحملات حسب المحافظة:
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {GOVERNORATES.map((g) => (
              <a
                key={g}
                href={newsSearchUrl(`${CAMPAIGN_TERM} ${g}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-center text-sm font-medium text-slate-700 transition hover:border-blood-300 hover:text-blood-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-blood-300"
              >
                {g}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
        هذا النموذج غير رسمي وغير تابع لوزارة الصحة. لا نضمن دقة أو حداثة أي حملة، ولا
        نربط المتبرعين بالمرضى. في الطوارئ لا تعتمد على المنصة؛ تواصل مباشرةً مع
        المستشفى أو بنك الدم الرسمي.
      </section>
    </div>
  );
}
