// Outils de dessin partagés par les scripts (logo, image de partage, affichette) :
// texte converti en tracés (aucune police à installer), le K du logo, l'œuf au plat et le cœur au trait.
import { readFile } from "node:fs/promises";
import path from "node:path";
import opentype from "opentype.js";

export const ROOT = path.resolve(import.meta.dirname, "..");
// Couleurs relevées sur sa photo de profil (K magenta, « BRUNCH » prune) et charte du site.
export const C = {
  cream: "#FBF5EC",
  pink: "#F8D6E7",
  magenta: "#A9327F",
  plum: "#5B3446",
  violet: "#6B3FA0",
  violetDeep: "#4E2C78",
  egg: "#F4B63F",
  raspberry: "#D9466F",
  avocado: "#6E8B3D",
  ink: "#22201F",
  muted: "#5E5550",
};

async function load(file) {
  const buf = await readFile(path.join(ROOT, "node_modules", file));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
}

export const fonts = {
  display: await load("@fontsource/fraunces/files/fraunces-latin-500-normal.woff"),
  displaySemi: await load("@fontsource/fraunces/files/fraunces-latin-600-normal.woff"),
  text: await load("@fontsource/jost/files/jost-latin-400-normal.woff"),
  medium: await load("@fontsource/jost/files/jost-latin-500-normal.woff"),
  bold: await load("@fontsource/jost/files/jost-latin-600-normal.woff"),
};

/** Largeur d'un texte, interlettrage compris (tracking en em). */
export function width(font, text, size, tracking = 0) {
  return font.getAdvanceWidth(text, size) + tracking * size * (text.length - 1);
}

/** Texte en tracés SVG. anchor : start | middle | end. tracking en em. */
export function text(font, str, x, y, size, { fill = C.ink, anchor = "start", tracking = 0 } = {}) {
  const w = width(font, str, size, tracking);
  let cursor = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  let d = "";
  for (const ch of str) {
    d += font.getPath(ch, cursor, y, size).toPathData(2);
    cursor += font.getAdvanceWidth(ch, size) + tracking * size;
  }
  return `<path d="${d}" fill="${fill}"/>`;
}

// Le K du logo, au trait, dans une boîte 100 × 100 : un jambage arrondi et deux bras en pétale
// qui se rejoignent par une petite boucle, comme sur l'enseigne.
export const K_PATH =
  "M27 12h9a6 6 0 0 1 6 6v20c8-12 20-22 33-22 10 0 13 9 7 16-6 7-17 12-26 16 9 3 21 9 26 17 5 8-1 17-11 15-12-2-22-12-29-21v24a6 6 0 0 1-6 6h-9a6 6 0 0 1-6-6V18a6 6 0 0 1 6-6Z";
export const K_LOOP = "M56 48c-5-1-9 2-8 5 1 3 6 3 8 0 1-2 1-4 0-5Z";

export function kMark(x, y, s, { stroke = C.magenta, fill = "none", width = 5.5 } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"><path d="${K_PATH}"/><path d="${K_LOOP}" fill="none"/></g>`;
}

/** Logo complet : le K, « KRUSH » en capitales rondes, « BRUNCH » espacé. cx = centre, y = haut du K, size = hauteur de « KRUSH ». */
export function logo(cx, y, size, { mark = C.magenta, word = C.magenta, sub = C.plum } = {}) {
  const k = size * 2;
  return [
    kMark(cx - k / 2, y, k / 100, { stroke: mark }),
    text(fonts.bold, "KRUSH", cx, y + k + size * 1.3, size * 1.36, { fill: word, anchor: "middle", tracking: 0.08 }),
    text(fonts.medium, "BRUNCH", cx + size * 0.12, y + k + size * 2.2, size * 0.5, { fill: sub, anchor: "middle", tracking: 0.42 }),
  ].join("");
}

/** Petit cœur au trait (signature du site), centré en (cx, cy), largeur w. */
export function heart(cx, cy, w, { stroke = C.violet, width = 2 } = {}) {
  const s = w / 24;
  return `<g transform="translate(${cx - 12 * s} ${cy - 11 * s}) scale(${s})" fill="none" stroke="${stroke}" stroke-width="${width / s}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5C6.5 16.6 3 13.3 3 9.2 3 6.4 5.2 4.3 7.8 4.3c1.8 0 3.3 1 4.2 2.6.9-1.6 2.4-2.6 4.2-2.6 2.6 0 4.8 2.1 4.8 4.9 0 4.1-3.5 7.4-9 11.3Z"/></g>`;
}

/** Œuf au plat au trait, jaune rempli, centré en (cx, cy), largeur w. */
export function egg(cx, cy, w, { stroke = C.ink, yolk = C.egg, width = 2.2 } = {}) {
  const s = w / 100;
  return `<g transform="translate(${cx - 50 * s} ${cy - 50 * s}) scale(${s})" fill="none" stroke="${stroke}" stroke-width="${width / s}" stroke-linecap="round" stroke-linejoin="round">
<path d="M50 8c14 0 20 9 30 12s14 13 12 24-3 14 2 24-8 22-22 22-18 4-30 2S14 84 10 72s-6-16-2-28 6-20 18-26 14-10 24-10Z"/>
<circle cx="50" cy="50" r="16" fill="${yolk}"/></g>`;
}
