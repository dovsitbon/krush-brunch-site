import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import site from "@/data/site.json";
import { fill, getDict, isLocale, locales, ogLocale, type Dict, type Locale } from "@/lib/i18n";
import { pageJsonLd } from "@/lib/jsonld";
import { pageOfSlug, pagePath, PAGE_IDS, SLUGS, type PageId } from "@/lib/pages";
import { MenuTabs } from "@/components/MenuTabs";
import { FormulaCard } from "@/components/FormulaCard";
import { Groups, Infos, Faq } from "@/components/Sections";
import { Pic } from "@/components/Pic";
import { Heart } from "@/components/Doodles";
import { Rating } from "@/components/Rating";
import { OpenStatus } from "@/components/OpenStatus";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => PAGE_IDS.map((id) => ({ lang, slug: SLUGS[id][lang] })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const id = pageOfSlug(slug, lang);
  if (!id) return {};
  const p = getDict(lang).pages[id];
  return {
    title: { absolute: p.metaTitle },
    description: p.metaDescription,
    alternates: {
      canonical: pagePath(id, lang),
      languages: { ...Object.fromEntries(locales.map((l) => [l, pagePath(id, l)])), "x-default": pagePath(id, "fr") },
    },
    openGraph: { type: "website", url: pagePath(id, lang), siteName: site.fullName, title: p.metaTitle, description: p.metaDescription, locale: ogLocale[lang], images: [{ url: "/og.jpg", width: 1200, height: 630 }] },
    ...(id === "legal" ? { robots: { index: false, follow: true } } : {}),
  };
}

function PageHead({ d, id, children }: { d: Dict; id: PageId; children?: React.ReactNode }) {
  const p = d.pages[id] as { h1: string; intro?: string };
  return (
    <header className="mx-auto max-w-7xl px-5 pt-12 md:px-8 md:pt-20">
      <p className="eyebrow flex items-center gap-2">
        <Heart className="h-4 w-4" />
        Krush · Paris 15
      </p>
      <h1 className="display mt-3 max-w-4xl text-[2.75rem] md:text-[4.5rem]">{p.h1}</h1>
      {p.intro && <p className="lead mt-5 max-w-2xl">{p.intro}</p>}
      {children}
    </header>
  );
}

/** Pages « Brunch à Paris 15 » et « Brunch halal à Paris » : texte utile, photos, renvoi vers le menu et l'accès. */
function SeoPage({ lang, d, id, photos }: { lang: Locale; d: Dict; id: "paris15" | "halal"; photos: string[] }) {
  const p = d.pages[id];
  return (
    <>
      <PageHead d={d} id={id}>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.9375rem]">
          <Rating lang={lang} d={d} />
          <OpenStatus />
        </div>
      </PageHead>
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="space-y-10">
          {p.sections.map((s) => (
            <section key={s.h}>
              <h2 className="display text-[1.75rem] md:text-[2.25rem]">{s.h}</h2>
              {s.p.map((t) => (
                <p key={t} className="lead mt-3">
                  {t}
                </p>
              ))}
            </section>
          ))}
          <div className="flex flex-wrap gap-3">
            <Link href={pagePath("menu", lang)} className="btn">
              {d.nav.seeMenu}
            </Link>
            <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-line">
              {d.nav.directions}
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 self-start">
          {photos.map((src, i) => (
            <Pic key={src} src={src} d={d} sizes="(min-width: 1024px) 20vw, 45vw" className={`rounded-[20px] ${i === 0 ? "col-span-2 aspect-[4/3]" : "aspect-[4/5]"}`} />
          ))}
        </div>
      </div>
      <Infos lang={lang} d={d} />
    </>
  );
}

function Legal({ d }: { d: Dict }) {
  const l = d.legal;
  const todo = <span className="text-raspberry-ink">{l.toFill}</span>;
  const rows: [string, React.ReactNode][] = [
    [l.editor, <>{site.legal.company}, {site.address.street}, {site.address.postalCode} {site.address.city}</>],
    [l.siret, site.legal.siret || todo],
    [l.director, site.legal.director || todo],
    [l.host, site.legal.host],
    [l.photos, fill(l.photosText, { handle: site.instagramHandle })],
    [l.data, l.dataText],
  ];
  return (
    <>
      <PageHead d={d} id="legal" />
      <dl className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
        {rows.map(([k, v]) => (
          <div key={k} className="border-b border-line py-5">
            <dt className="font-medium">{k}</dt>
            <dd className="mt-1 text-muted">{v}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

export default async function Page({ params }: PageProps<"/[lang]/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const id = pageOfSlug(slug, lang);
  if (!id) notFound();
  const d = getDict(lang);

  let body: React.ReactNode;
  if (id === "menu")
    body = (
      <>
        <PageHead d={d} id="menu" />
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
          <MenuTabs formula={<FormulaCard lang={lang} d={d} />} />
        </div>
        <Faq lang={lang} d={d} />
      </>
    );
  else if (id === "groupes")
    body = (
      <>
        <PageHead d={d} id="groupes" />
        <div className="mt-10">
          <Groups lang={lang} d={d} withHeading={false} />
        </div>
      </>
    );
  else if (id === "paris15") body = <SeoPage lang={lang} d={d} id="paris15" photos={["/media/salle-terrasse/terrasse-assiette.jpg", "/media/sale/focaccia-avocado.jpg", "/media/sucre/brioche-carrement-vanille.jpg"]} />;
  else if (id === "halal") body = <SeoPage lang={lang} d={d} id="halal" photos={["/media/sale/korean-krush.jpg", "/media/sale/krush-pancakes.jpg", "/media/sale/moroccan-style.jpg"]} />;
  else body = <Legal d={d} />;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd(lang, id)) }} />
      {body}
    </>
  );
}
