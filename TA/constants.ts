import type { GregorianHoliday, HijriHoliday } from './types';

export const ALGERIAN_GREGORIAN_HOLIDAYS: GregorianHoliday[] = [
  { month: 1, day: 1, name: "Jour de l'an" },
  { month: 1, day: 12, name: "Yennayer (Nouvel An Amazigh)" },
  { month: 5, day: 1, name: "Fête du Travail" },
  { month: 7, day: 5, name: "Fête de l'Indépendance" },
  { month: 11, day: 1, name: "Fête de la Révolution" },
];

export const ALGERIAN_HIJRI_HOLIDAYS: HijriHoliday[] = [
  { day: 1, month: "محرم", name: "Awal Mouharram (Nouvel An Hégirien)" },
  { day: 10, month: "محرم", name: "Achoura" },
  { day: 12, month: "ربيع الأول", name: "Mawlid al-Nabi" },
  { day: 1, month: "شوال", name: "Aïd el-Fitr" },
  { day: 2, month: "شوال", name: "Aïd el-Fitr (2ème jour)" },
  { day: 10, month: "ذو الحجة", name: "Aïd el-Adha" },
  { day: 11, month: "ذو الحجة", name: "Aïd el-Adha (2ème jour)" },
];
