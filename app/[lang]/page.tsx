import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/lib/i18n";
import { homeJsonLd } from "@/lib/jsonld";
import { Blocks, Faq, Formula, Gallery, Groups, Heading, Hero, Infos, Reviews, Services, Tiles } from "@/components/Sections";
import { MenuTabs } from "@/components/MenuTabs";
import { FormulaCard } from "@/components/FormulaCard";

export const revalidate = 3600;

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd(lang)) }} />
      <Hero lang={lang} d={d} />
      <Tiles lang={lang} d={d} />
      <Services lang={lang} d={d} />
      <Formula lang={lang} d={d} />
      <section id="menu" aria-labelledby="menu-title" className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <Heading eyebrow={d.menu.eyebrow} title={d.menu.title} id="menu-title">
          <p className="lead mt-4 max-w-2xl">{d.menu.intro}</p>
        </Heading>
        <div className="mt-10">
          <MenuTabs limit={4} formula={<FormulaCard lang={lang} d={d} />} />
        </div>
      </section>
      <Blocks lang={lang} d={d} />
      <Groups lang={lang} d={d} />
      <Gallery lang={lang} d={d} />
      <Reviews lang={lang} d={d} />
      <Infos lang={lang} d={d} />
      <Faq lang={lang} d={d} />
    </>
  );
}
