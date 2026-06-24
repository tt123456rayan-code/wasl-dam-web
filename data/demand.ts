import type { BloodType, DemandRecord, DemandStatus } from "@/lib/types";

// بيانات تجريبية فقط — حالة الطلب لأغراض العرض ولا تمثل مخزونًا حقيقيًا
const s = (
  ap: DemandStatus,
  an: DemandStatus,
  bp: DemandStatus,
  bn: DemandStatus,
  abp: DemandStatus,
  abn: DemandStatus,
  op: DemandStatus,
  on: DemandStatus
): Record<BloodType, DemandStatus> => ({
  "A+": ap,
  "A-": an,
  "B+": bp,
  "B-": bn,
  "AB+": abp,
  "AB-": abn,
  "O+": op,
  "O-": on,
});

export const demandByGovernorate: DemandRecord[] = [
  {
    governorate: "عمّان",
    statuses: s(
      "available",
      "needed",
      "available",
      "needed",
      "available",
      "urgent",
      "needed",
      "urgent"
    ),
  },
  {
    governorate: "إربد",
    statuses: s(
      "needed",
      "urgent",
      "available",
      "needed",
      "available",
      "needed",
      "available",
      "urgent"
    ),
  },
  {
    governorate: "الزرقاء",
    statuses: s(
      "available",
      "needed",
      "needed",
      "urgent",
      "available",
      "available",
      "needed",
      "needed"
    ),
  },
  {
    governorate: "الكرك",
    statuses: s(
      "needed",
      "needed",
      "available",
      "available",
      "available",
      "urgent",
      "needed",
      "urgent"
    ),
  },
  {
    governorate: "العقبة",
    statuses: s(
      "available",
      "available",
      "available",
      "needed",
      "needed",
      "needed",
      "available",
      "needed"
    ),
  },
];

// الطابع الزمني التجريبي لآخر تحديث (عرض فقط)
export const demandLastUpdated = "2026-06-24T09:00:00+03:00";
