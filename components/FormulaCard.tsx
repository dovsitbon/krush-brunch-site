import { MAIN_FORMULA, itemById } from "@/lib/menu";
import { price } from "@/lib/format";
import type { Dict, Locale } from "@/lib/i18n";
import { Heart } from "@/components/Doodles";

/**
 * La formule à 25 € (data/formules.json), présentée comme sur sa carte : un carton rose,
 * les quatre étapes et les plats au choix. Utilisée sur l'accueil et dans l'onglet « Formule » du menu.
 */
export function FormulaCard({ lang, d, className = "" }: { lang: Locale; d: Dict; className?: string }) {
  const f = MAIN_FORMULA;
  return (
    <div className={`rounded-[28px] bg-pink px-6 py-8 text-ink md:px-10 md:py-10 ${className}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 className="display text-[1.75rem] text-violet-deep md:text-[2rem]">{f[lang].name}</h3>
        <p className="display text-[2.5rem] text-magenta tabular-nums md:text-[3rem]">{price(f.price, lang).replace(/[.,]00/, "")}</p>
      </div>
      <p className="mt-1 text-[0.9375rem] text-muted">{f[lang].when}</p>
      <ol className="mt-6 grid gap-x-10 gap-y-5 md:grid-cols-2">
        {f.courses.map((c) => (
          <li key={c.id} className="border-t border-[#e9b9d1] pt-4">
            <p className="flex items-center gap-2 font-medium">
              <Heart className="h-4 w-4 shrink-0 text-violet" />
              {c[lang]}
            </p>
            <p className="mt-1 text-[0.9375rem] leading-snug text-muted">
              <span className="sr-only">{d.formule.choices} : </span>
              {c.choices ? c.choices.map((id) => itemById(id)?.[lang].name ?? id).join(` ${d.formule.or} `) : c.text?.[lang]}
            </p>
          </li>
        ))}
      </ol>
      {f[lang].note && <p className="mt-6 text-[0.875rem] text-muted">{f[lang].note}</p>}
    </div>
  );
}
