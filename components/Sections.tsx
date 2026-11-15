import Link from "next/link";
import site from "@/data/site.json";
import avis from "@/data/avis.json";
import { Pic } from "@/components/Pic";
import { Reveal } from "@/components/Reveal";
import { Rating, Followers } from "@/components/Rating";
import { OpenStatus } from "@/components/OpenStatus";
import { HoursTable } from "@/components/HoursTable";
import { FormulaCard } from "@/components/FormulaCard";
import { GroupForm } from "@/components/GroupForm";
import { Croissant, Cup, Egg, Heart, NoCalendar, Parasol, Seal, Sun } from "@/components/Doodles";
import { InstagramIcon, PinIcon, StarIcon } from "@/components/icons";
import { fill, intlLocale, type Dict, type Locale } from "@/lib/i18n";
import { imgsIn } from "@/lib/media";
import { pagePath } from "@/lib/pages";

type S = { lang: Locale; d: Dict };

/** Titre de section : petite ligne violette, grand titre Fraunces. */
export function Heading({ eyebrow, title, id, className = "", children }: { eyebrow: string; title: string; id?: string; className?: string; children?: React.ReactNode }) {
  return (
    <div className={className}>
      <p className="eyebrow flex items-center gap-2">
        <Heart className="h-4 w-4" />
        {eyebrow}
      </p>
      <h2 id={id} className="display mt-3 text-[2.25rem] md:text-[3.25rem]">
        {title}
      </h2>
      {children}
    </div>
  );
}

/* 3. Hero plein écran : la table vue de dessus, deux boutons, la note Google, les abonnés et le statut en direct. */
export function Hero({ lang, d }: S) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[calc(100svh-6.5rem)] flex-col justify-end overflow-hidden md:min-h-[calc(100svh-7.5rem)]">
      <Pic src="/media/hero/hero.jpg" d={d} alt={d.hero.alt} sizes="100vw" priority className="!absolute inset-0 -z-20" position="center 40%" />
      {/* Voile neutre en bas à gauche, pour lire le texte sur la photo */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(24,16,22,0.78)_0%,rgba(24,16,22,0.45)_38%,rgba(24,16,22,0)_70%)] md:bg-[linear-gradient(to_right,rgba(24,16,22,0.72)_0%,rgba(24,16,22,0.35)_45%,rgba(24,16,22,0)_70%)]" />
      <div className="mx-auto w-full max-w-7xl px-5 pt-32 pb-10 text-paper md:px-8 md:pb-16">
        <div className="rise max-w-2xl">
          <p className="sign text-pink">{d.hero.eyebrow}</p>
          <h1 id="hero-title" className="display mt-4 text-[3.25rem] md:text-[5.5rem]">
            {d.hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-[1.125rem] leading-relaxed text-paper/90">{d.hero.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={pagePath("menu", lang)} className="btn-light">
              {d.nav.seeMenu}
            </Link>
            <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-line text-paper hover:!border-paper hover:!bg-paper hover:!text-violet-deep">
              <PinIcon />
              {d.nav.directions}
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.9375rem]">
            <Rating lang={lang} d={d} />
            <Followers lang={lang} d={d} />
            <OpenStatus />
          </div>
        </div>
      </div>
    </section>
  );
}

