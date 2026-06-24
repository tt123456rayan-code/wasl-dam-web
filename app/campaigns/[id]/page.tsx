import Link from "next/link";
import { notFound } from "next/navigation";
import { CampaignInterest } from "@/components/CampaignInterest";
import { DemandBadge, DemoBadge, EligibilityNotice } from "@/components/ui";
import { campaigns } from "@/data/campaigns";
import { formatArabicDate, mapsSearchUrl } from "@/lib/utils";

export function generateStaticParams() {
  return campaigns.map((c) => ({ id: c.id }));
}

export default function CampaignDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const campaign = campaigns.find((c) => c.id === params.id);
  if (!campaign) notFound();

  return (
    <div className="container-page py-10">
      <Link href="/campaigns" className="text-sm font-semibold text-blood-600 hover:text-blood-700">
        → العودة إلى الحملات
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-3">
        <article className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {campaign.status === "active" ? "نشطة الآن" : "قادمة"}
            </span>
            <DemandBadge status={campaign.demand} />
            <DemoBadge />
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{campaign.title}</h1>
          <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">
            {campaign.description}
          </p>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Detail label="التاريخ" value={formatArabicDate(campaign.date)} />
            <Detail label="الوقت" value={campaign.time} />
            <Detail label="المحافظة" value={campaign.governorate} />
            <Detail label="الموقع" value={campaign.location} />
            <Detail label="الجهة المنظّمة" value={campaign.organizer} />
            <Detail label="الفصائل المطلوبة" value={campaign.neededTypes.join("، ")} />
          </dl>

          <div className="mt-6">
            <a
              href={mapsSearchUrl(`${campaign.location} ${campaign.governorate}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              الاتجاهات عبر خرائط Google
            </a>
          </div>
        </article>

        <aside className="space-y-4">
          <div className="card">
            <h2 className="text-base font-bold">شارك في هذه الحملة</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              سجّل نيتك للتبرع كتذكير شخصي على هذا المتصفح.
            </p>
            <div className="mt-4">
              <CampaignInterest campaignId={campaign.id} campaignTitle={campaign.title} />
            </div>
          </div>
          <EligibilityNotice />
        </aside>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold">{value}</dd>
    </div>
  );
}
