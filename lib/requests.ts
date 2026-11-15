import site from "@/data/site.json";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { formatDay, formatTime, isoDay } from "@/lib/format";
import { addDays } from "@/lib/hours";

// La seule demande du site : groupe ou privatisation (le restaurant fonctionne sans réservation de table).

export const OCCASIONS = ["birthday", "evjf", "company", "other"] as const;
export type Occasion = (typeof OCCASIONS)[number];

export type Group = { day: string; time: string; guests: number; occasion: Occasion; budget: string; name: string; phone: string; email: string; message: string };

export const isPhone = (v: string) => /^[+\d][\d\s\-().]{7,19}$/.test(v.trim());
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export const groupMaxDay = (now: Date) => addDays(isoDay(now), site.groups.daysAhead);

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function parseGroup(v: unknown, now = new Date()): Group | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const day = str(o.day, 10);
  const time = str(o.time, 5);
  const guests = Math.round(Number(o.guests) || 0);
  const g: Group = {
    day,
    time,
    guests,
    occasion: OCCASIONS.includes(o.occasion as Occasion) ? (o.occasion as Occasion) : "other",
    budget: str(o.budget, 40),
    name: str(o.name, 120),
    phone: str(o.phone, 30),
    email: str(o.email, 160),
    message: str(o.message, 1500),
  };
  if (!ISO.test(day) || day < isoDay(now) || day > groupMaxDay(now) || !TIME.test(time)) return null;
  if (guests < 2 || guests > site.groups.maxGuests || !g.name || !isPhone(g.phone) || !isEmail(g.email)) return null;
  return g;
}

const colon = (lang: Locale) => (lang === "fr" ? " :" : ":");

/** Le récapitulatif de la demande, en texte (e-mail, WhatsApp, écran de confirmation). */
export function groupText(g: Group, lang: Locale, d: Dict, withContact = true) {
  const m = d.groups.mail;
  const c = colon(lang);
  const lines = [
    `${m.date}${c} ${formatDay(g.day, lang, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}, ${formatTime(g.time, lang)}`,
    `${m.guests}${c} ${g.guests}`,
    `${m.occasion}${c} ${d.groups.occasions[g.occasion]}`,
    g.budget ? `${m.budget}${c} ${g.budget}` : "",
  ].filter(Boolean);
  const contact = [`${m.name}${c} ${g.name}`, `${m.phone}${c} ${g.phone}`, `${m.email}${c} ${g.email}`];
  return [lines.join("\n"), withContact ? contact.join("\n") : "", g.message ? `${m.message}${c}\n${g.message}` : ""].filter(Boolean).join("\n\n");
}

/** Lien WhatsApp (vide tant que le restaurant n'a pas donné de portable : data/site.json → whatsapp). */
export const waLink = (text: string) => (site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}` : "");