/* 4. Tuiles de catégories en capitales sur photo, juste après le hero. */
export function Tiles({ lang, d }: S) {
  const menu = pagePath("menu", lang);
  const t = d.tiles.items;
  const tiles = [
    { id: "formule", href: `/${lang}#formule`, src: "/media/hero/hero-table.jpg", pos: "center", ...t.formule },
    { id: "sale", href: `${menu}#sale`, src: "/media/sale/egg-muffin.jpg", pos: "center", ...t.sale },
    { id: "sucre", href: `${menu}#sucre`, src: "/media/sucre/pancakes-fruits-rouges.jpg", pos: "center", ...t.sucre },
    { id: "boissons", href: `${menu}#boissons`, src: "/media/boissons/latte-popcorn.jpg", pos: "center 30%", ...t.boissons },
    { id: "cookies", href: `${menu}#sucre`, src: "/media/sucre/cookie.jpg", pos: "center 60%", ...t.cookies },
  ];
  return (
    <section aria-labelledby="tiles-title" className="mx-auto max-w-7xl px-4 pt-4 md:px-8 md:pt-8">
      <h2 id="tiles-title" className="sr-only">
        {d.tiles.title}
      </h2>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
        {tiles.map((x, i) => (
          <Reveal as="li" key={x.id} delay={i * 0.05} className={i === 0 ? "col-span-2 md:col-span-1" : ""}>
            <Link href={x.href} className="group relative block overflow-hidden rounded-[20px]">
              <Pic src={x.src} d={d} sizes="(min-width: 768px) 20vw, 50vw" position={x.pos} className={`${i === 0 ? "aspect-[16/9]" : "aspect-[4/5]"} md:aspect-[3/4]`} />
              <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(24,16,22,0.7),rgba(24,16,22,0)_55%)]" />
              <span className="absolute inset-x-4 bottom-4 text-paper">
                <span className="sign block !text-[0.8125rem] !tracking-[0.14em] md:!text-[0.875rem]">{x.label}</span>
                <span className="mt-1 block text-[0.875rem] leading-snug text-paper/85">{x.sub}</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

/* 5. Bande de services en 4 pictos. */
export function Services({ d }: S) {
  const icons = { everyday: Sun, halal: Seal, nobooking: NoCalendar, terrace: Parasol } as const;
  return (
    <section aria-labelledby="services-title" className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <h2 id="services-title" className="sr-only">
        {d.services.title}
      </h2>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
        {d.services.items.map((s) => {
          const Icon = icons[s.id as keyof typeof icons];
          return (
            <li key={s.id} className="flex flex-col items-start">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-pink text-violet-deep">
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="display mt-4 text-[1.375rem] md:text-[1.5rem]">{s.title}</h3>
              <p className="mt-1 text-[0.9375rem] leading-snug text-muted">{s.text}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* 6. La formule à 25 € mise en avant. */
export function Formula({ lang, d }: S) {
  return (
    <section id="formule" aria-labelledby="formule-title" className="bg-paper py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <Heading eyebrow={d.formule.eyebrow} title={d.formule.title} id="formule-title">
            <p className="lead mt-5 max-w-md">{d.formule.text}</p>
          </Heading>
          <Pic src="/media/hero/hero-table.jpg" d={d} sizes="(min-width: 1024px) 34vw, 90vw" className="mt-8 hidden aspect-[5/4] rounded-[28px] lg:block" />
          <Link href={pagePath("menu", lang)} className="btn mt-8">
            {d.formule.cta}
          </Link>
        </div>
        <Reveal>
          <FormulaCard lang={lang} d={d} />
        </Reveal>
      </div>
    </section>
  );
}

/* 8. Trois blocs alternés : photo, texte court, un seul bouton. */
export function Blocks({ lang, d }: S) {
  const blocks = [
    { id: "sale", src: "/media/sale/focaccia-avocado.jpg", cta: d.nav.seeMenu, href: `${pagePath("menu", lang)}#sale`, ext: false, Doodle: Egg },
    { id: "sucre", src: "/media/sucre/brioche-carrement-vanille.jpg", cta: d.nav.seeMenu, href: `${pagePath("menu", lang)}#sucre`, ext: false, Doodle: Croissant },
    { id: "terrasse", src: "/media/salle-terrasse/facade.jpg", cta: d.nav.directions, href: site.directionsUrl, ext: true, Doodle: Cup },
  ] as const;
  return (
    <section aria-label={d.blocks.sale.eyebrow} className="mx-auto max-w-7xl space-y-16 px-5 py-16 md:space-y-24 md:px-8 md:py-24">
      {blocks.map((b, i) => {
        const t = d.blocks[b.id];
        return (
          <article key={b.id} className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
            <Reveal className={i % 2 ? "md:order-2" : ""}>
              <Pic src={b.src} d={d} alt={t.alt} sizes="(min-width: 768px) 45vw, 92vw" position={b.id === "terrasse" ? "center 35%" : "center"} className="aspect-[4/5] rounded-[28px] md:aspect-[5/6]" />
            </Reveal>
            <div className="max-w-md">
              <b.Doodle className="h-12 w-12 text-ink" />
              <p className="eyebrow mt-5">{t.eyebrow}</p>
              <h2 className="display mt-2 text-[2.25rem] md:text-[3rem]">{t.title}</h2>
              <p className="lead mt-4">{t.text}</p>
              {b.ext ? (
                <a href={b.href} target="_blank" rel="noopener noreferrer" className="btn mt-7">
                  <PinIcon />
                  {b.cta}
                </a>
              ) : (
                <Link href={b.href} className="btn mt-7">
                  {b.cta}
                </Link>
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}

/* 9. Groupes et privatisation (à confirmer avec le restaurant), avec le formulaire. */
export function Groups({ d, withHeading = true }: S & { withHeading?: boolean }) {
  return (
    <section id="groupes" aria-labelledby="groupes-title" className="bg-pink-soft py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          {withHeading ? (
            <Heading eyebrow={d.groups.eyebrow} title={d.groups.title} id="groupes-title" />
          ) : (
            <h2 id="groupes-title" className="display text-[2.25rem] md:text-[3rem]">
              {d.groups.title}
            </h2>
          )}
          <p className="lead mt-5">{d.groups.intro}</p>
          <ul className="mt-8 space-y-5">
            {d.groups.kinds.map((k) => (
              <li key={k.id} className="border-t border-[#ecc6d8] pt-5">
                <h3 className="display text-[1.375rem]">{k.title}</h3>
                <p className="mt-1 text-[0.9375rem] text-muted">{k.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 rounded-2xl bg-paper p-4 text-[0.9375rem] leading-snug">{d.groups.noBooking}</p>
        </div>
        <GroupForm />
      </div>
    </section>
  );
}

/* 10. Galerie Instagram : 9 photos récentes et un lien vers le compte. */
export function Gallery({ d }: S) {
  const imgs = imgsIn("galerie").slice(0, 9);
  return (
    <section aria-labelledby="galerie-title" className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Heading eyebrow={d.gallery.eyebrow} title={d.gallery.title} id="galerie-title" />
        <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn-line">
          <InstagramIcon className="h-5 w-5" />
          {fill(d.gallery.cta, { handle: site.instagramHandle })}
        </a>
      </div>
      <ul className="mt-10 grid grid-cols-3 gap-2 md:gap-4">
        {imgs.map((i) => (
          <li key={i.src}>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-xl md:rounded-[20px]">
              <Pic src={i.src} d={d} sizes="(min-width: 768px) 30vw, 32vw" className="aspect-square" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* 11. Avis : emplacements à remplir avec de vrais avis clients (data/avis.json), aucun avis inventé. */
export function Reviews({ lang, d }: S) {
  const value = new Intl.NumberFormat(intlLocale[lang], { minimumFractionDigits: 1 }).format(site.rating.value);
  const items = avis.items as { name: string; date: string; source: string; rating: number; fr: string; en: string }[];
  return (
    <section aria-labelledby="avis-title" className="bg-violet-deep py-16 text-paper md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="flex items-center gap-2 text-[0.9375rem] font-medium text-pink">
          <Heart className="h-4 w-4" />
          {d.reviews.eyebrow}
        </p>
        <h2 id="avis-title" className="display mt-3 text-[2.25rem] md:text-[3.25rem]">
          {fill(d.reviews.title, { value, count: site.rating.count })}
        </h2>
        <p className="mt-5 max-w-2xl text-[1.125rem] leading-relaxed text-paper/85">{d.reviews.text}</p>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {items.length
            ? items.slice(0, 3).map((r) => (
                <li key={r.name + r.date} className="rounded-[20px] bg-paper/10 p-6">
                  <p className="flex gap-0.5 text-egg" aria-label={`${r.rating}/5`}>
                    {Array.from({ length: r.rating }, (_, k) => (
                      <StarIcon key={k} className="h-4 w-4" />
                    ))}
                  </p>
                  <blockquote className="mt-4 leading-relaxed">{r[lang]}</blockquote>
                  <p className="mt-4 text-[0.875rem] text-paper/70">
                    {r.name} · {r.source}
                  </p>
                </li>
              ))
            : [1, 2, 3].map((k) => (
                <li key={k} className="flex min-h-40 flex-col justify-between rounded-[20px] border border-dashed border-paper/30 p-6 text-paper/70">
                  <span dangerouslySetInnerHTML={{ __html: "<!-- À REMPLIR avec de vrais avis clients (data/avis.json) -->" }} />
                  <Heart className="h-5 w-5 text-pink" />
                  <p className="text-[0.9375rem]">{d.reviews.slot}</p>
                </li>
              ))}
        </ul>
        <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-light mt-10">
          <StarIcon className="h-4 w-4 text-egg" />
          {d.reviews.cta}
        </a>
      </div>
    </section>
  );
}

/* 12. Infos pratiques : adresse, plan, métro, horaires, sans réservation, conseil pour le week-end. */
export function Infos({ lang, d }: S) {
  const pay = (site as { paymentMethods?: Record<Locale, string> }).paymentMethods?.[lang];
  return (
    <section id="infos" aria-labelledby="infos-title" className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      <Heading eyebrow={d.infos.eyebrow} title={d.infos.title} id="infos-title" />
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="font-medium">{d.infos.address}</h3>
            <address className="mt-2 not-italic text-muted">
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
            </address>
            <OpenStatus className="mt-3 text-[0.9375rem]" />
          </div>
          <div>
            <h3 className="font-medium">{d.infos.access}</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{d.infos.accessText}</p>
          </div>
          <div className="sm:col-span-2">
            <h3 className="font-medium">{d.infos.hours}</h3>
            <div className="mt-2">
              <HoursTable lang={lang} d={d} />
            </div>
          </div>
          <div className="rounded-[20px] bg-pink-soft p-5">
            <h3 className="flex items-center gap-2 font-medium">
              <NoCalendar className="h-5 w-5 text-violet" />
              {d.infos.noBooking}
            </h3>
            <p className="mt-1.5 text-[0.9375rem] leading-snug text-muted">{d.infos.noBookingText}</p>
          </div>
          <div className="rounded-[20px] bg-pink-soft p-5">
            <h3 className="flex items-center gap-2 font-medium">
              <Sun className="h-5 w-5 text-violet" />
              {d.infos.wait}
            </h3>
            <p className="mt-1.5 text-[0.9375rem] leading-snug text-muted">{d.infos.waitText}</p>
          </div>
          {pay ? (
            <div className="sm:col-span-2">
              <h3 className="font-medium">{d.infos.payment}</h3>
              <p className="mt-1.5 text-[0.9375rem] text-muted">{pay}</p>
            </div>
          ) : (
            <span hidden dangerouslySetInnerHTML={{ __html: "<!-- À REMPLIR : moyens de paiement (data/site.json → paymentMethods) -->" }} />
          )}
          <div className="sm:col-span-2">
            <h3 className="font-medium">{d.infos.contact}</h3>
            <p className="mt-1.5 text-[0.9375rem] text-muted">{d.infos.contactText}</p>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="link-line mt-2 inline-flex min-h-11 items-center gap-2 font-medium">
              <InstagramIcon className="h-5 w-5" />
              {site.instagramHandle}
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-[28px] bg-cream-deep">
            <iframe title={d.infos.map} src={site.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="aspect-[4/3] w-full border-0 lg:aspect-[5/4]" />
          </div>
          <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn self-start">
            <PinIcon />
            {d.nav.directions}
          </a>
        </div>
      </div>
    </section>
  );
}

/* 13. FAQ. */
export function Faq({ d }: S) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-paper py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Heading eyebrow={d.faq.eyebrow} title={d.faq.title} id="faq-title" />
        <div className="border-t border-line">
          {d.faq.items.map((f) => (
            <details key={f.q} className="group border-b border-line">
              <summary className="flex min-h-16 items-center justify-between gap-6 py-4 text-[1.125rem] font-medium">
                {f.q}
                <span className="faq-plus flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-soft text-violet" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="pb-5 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
