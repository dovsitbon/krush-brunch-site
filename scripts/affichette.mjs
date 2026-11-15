// Affichette A5 à poser sur les tables et en vitrine, avec un QR code vers le menu.
//   npm run affichette
// → print/affichette-a5.pdf (148 × 210 mm, 300 dpi) et print/affichette-a5.png (aperçu).
// L'adresse du QR code vient de data/site.json → url (+ /fr/menu) : relancez le script si le nom de domaine change.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import QRCode from "qrcode";
import { PDFDocument } from "pdf-lib";
import { ROOT, C, fonts, text, logo, heart, egg } from "./draw.mjs";

const site = JSON.parse(await readFile(path.join(ROOT, "data/site.json"), "utf8"));
const target = `${site.url}/fr/menu`;
const W = 1748;
const H = 2480;
const cx = W / 2;

// QR code dessiné en carrés (correction élevée : il reste lisible même un peu taché)
const qr = QRCode.create(target, { errorCorrectionLevel: "H" });
const n = qr.modules.size;
const QR = 500;
const cell = QR / n;
const qx = cx - QR / 2;
const qy = 1610;
let squares = "";
for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.modules.get(r, c)) squares += `<rect x="${(qx + c * cell).toFixed(2)}" y="${(qy + r * cell).toFixed(2)}" width="${(cell + 0.5).toFixed(2)}" height="${(cell + 0.5).toFixed(2)}"/>`;

const photoW = W - 240;
const photoH = 720;
const photoY = 520;
const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${photoW}" height="${photoH}"><rect width="${photoW}" height="${photoH}" rx="56" fill="#fff"/></svg>`);
const photo = await sharp(path.join(ROOT, "assets/hero/hero.jpg"))
  .rotate()
  .resize(photoW, photoH, { fit: "cover", position: "centre" })
  .composite([{ input: mask, blend: "dest-in" }])
  .png()
  .toBuffer();

const host = target.replace(/^https?:\/\//, "");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="${C.cream}"/>
${logo(cx, 110, 64)}
${text(fonts.display, "Le menu est ici", cx, photoY + photoH + 140, 92, { anchor: "middle" })}
${text(fonts.text, "Scannez pour voir la carte, les prix et la formule à 25 €", cx, photoY + photoH + 220, 40, { anchor: "middle", fill: C.muted })}
<rect x="${qx - 40}" y="${qy - 40}" width="${QR + 80}" height="${QR + 80}" rx="40" fill="#FFFFFF"/>
<g fill="${C.violetDeep}">${squares}</g>
${egg(250, qy + QR / 2, 190)}
${heart(W - 250, qy + QR / 2, 120, { width: 6 })}
${text(fonts.medium, host, cx, qy + QR + 120, 38, { anchor: "middle", fill: C.violet })}
${text(fonts.medium, "Brunch tous les jours · Halal · Sans réservation", cx, qy + QR + 200, 40, { anchor: "middle", fill: C.ink })}
${text(fonts.text, "4 rue de la Convention, Paris 15  ·  @krush_brunch", cx, qy + QR + 260, 36, { anchor: "middle", fill: C.muted })}
</svg>`;

const png = await sharp(Buffer.from(svg))
  .composite([{ input: photo, left: 120, top: photoY }])
  .png()
  .toBuffer();

await mkdir(path.join(ROOT, "print"), { recursive: true });
await sharp(png).resize({ width: 874 }).png().toFile(path.join(ROOT, "print/affichette-a5.png"));

const pdf = await PDFDocument.create();
pdf.setTitle("Krush Brunch, affichette A5");
const page = pdf.addPage([419.53, 595.28]); // A5 en points
const jpg = await pdf.embedJpg(await sharp(png).jpeg({ quality: 94 }).toBuffer());
page.drawImage(jpg, { x: 0, y: 0, width: 419.53, height: 595.28 });
await writeFile(path.join(ROOT, "print/affichette-a5.pdf"), await pdf.save());
console.log(`affichette A5 écrite, QR code → ${target}`);
