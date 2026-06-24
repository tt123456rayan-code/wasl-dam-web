export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export const BLOOD_TYPES: BloodType[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export type DemandStatus = "available" | "needed" | "urgent";

export const DEMAND_LABELS: Record<DemandStatus, string> = {
  available: "متوفر",
  needed: "بحاجة دعم",
  urgent: "احتياج عاجل",
};

// كل محافظات الأردن الـ 12 — مصدر موحّد لكل الفلاتر والنماذج
export const GOVERNORATES: string[] = [
  "عمّان",
  "إربد",
  "الزرقاء",
  "البلقاء",
  "المفرق",
  "الكرك",
  "معان",
  "العقبة",
  "جرش",
  "عجلون",
  "مادبا",
  "الطفيلة",
];

// حالة الحملة تُحسب تلقائيًا من تاريخ البداية والنهاية
export type CampaignStatus = "upcoming" | "active" | "ended";

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  upcoming: "قادمة",
  active: "نشطة الآن",
  ended: "منتهية",
};

export interface Center {
  id: string;
  name: string;
  governorate: string;
  /** نوع المرفق (بنك دم وطني / مستشفى حكومي / مستشفى جامعي ...) */
  kind: string;
  /** ملاحظة/إرشاد للمستخدم */
  note: string;
  /** عبارة البحث على خرائط Google للوصول للموقع الحقيقي والمحدّث */
  mapsQuery: string;
}

export interface Campaign {
  id: string;
  title: string;
  /** وقت البداية بصيغة ISO */
  startDateTime: string;
  /** وقت النهاية بصيغة ISO */
  endDateTime: string;
  governorate: string;
  location: string;
  organizer: string;
  demand: DemandStatus;
  neededTypes: BloodType[];
  description: string;
  source: string;
  lastUpdated: string;
}

export interface DemandRecord {
  governorate: string;
  statuses: Record<BloodType, DemandStatus>;
}
