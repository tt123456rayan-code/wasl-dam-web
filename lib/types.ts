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

export interface Center {
  id: string;
  name: string;
  governorate: string;
  address: string;
  hours: string;
  services: string[];
}

export interface Campaign {
  id: string;
  title: string;
  date: string;
  time: string;
  governorate: string;
  location: string;
  organizer: string;
  demand: DemandStatus;
  neededTypes: BloodType[];
  status: "active" | "upcoming";
  description: string;
}

export interface DemandRecord {
  governorate: string;
  statuses: Record<BloodType, DemandStatus>;
}
