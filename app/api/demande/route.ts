import { Resend } from "resend";
import site from "@/data/site.json";
import { groupText, parseGroup } from "@/lib/requests";
import { fill, getDict, isLocale, type Locale } from "@/lib/i18n";

// Demande de groupe ou de privatisation, envoyée par e-mail (Resend) :
//  1. notification au restaurant (en français, avec la langue du client) ;
//  2. confirmation au client, dans sa langue.
// Variables Vercel : RESEND_API_KEY, NOTIFY_EMAIL (adresse du restaurant), RESEND_FROM (domaine vérifié dans Resend,
// ex. « Krush Brunch <groupes@mondomaine.fr> » ; sans domaine vérifié, Resend n'envoie qu'à l'adresse du compte).
// Sans ces variables, la route répond { notified: false } et le site propose d'envoyer la demande par Instagram.
// Si le gérant donne un portable (data/site.json → whatsapp), le formulaire ouvre WhatsApp à la place (côté client).

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function html(title: string, text: string) {
  const body = escapeHtml(text)
    .split("\n\n")
    .map((p) => `<p style="margin:0 0 18px">${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
  return `<div style="background:#FBF5EC;padding:32px 16px"><div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;border-top:6px solid #6B3FA0;padding:32px 28px;font-family:Helvetica,Arial,sans-serif;color:#22201F;font-size:15px;line-height:1.65">
<p style="margin:0 0 6px;font-size:13px;color:#A9327F;font-weight:bold">Krush Brunch · Paris 15</p>
<h1 style="margin:0 0 24px;font-family:Georgia,serif;font-weight:normal;font-size:26px;color:#4E2C78">${escapeHtml(title)}</h1>${body}
<p style="margin:24px 0 0;font-size:13px;color:#5E5550">4 rue de la Convention, 75015 Paris · ${site.instagramHandle}</p></div></div>`;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  // Champ piège : rempli seulement par les robots
  if (typeof body.website === "string" && body.website) return Response.json({ ok: true, notified: true, confirmed: false });
  const lang: Locale = typeof body.lang === "string" && isLocale(body.lang) ? body.lang : "fr";
  const g = parseGroup(body.data);
  if (!g) return Response.json({ ok: false }, { status: 400 });

  const fr = getDict("fr");
  const d = getDict(lang);
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!key || !to) return Response.json({ ok: true, notified: false, confirmed: false });

  const resend = new Resend(key);
  const from = process.env.RESEND_FROM ?? "Krush Brunch <onboarding@resend.dev>";
  const text = groupText(g, "fr", fr) + (lang === "fr" ? "" : `\n\n${fr.groups.mail.lang} : ${lang.toUpperCase()}`);

  let notified = false;
  let confirmed = false;
  try {
    const r = await resend.emails.send({
      from,
      to,
      replyTo: g.email,
      subject: `${fr.groups.mail.subject} · ${g.name} · ${g.day} · ${g.guests} pers.`,
      html: html(fr.groups.mail.title, text),
      text,
    });
    notified = !r.error;
  } catch {}

  if (notified) {
    const m = d.groups.mail;
    const ctext = `${fill(m.confirmIntro, { name: g.name })}\n\n${groupText(g, lang, d, false)}\n\n${m.confirmOutro}`;
    try {
      const r = await resend.emails.send({ from, to: g.email, replyTo: to, subject: m.confirmSubject, html: html(m.confirmSubject, ctext), text: ctext });
      confirmed = !r.error;
    } catch {}
  }
  return Response.json({ ok: true, notified, confirmed });
}
