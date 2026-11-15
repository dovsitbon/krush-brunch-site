// CONTENU.md : tous les textes du site et le menu, en français et en anglais, pour relecture et validation.
//   npm run contenu
// Le fichier est régénéré à partir de locales/*.json et de data/*.json : corrigez les textes dans ces fichiers,
// pas dans CONTENU.md.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ROOT } from "./draw.mjs";

const json = async (f) => JSON.parse(await readFile(path.join(ROOT, f), "utf8"));
const [fr, en, menu, formules, site, horaires, annonces] = await Promise.all(["locales/fr.json", "locales/en.json", "data/menu.json", "data/formules.json", "data/site.json", "data/horaires.json", "data/annonces.json"].map(json));

const out = [];
const h = (n, t) => out.push("", `${"#".repeat(n)} ${t}`, "");
const pair = (label, a, b) => out.push(`- **${label}**`, `  - FR : ${a}`, `  - EN : ${b}`);
const TODO = "**À REMPLIR**";
const eur = (n) => (n === null ? TODO : `${n.toFixed(2).replace(".", ",")} €`);
const byId = Object.fromEntries(menu.categories.flatMap((c) => c.sections.flatMap((s) => s.items)).map((i) => [i.id, i]));

out.push(
  "# Krush Brunch : contenu du site",
  "",
  "Tous les textes et le menu, pour validation. Ce qui est marqué « À REMPLIR » manque encore : voir INFOS-A-DEMANDER.md.",
  "",
  `Relevé le ${menu.checked} à partir de son Instagram (@krush_brunch : 156 publications et la story à la une « MENU ») et de sa fiche Google (${site.rating.value}/5, ${site.rating.count} avis).`,
);

h(2, "Titre du hero : trois options");
out.push(
  "1. **Le brunch, tous les jours** (retenue : c'est ce qui le distingue des brunchs du dimanche, et c'est sa bio « Brunch everyday »)",
  "2. Brunchez sans attendre le week-end",
  "3. Sucré, salé, Krush",
);

h(2, "Référencement");
pair("Titre de l'accueil", fr.meta.title, en.meta.title);
pair("Description", fr.meta.description, en.meta.description);
for (const id of Object.keys(fr.pages)) pair(`Page « ${fr.pages[id].title} »`, `${fr.pages[id].metaTitle} — ${fr.pages[id].metaDescription}`, `${en.pages[id].metaTitle} — ${en.pages[id].metaDescription}`);

h(2, "Bandeau du haut (refermable)");
pair("Message par défaut", annonces.default.fr, annonces.default.en);
for (const c of horaires.closures) pair(`Fermeture du ${c.from} au ${c.to} (s'affiche 14 jours avant)`, c.fr, c.en);

h(2, "Hero");
for (const k of ["eyebrow", "title", "sub"]) pair(k, fr.hero[k], en.hero[k]);
out.push("", `Sous les boutons : ${site.rating.value}/5 sur Google (${site.rating.count} avis), ${Math.floor(site.followers.value / 1000) * 1000} abonnés sur Instagram, statut « Ouvert maintenant / Fermé » calculé en direct.`);

h(2, "Tuiles et services");
for (const k of Object.keys(fr.tiles.items)) pair("Tuile", `${fr.tiles.items[k].label} — ${fr.tiles.items[k].sub}`, `${en.tiles.items[k].label} — ${en.tiles.items[k].sub}`);
fr.services.items.forEach((s, i) => pair("Service", `${s.title} — ${s.text}`, `${en.services.items[i].title} — ${en.services.items[i].text}`));

h(2, "La formule à 25 €");
for (const k of ["title", "text"]) pair(k, fr.formule[k], en.formule[k]);
for (const f of formules.items) {
  out.push("", `**${f.fr.name} : ${eur(f.price)}** — ${f.fr.when}. ${f.fr.note}`);
  for (const c of f.courses) out.push(`- ${c.fr} : ${c.choices ? c.choices.map((id) => byId[id]?.fr.name ?? id).join(" ou ") : c.text.fr}`);
}
out.push("", `Autres formules (enfant, groupe…) : ${TODO} si elles existent, dans \`data/formules.json\`.`);

