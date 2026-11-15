"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import site from "@/data/site.json";
import { Logo } from "@/components/Logo";
import { LangSwitch } from "@/components/LangSwitch";
import { CloseIcon, InstagramIcon, MenuIcon, PinIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";
import { pagePath } from "@/lib/pages";

export function Header() {
  const { lang, d } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const home = `/${lang}`;
  const menu = pagePath("menu", lang);
  const links = [
    { href: menu, label: d.nav.menu },
    { href: `${home}#formule`, label: d.nav.formule },
    { href: pagePath("groupes", lang), label: d.nav.groupes },
    { href: `${home}#infos`, label: d.nav.infos },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 bg-cream/95 backdrop-blur-sm transition-shadow duration-300 ${scrolled ? "shadow-[0_1px_0_var(--color-line)]" : ""}`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-10 focus:rounded-full focus:bg-paper focus:px-4 focus:py-2">
          {d.nav.skip}
        </a>
        <div className="flex h-16 items-center gap-3 px-4 md:h-20 md:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-8">
          <nav aria-label={d.nav.main} className="hidden items-center gap-7 text-[0.9375rem] font-medium lg:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="py-2 whitespace-nowrap underline-offset-[0.45em] decoration-violet decoration-[1.5px] hover:underline">
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href={home} aria-label={`${site.name}, ${d.nav.home}`} className="me-auto lg:me-0">
            <Logo />
          </Link>
          <div className="flex items-center gap-1 md:gap-3 lg:justify-end">
            <LangSwitch lang={lang} label={d.nav.lang} className="hidden md:flex" />
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label={d.nav.instagram} className="hidden h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-pink-soft md:flex">
              <InstagramIcon className="h-5 w-5" />
            </a>
            <Link href={menu} className="btn !min-h-11 !px-5 max-sm:hidden">
              {d.nav.seeMenu}
            </Link>
            <button type="button" className="flex h-11 w-11 items-center justify-center lg:hidden" aria-label={d.nav.openMenu} aria-expanded={open} aria-controls="menu-mobile" onClick={() => setOpen(true)}>
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div id="menu-mobile" role="dialog" aria-modal="true" aria-label={d.nav.main} className="fade-in fixed inset-0 z-[60] flex flex-col overflow-y-auto overscroll-contain bg-cream px-5 pb-8">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <Logo />
            <button type="button" autoFocus className="flex h-11 w-11 items-center justify-center" aria-label={d.nav.close} onClick={() => setOpen(false)}>
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>
          <nav aria-label={d.nav.main} className="mt-4 flex flex-col border-t border-line">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="display border-b border-line py-4 text-[1.75rem]">
                {l.label}
              </Link>
            ))}
          </nav>
          {/* Raccourcis : Menu, Itinéraire, Groupes */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <Link href={menu} onClick={() => setOpen(false)} className="btn">
              {d.nav.seeMenu}
            </Link>
            <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-line">
              <PinIcon />
              {d.nav.directions}
            </a>
            <Link href={pagePath("groupes", lang)} onClick={() => setOpen(false)} className="btn-line col-span-2">
              {d.nav.groupes}
            </Link>
          </div>
          <div className="mt-auto flex items-center justify-between pt-8">
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-medium">
              <InstagramIcon className="h-5 w-5" />
              {site.instagramHandle}
            </a>
            <LangSwitch lang={lang} label={d.nav.lang} />
          </div>
        </div>
      )}
    </>
  );
}

/** Barre fixée en bas de l'écran sur mobile : « Voir le menu » toujours sous le pouce, et « Itinéraire » à côté. */
export function MobileBar() {
  const { lang, d } = useLocale();
  const pathname = usePathname() ?? "";
  const onMenu = pathname.startsWith(pagePath("menu", lang));
  return (
    <>
      <div className="h-[4.5rem] md:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-cream/97 px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur-sm md:hidden">
        <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-line flex-1 !px-4">
          <PinIcon />
          {d.nav.directions}
        </a>
        {onMenu ? (
          <Link href={pagePath("groupes", lang)} className="btn flex-1">
            {d.nav.groupes}
          </Link>
        ) : (
          <Link href={pagePath("menu", lang)} className="btn flex-1">
            {d.nav.seeMenu}
          </Link>
        )}
      </div>
    </>
  );
}
