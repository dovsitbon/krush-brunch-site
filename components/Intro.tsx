"use client";

import { useEffect, useState } from "react";
import { EGG_WHITE, Heart } from "@/components/Doodles";

/**
 * Effet d'ouverture (1,2 s, une fois par session) : un œuf au plat se dessine au trait, le jaune se remplit,
 * « KRUSH » apparaît avec un petit cœur violet, puis « BRUNCH EVERYDAY », fondu sur le hero.
 * Styles dans globals.css (.intro-*). Masqué d'office si déjà vu ou si l'utilisateur préfère réduire les animations.
 */
export function Intro({ skipLabel, tagline }: { skipLabel: string; tagline: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem("krush-intro", "1");
    } catch {}
    const t = setTimeout(() => setGone(true), 1250);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;
  return (
    <div className="intro-curtain">
      <svg viewBox="0 0 100 100" className="h-28 w-28 text-ink md:h-32 md:w-32" fill="none" aria-hidden="true">
        <path className="intro-white" d={EGG_WHITE} pathLength={1} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle className="intro-yolk" cx="50" cy="50" r="16" fill="var(--color-egg)" />
      </svg>
      <p className="intro-word mt-6 flex items-center gap-2 text-[2rem] font-semibold tracking-[0.08em] text-magenta md:text-[2.5rem]" aria-hidden="true">
        KRUSH
        <Heart className="h-6 w-6 text-violet md:h-7 md:w-7" />
      </p>
      <p className="intro-word intro-word-2 mt-2 text-[0.75rem] font-medium tracking-[0.4em] text-[#5b3446]" aria-hidden="true">
        {tagline}
      </p>
      <button type="button" onClick={() => setGone(true)} className="absolute end-5 bottom-5 min-h-11 px-3 text-sm text-muted underline underline-offset-4">
        {skipLabel}
      </button>
    </div>
  );
}
