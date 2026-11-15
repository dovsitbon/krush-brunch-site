// Photos du site.
//   npm run media
//
// 1. Prépare pour le web toutes les photos de assets/<dossier>/ dans public/media/<dossier>/
//    (next/image sert ensuite AVIF/WebP à la bonne taille) et note leurs dimensions dans data/media-sizes.json.
// 2. Fabrique l'image de partage public/og.jpg (1200 × 630).
//
// Pour ajouter une photo prise sur place : déposez-la sous le nom attendu (voir assets/A-PHOTOGRAPHIER.md),
// par ex. assets/salle-terrasse/terrasse.jpg, puis relancez « npm run media » : le dessin qui tenait la place disparaît.
// assets/raw/ : images brutes d'Instagram (non publiées telles quelles), triées dans les dossiers ci-dessus.
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { ROOT, C, fonts, text, logo, heart } from "./draw.mjs";

const CATS = ["hero", "sale", "sucre", "boissons", "salle-terrasse", "galerie"];

const sizes = {};
await rm(path.join(ROOT, "public/media"), { recursive: true, force: true });
for (const cat of CATS) {
  const dir = path.join(ROOT, "assets", cat);
  await mkdir(dir, { recursive: true });
  await mkdir(path.join(ROOT, "public/media", cat), { recursive: true });
  for (const f of (await readdir(dir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))) {
    const name = f.replace(/\.\w+$/, "").toLowerCase();
    const max = cat === "hero" ? 2400 : 1600;
    const info = await sharp(path.join(dir, f))
      .rotate()
      .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(path.join(ROOT, "public/media", cat, `${name}.jpg`));
    sizes[`/media/${cat}/${name}.jpg`] = [info.width, info.height];
  }
}
await writeFile(path.join(ROOT, "data/media-sizes.json"), JSON.stringify(sizes, null, 1) + "\n");

// Image de partage : à droite la table vue de dessus, à gauche le logo et l'essentiel
const right = await sharp(path.join(ROOT, "assets/hero/hero.jpg")).rotate().resize(560, 630, { fit: "cover", position: "centre" }).toBuffer();
const left = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="630">
${logo(320, 70, 40)}
${heart(320, 372, 26)}
${text(fonts.display, "Le brunch, tous les jours", 320, 448, 44, { anchor: "middle" })}
${text(fonts.text, "Halal · Sans réservation · Formule 25 €", 320, 500, 24, { anchor: "middle", fill: C.muted })}
${text(fonts.text, "4 rue de la Convention · Paris 15", 320, 538, 24, { anchor: "middle", fill: C.muted })}
</svg>`);
await sharp({ create: { width: 1200, height: 630, channels: 3, background: C.cream } })
  .composite([
    { input: right, left: 640, top: 0 },
    { input: left, left: 0, top: 0 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(ROOT, "public/og.jpg"));

console.log(`${Object.keys(sizes).length} photos prêtes, og.jpg écrit`);
