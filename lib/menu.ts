import menu from "@/data/menu.json";
import formules from "@/data/formules.json";
import type { Locale } from "@/lib/locales";

// La carte (data/menu.json) et les formules (data/formules.json), typées.

export type Text = { name: string; desc: string };
export type Item = { id: string; price: number | null; photo?: string; formula?: boolean; signature?: boolean; meatless?: boolean; fr: Text; en: Text };
export type Section = { id: string; fr: string; en: string; items: Item[] };
export type CategoryId = "sale" | "sucre" | "boissons";
export type Category = { id: CategoryId; sections: Section[] };

export const CATEGORIES = menu.categories as Category[];
export const GARNISH = menu.garnish as Record<Locale, string>;

const all = new Map<string, Item>(CATEGORIES.flatMap((c) => c.sections.flatMap((s) => s.items.map((i) => [i.id, i] as const))));
export const itemById = (id: string) => all.get(id) ?? null;
export const allItems = () => [...all.values()];

export type Course = { id: string; fr: string; en: string; choices?: string[]; text?: Record<Locale, string> };
export type Formula = { id: string; price: number; fr: { name: string; when: string; note: string }; en: { name: string; when: string; note: string }; courses: Course[] };
export const FORMULAS = formules.items as Formula[];
export const MAIN_FORMULA = FORMULAS[0];
