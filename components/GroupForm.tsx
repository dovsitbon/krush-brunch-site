"use client";

import { useEffect, useState, type FormEvent } from "react";
import site from "@/data/site.json";
import { useLocale } from "@/components/providers";
import { Heart } from "@/components/Doodles";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { fill } from "@/lib/i18n";
import { isoDay } from "@/lib/format";
import { groupMaxDay, groupText, isEmail, isPhone, OCCASIONS, waLink, type Group, type Occasion } from "@/lib/requests";

type Errors = Partial<Record<keyof Group, string>>;
type Done = { mode: "mail" | "nomail" | "wa"; text: string };

// Heures proposées : pendant les heures d'ouverture les plus larges (9 h – 16 h 30), toutes les 30 minutes.
const TIMES = Array.from({ length: 16 }, (_, i) => `${String(9 + Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`);
const DM = `https://ig.me/m/${site.instagramHandle.replace("@", "")}`;

/**
 * Demande de groupe ou de privatisation (à confirmer avec le restaurant).
 * 1. Si un portable WhatsApp est renseigné (data/site.json → whatsapp) : WhatsApp s'ouvre avec la demande.
 * 2. Sinon : /api/demande l'envoie par e-mail (Resend) au restaurant, avec une confirmation au client.
 * 3. Si l'e-mail n'est pas encore branché : le texte est copié et le client l'envoie sur Instagram.
 */
