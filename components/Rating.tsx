import site from "@/data/site.json";
import { fill, intlLocale, type Dict, type Locale } from "@/lib/i18n";
import { InstagramIcon, StarIcon } from "@/components/icons";

/** Note Google relevée à la main (data/site.json → rating), avec un lien vers la fiche. */
export function Rating({ lang, d, className = "" }: { lang: Locale; d: Dict; className?: string }) {
  const value = new Intl.NumberFormat(intlLocale[lang], { minimumFractionDigits: 1 }).format(site.rating.value);
  return (
    <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-6 items-center gap-2 hover:underline ${className}`} aria-label={fill(d.rating.aria, { value, count: site.rating.count })}>
      <StarIcon className="h-4 w-4 text-egg" />
      <span>
        <span className="font-medium">{fill(d.rating.label, { value })}</span>
        <span className="opacity-80"> · {fill(d.rating.count, { count: site.rating.count })}</span>
      </span>
    </a>
  );
}

/** Abonnés Instagram, arrondis au millier inférieur (« 13 000 abonnés »). */
export function Followers({ lang, d, className = "" }: { lang: Locale; d: Dict; className?: string }) {
  const n = new Intl.NumberFormat(intlLocale[lang]).format(Math.floor(site.followers.value / 1000) * 1000);
  return (
    <a href={site.instagram} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-6 items-center gap-2 hover:underline ${className}`}>
      <InstagramIcon className="h-4 w-4" />
      <span className="font-medium">{fill(d.rating.followers, { n })}</span>
    </a>
  );
}
