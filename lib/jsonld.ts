import site from "@/data/site.json";
import { getDict, locales, type Locale } from "@/lib/i18n";
import { closures, weekHours } from "@/lib/hours";
import { CATEGORIES, MAIN_FORMULA } from "@/lib/menu";
import { pagePath, type PageId } from "@/lib/pages";

const BUSINESS = `${site.url}/#restaurant`;
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function menu(lang: Locale) {
  const d = getDict(lang);
  return {
    "@type": "Menu",
    "@id": `${site.url}${pagePath("menu", lang)}#menu`,
    name: d.pages.menu.title,
    inLanguage: lang,
    hasMenuSection: [
      {
        "@type": "MenuSection",
        name: MAIN_FORMULA[lang].name,
        description: MAIN_FORMULA.courses.map((c) => c[lang]).join(" + "),
        offers: { "@type": "Offer", price: MAIN_FORMULA.price.toFixed(2), priceCurrency: "EUR" },
      },
      ...CATEGORIES.flatMap((c) =>
        c.sections.map((s) => ({
          "@type": "MenuSection",
          name: s[lang],
          hasMenuItem: s.items.map((it) => ({
            "@type": "MenuItem",
            name: it[lang].name,
            ...(it[lang].desc ? { description: it[lang].desc } : {}),
            ...(it.photo ? { image: `${site.url}${it.photo}` } : {}),
            ...(it.price !== null ? { offers: { "@type": "Offer", price: it.price.toFixed(2), priceCurrency: "EUR" } } : {}),
            ...(it.meatless ? { suitableForDiet: "https://schema.org/VegetarianDiet" } : {}),
          })),
        })),
      ),
    ],
  };
}

function business(lang: Locale) {
  const d = getDict(lang);
  return {
    "@type": "Restaurant",
    "@id": BUSINESS,
    name: "Krush Brunch",
    alternateName: ["Krush", "Krush Brunch Paris 15"],
    description: d.meta.description,
    url: `${site.url}/${lang}`,
    image: [`${site.url}/og.jpg`, `${site.url}/media/hero/hero.jpg`],
    logo: `${site.url}/icon-512.png`,
    ...(site.phoneIntl ? { telephone: site.phoneIntl } : {}),
    ...(site.email ? { email: site.email } : {}),
    priceRange: site.priceRange,
    servesCuisine: ["Brunch", "Breakfast", lang === "fr" ? "Halal" : "Halal"],
    address: { "@type": "PostalAddress", streetAddress: site.address.street, postalCode: site.address.postalCode, addressLocality: site.address.city, addressRegion: site.address.region, addressCountry: site.address.country },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.mapsUrl,
    openingHoursSpecification: [
      ...weekHours().flatMap((slots, i) => slots.map(([opens, closes]) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${DAYS[i]}`, opens, closes }))),
      // Vacances : fermé sur la période (data/horaires.json → closures)
      ...closures.map((c) => ({ "@type": "OpeningHoursSpecification", opens: "00:00", closes: "00:00", validFrom: c.from, validThrough: c.to })),
    ],
    // Note Google relevée à la main, avec sa date (data/site.json → rating.checked)
    aggregateRating: { "@type": "AggregateRating", ratingValue: site.rating.value, reviewCount: site.rating.count, bestRating: 5, worstRating: 1, dateModified: site.rating.checked },
    sameAs: [site.instagram],
    acceptsReservations: false,
    currenciesAccepted: "EUR",
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: lang === "fr" ? "Terrasse" : "Terrace", value: true },
      { "@type": "LocationFeatureSpecification", name: "Halal", value: true },
      { "@type": "LocationFeatureSpecification", name: lang === "fr" ? "Salle climatisée" : "Air conditioning", value: true },
    ],
    hasMenu: { "@id": `${site.url}${pagePath("menu", lang)}#menu` },
    makesOffer: { "@type": "Offer", name: MAIN_FORMULA[lang].name, price: MAIN_FORMULA.price.toFixed(2), priceCurrency: "EUR", description: MAIN_FORMULA[lang].when },
  };
}

const faq = (lang: Locale) => ({ "@type": "FAQPage", mainEntity: getDict(lang).faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });

/** Données structurées de l'accueil : restaurant (horaires, note Google datée), menu, FAQ. */
export function homeJsonLd(lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [{ "@type": "WebSite", "@id": `${site.url}/#website`, url: site.url, name: "Krush Brunch", inLanguage: [...locales], publisher: { "@id": BUSINESS } }, business(lang), menu(lang), faq(lang)],
  };
}

/** Données structurées d'une page secondaire, plus fil d'Ariane. */
export function pageJsonLd(lang: Locale, id: PageId) {
  const d = getDict(lang);
  return {
    "@context": "https://schema.org",
    "@graph": [
      business(lang),
      ...(id === "menu" ? [menu(lang), faq(lang)] : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Krush Brunch", item: `${site.url}/${lang}` },
          { "@type": "ListItem", position: 2, name: d.pages[id].title, item: `${site.url}${pagePath(id, lang)}` },
        ],
      },
    ],
  };
}
