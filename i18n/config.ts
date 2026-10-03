export const locales = ["th", "ja", "en", "ko", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "th";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const languages: { code: Locale; label: string; short: string }[] = [
  { code: "th", label: "ไทย", short: "TH" },
  { code: "ja", label: "日本語", short: "JA" },
  { code: "en", label: "English", short: "EN" },
  { code: "ko", label: "한국어", short: "KO" },
  { code: "zh", label: "中文", short: "ZH" },
];

export function isLocale(v: string | undefined): v is Locale {
  return !!v && (locales as readonly string[]).includes(v);
}
