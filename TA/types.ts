
export interface Holiday {
  name: string;
}

export interface GregorianHoliday extends Holiday {
  month: number; // 1-12
  day: number; // 1-31
}

export interface HijriHoliday extends Holiday {
  month: string; // Arabic month name
  day: number; // 1-30
}