h(2, "Le menu");
out.push(`Relevé sur la story « MENU ». Les prix des boissons étaient écrits très petit : **à confirmer**. ${menu.garnish.fr}`);
for (const c of menu.categories) {
  for (const s of c.sections) {
    h(3, `${s.fr} / ${s.en}`);
    out.push("| Plat | Description | Dish | Description | Prix | Formule |", "|---|---|---|---|---|---|");
    for (const it of s.items) {
      const tags = [it.signature && "incontournable", it.meatless && "sans viande"].filter(Boolean).join(", ");
      out.push(`| ${it.fr.name}${tags ? ` _(${tags})_` : ""} | ${it.fr.desc} | ${it.en.name} | ${it.en.desc} | ${eur(it.price)} | ${it.formula ? "oui" : ""} |`);
    }
  }
}
out.push("", "Plats vus sur Instagram mais absents de la story « MENU » (non affichés, à confirmer) : Krush Habibi (kunefe, pistache), gaufre Black & White, New-yorkais (pastrami), lattes popcorn, barbe à papa et matcha au lait d'avoine, chocolat viennois, pancakes des tropiques.");

h(2, "Les trois blocs");
for (const k of Object.keys(fr.blocks)) pair(fr.blocks[k].title, `${fr.blocks[k].text}`, `${en.blocks[k].title} — ${en.blocks[k].text}`);

h(2, "Groupes et privatisation (à confirmer avec Krush)");
pair("Titre", fr.groups.title, en.groups.title);
pair("Introduction", fr.groups.intro, en.groups.intro);
pair("Rappel", fr.groups.noBooking, en.groups.noBooking);
fr.groups.kinds.forEach((k, i) => pair(k.title, k.text, `${en.groups.kinds[i].title} — ${en.groups.kinds[i].text}`));
pair("Message de fin (e-mail branché)", fr.groups.done.text, en.groups.done.text);
pair("Message de fin (e-mail pas encore branché)", fr.groups.done.noMail, en.groups.done.noMail);
out.push("", `Le formulaire demande : date, heure, nombre de personnes (2 à ${site.groups.maxGuests}), occasion, budget par personne (facultatif), nom, téléphone, e-mail, message.`);

h(2, "Avis");
pair("Texte", fr.reviews.text, en.reviews.text);
out.push("", `Vrais avis clients : ${TODO} dans \`data/avis.json\`, avec son accord (par exemple trois avis Google). Aucun avis n'est inventé : en attendant, trois emplacements vides.`);

h(2, "Infos pratiques");
out.push(`- Adresse : ${site.address.street}, ${site.address.postalCode} ${site.address.city}`, `- Instagram : ${site.instagram}`, `- Téléphone : ${site.phone || `${TODO} (aucun numéro public)`}`, `- E-mail : ${site.email || TODO}`, `- Moyens de paiement : ${site.paymentMethods.fr || TODO}`, "- Horaires :");
fr.infos.days.forEach((d, i) => out.push(`  - ${d} : ${(horaires.week[String(i + 1)] ?? []).map(([a, b]) => `${a} – ${b}`).join(", ") || "fermé"}`));
pair("Accès", fr.infos.accessText, en.infos.accessText);
pair("Le week-end", fr.infos.waitText, en.infos.waitText);

h(2, "FAQ");
fr.faq.items.forEach((f, i) => pair(f.q, f.a, `${en.faq.items[i].q} — ${en.faq.items[i].a}`));
out.push("", `Chaises hautes et poussettes : ${TODO} (la réponse renvoie pour l'instant vers Instagram).`);

h(2, "Pages « Brunch à Paris 15 » et « Brunch halal à Paris »");
for (const id of ["paris15", "halal"]) {
  h(3, fr.pages[id].h1);
  pair("Introduction", fr.pages[id].intro, en.pages[id].intro);
  fr.pages[id].sections.forEach((s, i) => pair(s.h, s.p.join(" "), `${en.pages[id].sections[i].h} — ${en.pages[id].sections[i].p.join(" ")}`));
}

await writeFile(path.join(ROOT, "CONTENU.md"), out.join("\n") + "\n");
console.log(`CONTENU.md écrit (${out.length} lignes)`);
