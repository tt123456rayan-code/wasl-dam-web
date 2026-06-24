import type { Campaign } from "@/lib/types";

// بيانات تجريبية فقط — حملات خيالية لأغراض العرض
export const campaigns: Campaign[] = [
  {
    id: "camp-1",
    title: "حملة تبرع تجريبية — جامعة النموذج",
    date: "2026-07-05",
    time: "10:00 ص - 3:00 م",
    governorate: "عمّان",
    location: "قاعة الأنشطة، جامعة النموذج التجريبية",
    organizer: "نادي تطوعي تجريبي",
    demand: "urgent",
    neededTypes: ["O-", "O+", "A-"],
    status: "upcoming",
    description:
      "حملة توعوية وتشجيعية للتبرع بالدم ضمن أسبوع التطوع الجامعي. بيانات تجريبية لأغراض العرض فقط.",
  },
  {
    id: "camp-2",
    title: "حملة تبرع تجريبية — مركز شبابي",
    date: "2026-06-28",
    time: "9:00 ص - 1:00 م",
    governorate: "إربد",
    location: "المركز الشبابي التجريبي، إربد",
    organizer: "فريق شبابي تجريبي",
    demand: "needed",
    neededTypes: ["B+", "AB+"],
    status: "active",
    description:
      "مبادرة شبابية لرفع الوعي حول أهمية التبرع المنتظم بالدم. بيانات تجريبية لأغراض العرض فقط.",
  },
  {
    id: "camp-3",
    title: "حملة تبرع تجريبية — مجمع تجاري",
    date: "2026-07-12",
    time: "11:00 ص - 6:00 م",
    governorate: "الزرقاء",
    location: "ساحة فعاليات تجريبية، الزرقاء",
    organizer: "مبادرة مجتمعية تجريبية",
    demand: "available",
    neededTypes: ["A+", "B+"],
    status: "upcoming",
    description:
      "نقطة تبرع مؤقتة لتسهيل وصول المتبرعين خلال عطلة نهاية الأسبوع. بيانات تجريبية لأغراض العرض فقط.",
  },
  {
    id: "camp-4",
    title: "حملة تبرع تجريبية — مستشفى تعليمي",
    date: "2026-06-30",
    time: "8:00 ص - 2:00 م",
    governorate: "عمّان",
    location: "بهو الزوار، مرفق تجريبي",
    organizer: "فريق توعية تجريبي",
    demand: "urgent",
    neededTypes: ["O-", "AB-"],
    status: "active",
    description:
      "حملة لدعم الاحتياج المتزايد خلال فترة الصيف. بيانات تجريبية لأغراض العرض فقط.",
  },
  {
    id: "camp-5",
    title: "حملة تبرع تجريبية — بلدية",
    date: "2026-07-20",
    time: "10:00 ص - 4:00 م",
    governorate: "الكرك",
    location: "قاعة البلدية التجريبية، الكرك",
    organizer: "لجنة مجتمعية تجريبية",
    demand: "needed",
    neededTypes: ["A+", "O+"],
    status: "upcoming",
    description:
      "فعالية مجتمعية لتشجيع التبرع الدوري بالدم. بيانات تجريبية لأغراض العرض فقط.",
  },
];
