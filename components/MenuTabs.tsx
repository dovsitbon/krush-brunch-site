"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocale } from "@/components/providers";
import { Heart } from "@/components/Doodles";
import { CATEGORIES, GARNISH, type Item } from "@/lib/menu";
import { price } from "@/lib/format";
import { altOf } from "@/lib/i18n";
import { has, img } from "@/lib/media";
import { pagePath } from "@/lib/pages";

type Tab = "formule" | "sale" | "sucre" | "boissons";
const TABS: Tab[] = ["formule", "sale", "sucre", "boissons"];

/**
 * Le menu, une seule page à onglets (formule, salé, sucré, boissons), en vrai HTML : photo, description, prix.
 * Données : data/menu.json et data/formules.json. `limit` : nombre de plats montrés par onglet sur l'accueil.
 * L'adresse suit l'onglet (#sucre…) pour pouvoir pointer dessus depuis les tuiles.
 */
export function MenuTabs({ limit, formula, initial = "sale" }: { limit?: number; formula: ReactNode; initial?: Tab }) {
  const { lang, d } = useLocale();
  const [tab, setTab] = useState<Tab>(initial);
  const tabsRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1) as Tab;
      if (TABS.includes(h)) setTab(h);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const select = (id: Tab) => {
    setTab(id);
    if (!limit) history.replaceState(null, "", `#${id}`);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const i = TABS.indexOf(tab);
    const dir = document.documentElement.dir === "rtl" ? -1 : 1;
    const next = e.key === "ArrowRight" ? i + dir : e.key === "ArrowLeft" ? i - dir : e.key === "Home" ? 0 : e.key === "End" ? TABS.length - 1 : -1;
    if (next < 0 || next >= TABS.length) return;
    e.preventDefault();
    select(TABS[next]);
    tabsRef.current?.querySelector<HTMLButtonElement>(`#tab-${TABS[next]}`)?.focus();
  };

  const row = (it: Item) => {
    const t = it[lang];
    const photo = it.photo && has(it.photo) ? img(it.photo) : null;
    return (
      <li key={it.id} className="flex gap-4 border-b border-line py-4 md:gap-5">
        {photo && (
          <Image src={photo.src} alt={altOf(d, photo.src)} width={photo.width} height={photo.height} sizes="96px" quality={70} className="h-20 w-20 shrink-0 rounded-2xl object-cover md:h-24 md:w-24" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="display text-[1.1875rem] leading-snug md:text-[1.3125rem]">{t.name}</h3>
            <span className="dots" aria-hidden="true" />
            <span className="font-medium whitespace-nowrap tabular-nums">{it.price !== null ? price(it.price, lang) : d.menu.noPrice}</span>
          </div>
          {t.desc && <p className="mt-1 text-[0.9375rem] leading-snug text-muted">{t.desc}</p>}
          {(it.signature || it.formula || it.meatless) && (
            <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
              {it.signature && (
                <span className="tag">
                  <Heart className="h-3.5 w-3.5" />
                  {d.menu.signature}
                </span>
              )}
              {it.formula && <span className="tag !text-magenta">{d.menu.inFormula}</span>}
              {it.meatless && <span className="tag !text-avocado">{d.menu.meatless}</span>}
            </p>
          )}
        </div>
      </li>
    );
  };

  const panel = (id: Tab) => {
    if (id === "formule") return formula;
    const cat = CATEGORIES.find((c) => c.id === id)!;
    const sections = limit ? [{ ...cat.sections[0], items: cat.sections[0].items.slice(0, limit) }] : cat.sections;
    return (
      <>
        {sections.map((s) => (
          <section key={s.id} aria-labelledby={`sec-${s.id}`} className="mt-2 first:mt-0 [&+section]:mt-10">
            <h3 id={`sec-${s.id}`} className={cat.sections.length > 1 && !limit ? "eyebrow mb-1" : "sr-only"}>
              {s[lang]}
            </h3>
            <ul className={`grid gap-x-12 ${s.items.some((i) => i.photo) ? "lg:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}>{s.items.map(row)}</ul>
          </section>
        ))}
        {id === "sale" && <p className="mt-5 text-[0.9375rem] text-muted">{GARNISH[lang]}</p>}
        {limit && (
          <Link href={`${pagePath("menu", lang)}#${id}`} className="link-line mt-6 inline-flex min-h-11 items-center font-medium">
            {d.menu.seeFull} · {d.menu.tabs[id]}
          </Link>
        )}
      </>
    );
  };

  return (
    <div>
      <div ref={tabsRef} role="tablist" aria-label={d.menu.tabsLabel} onKeyDown={onKey} className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 md:gap-2 [scrollbar-width:none] md:mx-0 md:px-0">
        {TABS.map((id) => (
          <button
            key={id}
            id={`tab-${id}`}
            role="tab"
            type="button"
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            tabIndex={tab === id ? 0 : -1}
            onClick={() => select(id)}
            className={`min-h-11 shrink-0 rounded-full border px-3.5 text-[0.9375rem] md:px-5 md:text-[1rem] font-medium whitespace-nowrap transition-colors ${tab === id ? "border-violet bg-violet text-paper" : "border-line bg-paper text-ink hover:border-violet"}`}
          >
            {d.menu.tabs[id]}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          id={`panel-${tab}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
          tabIndex={0}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -4 }}
          transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
          className="pt-6 focus-visible:outline-offset-8"
        >
          {panel(tab)}
        </motion.div>
      </AnimatePresence>
      <p className="mt-8 text-[0.875rem] text-muted">{d.menu.priceNote}</p>
    </div>
  );
}
