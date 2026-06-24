import { PageHeader } from "@/components/ui";
import { RealCampaignsFinder } from "@/components/RealCampaignsFinder";

export default function CampaignsPage() {
  return (
    <div>
      <PageHeader
        title="حملات التبرع"
        subtitle="حملات التبرع أحداث مؤقتة تُعلَن عبر القنوات الرسمية والإخبارية. استخدم المصادر الحيّة أدناه للعثور على الحملات الحقيقية الحالية والتأكد من تفاصيلها."
      />
      <div className="container-page py-8">
        <RealCampaignsFinder />
      </div>
    </div>
  );
}
