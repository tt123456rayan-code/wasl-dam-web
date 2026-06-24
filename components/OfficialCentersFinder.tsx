import { OFFICIAL_SOURCES } from "@/data/official";
import { GOVERNORATES } from "@/lib/types";
import { mapsSearchUrl } from "@/lib/utils";

// أداة للعثور على مراكز التبرع الحقيقية عبر مصادر حية ورسمية.
// لا نخزّن عناوين/أرقام مراكز حقيقية لتفادي عرض معلومات قد تكون قديمة أو غير دقيقة؛
// بدلًا من ذلك نفتح نتائج حيّة على خرائط Google + روابط المصدر الرسمي.
export function OfficialCentersFinder() {
  return (
    <section className="rounded-2xl border border-blood-200 bg-blood-50/60 p-5 dark:border-blood-500/30 dark:bg-blood-500/5">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-bold">ابحث عن مراكز التبرع الحقيقية</h2>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-blood-700 ring-1 ring-blood-600/20 dark:bg-slate-900 dark:text-blood-300">
          نتائج حيّة
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        هذه المنصة نموذج غير رسمي وغير تابع لوزارة الصحة. للعثور على أقرب مركز تبرع
        حقيقي، استخدم البحث المباشر على الخريطة أو راجع المصدر الرسمي، وتأكّد من
        العنوان وساعات العمل من المركز مباشرةً قبل التوجّه.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={mapsSearchUrl(OFFICIAL_SOURCES.searchTerm)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          أقرب مركز تبرع على الخريطة
        </a>
        <a
          href={mapsSearchUrl(OFFICIAL_SOURCES.nationalBloodBankName)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          بنك الدم الوطني (عمّان)
        </a>
        <a
          href={OFFICIAL_SOURCES.mohWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          الموقع الرسمي لوزارة الصحة
        </a>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          البحث الحي حسب المحافظة:
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {GOVERNORATES.map((g) => (
            <a
              key={g}
              href={mapsSearchUrl(`${OFFICIAL_SOURCES.searchTerm} ${g}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-center text-sm font-medium text-slate-700 transition hover:border-blood-300 hover:text-blood-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-blood-300"
            >
              {g}
            </a>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        في الحالات الطارئة لا تعتمد على هذه المنصة؛ تواصل مباشرةً مع المستشفى أو
        قنوات بنك الدم الرسمية.
      </p>
    </section>
  );
}