export function GroupForm() {
  const { lang, d } = useLocale();
  const f = d.groups.form;
  const [today, setToday] = useState("");
  const [g, setG] = useState<Group>({ day: "", time: "11:00", guests: 8, occasion: "birthday", budget: "", name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const [copied, setCopied] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- date du navigateur, connue seulement après hydratation
  useEffect(() => setToday(isoDay(new Date())), []);

  const set = <K extends keyof Group>(k: K, v: Group[K]) => {
    setG((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!g.day || g.day < today || g.day > groupMaxDay(new Date())) e.day = f.errors.day;
    if (!g.time) e.time = f.errors.time;
    if (!(g.guests >= 2 && g.guests <= site.groups.maxGuests)) e.guests = fill(f.errors.guests, { max: site.groups.maxGuests });
    if (!g.name.trim()) e.name = f.errors.required;
    if (!isPhone(g.phone)) e.phone = g.phone.trim() ? f.errors.phone : f.errors.required;
    if (!isEmail(g.email)) e.email = g.email.trim() ? f.errors.email : f.errors.required;
    return e;
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {}
  };

  const submit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setFailed(false);
    const first = Object.keys(e)[0];
    if (first) {
      document.getElementById(`g-${first}`)?.focus();
      return;
    }
    const text = `${d.groups.mail.title} · Krush\n\n${groupText(g, lang, d)}`;
    if (site.whatsapp) {
      window.open(waLink(text), "_blank", "noopener");
      setDone({ mode: "wa", text });
      return;
    }
    setSending(true);
    try {
      const website = (ev.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
      const r = await fetch("/api/demande", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ lang, data: g, website }) });
      const j = (await r.json()) as { ok: boolean; notified?: boolean };
      if (!j.ok) throw new Error();
      if (j.notified) setDone({ mode: "mail", text });
      else {
        setDone({ mode: "nomail", text });
        void copy(text);
      }
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  if (done)
    return (
      <div className="rounded-[28px] bg-paper p-6 md:p-10" role="status">
        <Heart className="h-8 w-8 text-violet" />
        <h3 className="display mt-4 text-[2rem]">{d.groups.done.title}</h3>
        <p className="mt-3 max-w-xl text-muted">{done.mode === "mail" ? d.groups.done.text : done.mode === "wa" ? d.groups.done.wa : d.groups.done.noMail}</p>
        <pre className="mt-6 max-h-72 overflow-auto rounded-2xl bg-cream p-4 font-[family-name:var(--font-body)] text-[0.9375rem] whitespace-pre-wrap">{done.text}</pre>
        <div className="mt-6 flex flex-wrap gap-3">
          {done.mode === "nomail" && (
            <>
              <a href={DM} target="_blank" rel="noopener noreferrer" className="btn">
                <InstagramIcon className="h-5 w-5" />
                {d.groups.done.insta}
              </a>
              <button type="button" className="btn-line" onClick={() => copy(done.text)}>
                {copied ? d.groups.done.copied : d.groups.done.copy}
              </button>
            </>
          )}
          {done.mode === "wa" && (
            <a href={waLink(done.text)} target="_blank" rel="noopener noreferrer" className="btn">
              <WhatsAppIcon className="h-5 w-5" />
              {d.groups.done.waCta}
            </a>
          )}
          <button
            type="button"
            className="btn-line"
            onClick={() => {
              setDone(null);
              setCopied(false);
            }}
          >
            {d.groups.done.again}
          </button>
        </div>
      </div>
    );

  const err = (k: keyof Group) =>
    errors[k] ? (
      <p id={`g-${k}-err`} aria-live="polite" className="mt-1.5 text-[0.875rem] text-raspberry-ink">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof Group) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `g-${k}-err` : undefined });

  return (
    <form onSubmit={submit} noValidate className="rounded-[28px] bg-paper p-6 md:p-10">
      <h3 className="display text-[1.75rem]">{f.title}</h3>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="g-day" className="label">
            {f.day}
          </label>
          <input id="g-day" name="day" type="date" className="field" min={today} max={today ? groupMaxDay(new Date()) : undefined} value={g.day} onChange={(e) => set("day", e.target.value)} required {...aria("day")} />
          {err("day")}
        </div>
        <div>
          <label htmlFor="g-time" className="label">
            {f.time}
          </label>
          <select id="g-time" name="time" className="field" value={g.time} onChange={(e) => set("time", e.target.value)} {...aria("time")}>
            {TIMES.map((t) => (
              <option key={t} value={t}>
                {lang === "fr" ? t.replace(":", " h ") : t}
              </option>
            ))}
          </select>
          {err("time")}
        </div>
        <div>
          <label htmlFor="g-guests" className="label">
            {f.guests}
          </label>
          <input id="g-guests" name="guests" type="number" inputMode="numeric" min={2} max={site.groups.maxGuests} className="field tabular-nums" value={g.guests || ""} onChange={(e) => set("guests", Number(e.target.value))} required {...aria("guests")} />
          {err("guests")}
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className="label">{f.occasion}</legend>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((o) => (
            <label key={o} className="chip">
              <input type="radio" name="occasion" value={o} checked={g.occasion === o} onChange={() => set("occasion", o as Occasion)} className="sr-only" />
              {d.groups.occasions[o]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="g-budget" className="label">
            {f.budget} <span className="font-normal text-muted">({f.optional})</span>
          </label>
          <input id="g-budget" name="budget" className="field" placeholder={f.budgetPh} autoComplete="off" value={g.budget} onChange={(e) => set("budget", e.target.value)} />
        </div>
        <div>
          <label htmlFor="g-name" className="label">
            {f.name}
          </label>
          <input id="g-name" name="name" className="field" autoComplete="name" value={g.name} onChange={(e) => set("name", e.target.value)} required {...aria("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="g-phone" className="label">
            {f.phone}
          </label>
          <input id="g-phone" name="phone" type="tel" className="field" autoComplete="tel" inputMode="tel" value={g.phone} onChange={(e) => set("phone", e.target.value)} required {...aria("phone")} />
          {err("phone")}
        </div>
        <div>
          <label htmlFor="g-email" className="label">
            {f.email}
          </label>
          <input id="g-email" name="email" type="email" spellCheck={false} className="field" autoComplete="email" value={g.email} onChange={(e) => set("email", e.target.value)} required {...aria("email")} />
          {err("email")}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="g-message" className="label">
          {f.message} <span className="font-normal text-muted">({f.optional})</span>
        </label>
        <textarea id="g-message" name="message" className="field" placeholder={f.messagePh} value={g.message} onChange={(e) => set("message", e.target.value)} />
      </div>

      {/* Champ piège pour les robots, invisible pour les personnes */}
      <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="g-website">Website</label>
        <input id="g-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {failed && (
        <p className="mt-5 rounded-2xl bg-pink-soft p-4 text-[0.9375rem]" role="alert">
          {f.errors.generic}
        </p>
      )}
      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button type="submit" className="btn" disabled={sending}>
          {site.whatsapp && <WhatsAppIcon className="h-5 w-5" />}
          {sending ? f.sending : f.submit}
        </button>
        <p className="text-[0.875rem] text-muted">{f.privacy}</p>
      </div>
    </form>
  );
}
