// Logo de Krush, redessiné d'après sa photo de profil Instagram (assets/raw/krush_logo.jpg) :
// un K au trait aux bras arrondis, « KRUSH » en capitales rondes magenta, « BRUNCH » espacé en prune.
//   npm run logo
// → public/logo.svg (fond clair), public/logo-clair.svg (fond sombre), public/logo-k.svg (le K seul),
//   app/icon.svg (favicon), app/apple-icon.png (180 px), public/icon-512.png.
// Pour mettre son fichier d'origine : remplacez public/logo.svg (même nom) ; le site l'affiche tel quel.
import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { ROOT, C, logo, kMark } from "./draw.mjs";

const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>\n`;

await writeFile(path.join(ROOT, "public/logo.svg"), svg(300, 250, logo(150, 8, 44)));
await writeFile(path.join(ROOT, "public/logo-clair.svg"), svg(300, 250, logo(150, 8, 44, { mark: C.cream, word: C.cream, sub: C.pink })));
await writeFile(path.join(ROOT, "public/logo-k.svg"), svg(100, 100, kMark(4, 4, 0.92)));

// Favicon : le K magenta sur le rose de son profil
const mark = (size) => svg(size, size, `<g transform="scale(${size / 100})"><rect width="100" height="100" rx="22" fill="${C.pink}"/>${kMark(16, 15, 0.7, { width: 8.5 })}</g>`);
await writeFile(path.join(ROOT, "app/icon.svg"), mark(100));
await sharp(Buffer.from(mark(512))).resize(180, 180).flatten({ background: C.pink }).png().toFile(path.join(ROOT, "app/apple-icon.png"));
await sharp(Buffer.from(mark(512))).png().toFile(path.join(ROOT, "public/icon-512.png"));

// Aperçu à comparer avec l'original
await sharp(Buffer.from(svg(300, 250, `<rect width="300" height="250" fill="${C.pink}"/>${logo(150, 8, 44)}`)))
  .png()
  .toFile(path.join(ROOT, "assets/logo-apercu.png"));
console.log("logo.svg, logo-clair.svg, logo-k.svg, icon.svg, apple-icon.png, icon-512.png écrits");
