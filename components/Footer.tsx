import Link from "next/link";
import site from "@/data/site.json";
import { Logo } from "@/components/Logo";
import { InstagramIcon } from "@/components/icons";
import { LangSwitch } from "@/components/LangSwitch";
import { formatTime } from "@/lib/format";
import { weekHours } from "@/lib/hours";
import type { Dict, Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/pages";

export function Footer({ lang, d }: { lang: Locale; d: Dict }) {
  const w = weekHours();
  const slot = (s: string[][]) => s.map(([a, b]) => `${formatTime(a, lang)} – ${formatTime(b, lang)}`).join(", ");
  const links = [
    { href: pagePath("menu", lang), label: d.pages.menu.title },
    { href: pagePath("groupes", lang), label: d.pages.groupes.title },
    { href: pagePath("paris15", lang), label: d.pages.paris15.title },
    { href: pagePath("halal", lang), label: d.pages.halal.title },
  ];
  return (
    <footer className="bg-violet-deep text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:px-8 md:py-16">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-pink">{d.footer.tagline}</p>
        </div>
        <div>
          <h2 className="text-[0.9375rem] font-medium text-pink">{d.infos.address}</h2>
          <address className="mt-3 not-italic leading-relaxed">
            {site.address.street}
            <br />
            {site.address.postalCode} {site.address.city}
          </address>
          <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="link-line mt-3 inline-flex min-h-11 items-center !decoration-pink/60">
            {d.nav.directions}
          </a>
        </div>
        <div>
          <h2 className="text-[0.9375rem] font-medium text-pink">{d.footer.hours}</h2>
          <p className="mt-3 leading-relaxed">
            {d.footer.weekdays}
            <br />
            <span className="tabular-nums">{slot(w[0])}</span>
          </p>
          <p className="mt-2 leading-relaxed">
            {d.footer.weekend}
            <br />
            <span className="tabular-nums">{slot(w[5])}</span>
          </p>
        </div>
        <div>
          <h2 className="text-[0.9375rem] font-medium text-pink">{d.footer.pages}</h2>
          <ul className="mt-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-10 items-center hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/15">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 text-[0.875rem] md:px-8">
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 hover:underline">
            <InstagramIcon className="h-5 w-5" />
            {site.instagramHandle}
          </a>
          <div className="flex items-center gap-6">
            <Link href={pagePath("legal", lang)} className="inline-flex min-h-11 items-center hover:underline">
              {d.footer.legal}
            </Link>
            <LangSwitch lang={lang} label={d.nav.lang} />
          </div>
          <p className="w-full text-paper/70 md:w-auto">
            © {new Date().getFullYear()} {d.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
