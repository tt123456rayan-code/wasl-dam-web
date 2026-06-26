// قائمة المنشآت الطبية في الأردن التي قد يتوفر فيها تبرع بالدم، مقسّمة حسب المحافظة.
// المصدر: قائمة مستشفيات الأردن (ويكيبيديا / وزارة الصحة الأردنية / جمعية المستشفيات الخاصة).
// ملاحظة: لا ندّعي أن كل هذه المنشآت تقبل التبرع بالدم؛ على صاحب الطلب التأكد.

export interface Hospital {
  name: string;
  governorate: string;
  type: "حكومي" | "عسكري" | "جامعي" | "خاص" | "خيري";
}

export const hospitals: Hospital[] = [
  // ===== عمّان =====
  { name: "بنك الدم الوطني", governorate: "عمّان", type: "حكومي" },
  { name: "مستشفى البشير", governorate: "عمّان", type: "حكومي" },
  { name: "مستشفى الأمير حمزة", governorate: "عمّان", type: "حكومي" },
  { name: "مستشفى الدكتور جميل التوتنجي", governorate: "عمّان", type: "حكومي" },
  { name: "مدينة الحسين الطبية", governorate: "عمّان", type: "عسكري" },
  { name: "مستشفى الملكة علياء العسكري", governorate: "عمّان", type: "عسكري" },
  { name: "مستشفى الجامعة الأردنية", governorate: "عمّان", type: "جامعي" },
  { name: "مركز الحسين للسرطان", governorate: "عمّان", type: "خيري" },
  { name: "المستشفى الإسلامي — العبدلي", governorate: "عمّان", type: "خاص" },
  { name: "مركز الخالدي الطبي", governorate: "عمّان", type: "خاص" },
  { name: "المركز العربي الطبي", governorate: "عمّان", type: "خاص" },
  { name: "المستشفى التخصصي", governorate: "عمّان", type: "خاص" },
  { name: "مستشفى الأردن", governorate: "عمّان", type: "خاص" },
  { name: "مستشفى ابن الهيثم", governorate: "عمّان", type: "خاص" },
  { name: "مستشفى الإسراء", governorate: "عمّان", type: "خاص" },
  { name: "مستشفى الاستقلال", governorate: "عمّان", type: "خاص" },
  { name: "مستشفى الاستشاري", governorate: "عمّان", type: "خاص" },
  { name: "مستشفى الشميساني", governorate: "عمّان", type: "خاص" },
  { name: "مستشفى القدس", governorate: "عمّان", type: "خاص" },
  { name: "مستشفى لوزميلا", governorate: "عمّان", type: "خاص" },
  { name: "مستشفى فلسطين", governorate: "عمّان", type: "خاص" },
  { name: "مستشفى الجاردنز", governorate: "عمّان", type: "خاص" },
  { name: "مستشفى تلاع العلي", governorate: "عمّان", type: "خاص" },
  { name: "مستشفى عمان الجراحي", governorate: "عمّان", type: "خاص" },
  { name: "مستشفى فيلادلفيا", governorate: "عمّان", type: "خاص" },
  { name: "المستشفى الأهلي — عمان", governorate: "عمّان", type: "خاص" },
  { name: "مستشفى الهلال الأحمر الأردني", governorate: "عمّان", type: "خيري" },
  { name: "مركز العبدلي الطبي", governorate: "عمّان", type: "خاص" },

  // ===== إربد =====
  { name: "مستشفى الملك المؤسس عبدالله الجامعي", governorate: "إربد", type: "جامعي" },
  { name: "مستشفى الأميرة بديعة التعليمي", governorate: "إربد", type: "حكومي" },
  { name: "مستشفى الأميرة بسمة", governorate: "إربد", type: "حكومي" },
  { name: "مستشفى الأميرة رحمة", governorate: "إربد", type: "حكومي" },
  { name: "مستشفى الأميرة راية", governorate: "إربد", type: "حكومي" },
  { name: "مستشفى أبو عبيدة", governorate: "إربد", type: "حكومي" },
  { name: "مستشفى الرمثا", governorate: "إربد", type: "حكومي" },
  { name: "مستشفى اليرموك", governorate: "إربد", type: "حكومي" },
  { name: "مستشفى معاذ بن جبل", governorate: "إربد", type: "حكومي" },
  { name: "مستشفى الأمير راشد بن الحسن العسكري", governorate: "إربد", type: "عسكري" },
  { name: "مستشفى إربد التخصصي", governorate: "إربد", type: "خاص" },
  { name: "مستشفى إربد الإسلامي", governorate: "إربد", type: "خاص" },
  { name: "مستشفى راهبات الوردية", governorate: "إربد", type: "خاص" },
  { name: "مستشفى ابن النفيس", governorate: "إربد", type: "خاص" },
  { name: "مستشفى القواسمي", governorate: "إربد", type: "خاص" },
  { name: "مستشفى النجاح", governorate: "إربد", type: "خاص" },

  // ===== الزرقاء =====
  { name: "مستشفى الأمير فيصل بن الحسين", governorate: "الزرقاء", type: "حكومي" },
  { name: "مستشفى الزرقاء الحكومي الجديد", governorate: "الزرقاء", type: "حكومي" },
  { name: "مستشفى الأمير هاشم بن الحسين العسكري", governorate: "الزرقاء", type: "عسكري" },
  { name: "مستشفى الحكمة الحديث", governorate: "الزرقاء", type: "خاص" },
  { name: "مستشفى الرازي الجديد", governorate: "الزرقاء", type: "خاص" },
  { name: "مستشفى الزرقاء الوطني", governorate: "الزرقاء", type: "خاص" },
  { name: "مستشفى جبل الزيتون", governorate: "الزرقاء", type: "خاص" },
  { name: "مستشفى قصر شبيب", governorate: "الزرقاء", type: "خاص" },
  { name: "مستشفى الضليل", governorate: "الزرقاء", type: "خاص" },

  // ===== البلقاء =====
  { name: "مستشفى السلط الحكومي الجديد", governorate: "البلقاء", type: "حكومي" },
  { name: "مستشفى الأمير الحسين بن عبدالله الثاني", governorate: "البلقاء", type: "حكومي" },
  { name: "مستشفى الشونة الجنوبية", governorate: "البلقاء", type: "حكومي" },

  // ===== المفرق =====
  { name: "مستشفى المفرق الحكومي", governorate: "المفرق", type: "حكومي" },
  { name: "مستشفى الرويشد", governorate: "المفرق", type: "حكومي" },
  { name: "مستشفى الملك طلال العسكري", governorate: "المفرق", type: "عسكري" },
  { name: "مستشفى سارة التخصصي", governorate: "المفرق", type: "خاص" },

  // ===== الكرك =====
  { name: "مستشفى الكرك الحكومي", governorate: "الكرك", type: "حكومي" },
  { name: "مستشفى غور الصافي", governorate: "الكرك", type: "حكومي" },
  { name: "مستشفى الأمير علي بن الحسين العسكري", governorate: "الكرك", type: "عسكري" },
  { name: "المستشفى الإيطالي — الكرك", governorate: "الكرك", type: "خاص" },
  { name: "مستشفى السلام", governorate: "الكرك", type: "خاص" },

  // ===== معان =====
  { name: "مستشفى معان الحكومي", governorate: "معان", type: "حكومي" },
  { name: "مستشفى الملكة رانيا", governorate: "معان", type: "حكومي" },

  // ===== العقبة =====
  { name: "مستشفى الأمير هاشم العسكري — العقبة", governorate: "العقبة", type: "عسكري" },
  { name: "مستشفى العقبة الحديث", governorate: "العقبة", type: "خاص" },
  { name: "المستشفى الإسلامي — العقبة", governorate: "العقبة", type: "خاص" },
  { name: "مستشفى الأميرة سلمى", governorate: "العقبة", type: "حكومي" },

  // ===== جرش =====
  { name: "مستشفى جرش الحكومي", governorate: "جرش", type: "حكومي" },
  { name: "مستشفى الأميرة هيا العسكري", governorate: "جرش", type: "عسكري" },
  { name: "مستشفى الصفاء التخصصي", governorate: "جرش", type: "خاص" },

  // ===== عجلون =====
  { name: "مستشفى الإيمان الحكومي — عجلون", governorate: "عجلون", type: "حكومي" },

  // ===== مادبا =====
  { name: "مستشفى النديم", governorate: "مادبا", type: "حكومي" },
  { name: "مستشفى المحبة", governorate: "مادبا", type: "خاص" },

  // ===== الطفيلة =====
  { name: "مستشفى الأمير زيد بن الحسين الحكومي", governorate: "الطفيلة", type: "حكومي" },
];

// مجموعة حسب المحافظة (للفلاتر)
export function hospitalsByGovernorate(gov: string): Hospital[] {
  return hospitals.filter((h) => h.governorate === gov);
}

export function allGovernoratesWithHospitals(): string[] {
  return Array.from(new Set(hospitals.map((h) => h.governorate)));
}
