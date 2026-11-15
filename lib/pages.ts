import type { Locale } from "@/lib/locales";

// Pages secondaires et leurs adresses dans chaque langue.
export const PAGE_IDS = ["menu", "groupes", "paris15", "halal", "legal"] as const;
export type PageId = (typeof PAGE_IDS)[number];

export const SLUGS: Record<PageId, Record<Locale, string>> = {
  menu: { fr: "menu", en: "menu" },
  groupes: { fr: "groupes-privatisation", en: "groups-private-hire" },
  paris15: { fr: "brunch-paris-15", en: "brunch-paris-15" },
  halal: { fr: "brunch-halal-paris", en: "halal-brunch-paris" },
  legal: { fr: "mentions-legales", en: "legal" },
};

export const pagePath = (id: PageId, lang: Locale) => `/${lang}/${SLUGS[id][lang]}`;

export const pageOfSlug = (slug: string, lang: Locale) => PAGE_IDS.find((id) => SLUGS[id][lang] === slug) ?? null;
