// Le logo de Krush, redessiné d'après sa photo de profil (scripts/draw.mjs → mêmes tracés) :
// le K au trait aux bras en pétale, « KRUSH » en capitales rondes magenta, « BRUNCH » espacé en prune.
// Les fichiers complets (public/logo.svg, favicon) sont produits par « npm run logo ».

export const K_PATH =
  "M27 12h9a6 6 0 0 1 6 6v20c8-12 20-22 33-22 10 0 13 9 7 16-6 7-17 12-26 16 9 3 21 9 26 17 5 8-1 17-11 15-12-2-22-12-29-21v24a6 6 0 0 1-6 6h-9a6 6 0 0 1-6-6V18a6 6 0 0 1 6-6Z";
export const K_LOOP = "M56 48c-5-1-9 2-8 5 1 3 6 3 8 0 1-2 1-4 0-5Z";

export function KMark({ className = "h-8 w-8", strokeWidth = 6.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      <path d={K_PATH} />
      <path d={K_LOOP} />
    </svg>
  );
}

/** Logo horizontal de l'en-tête : le K, puis « KRUSH » et « BRUNCH » empilés. */
export function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${light ? "text-paper" : "text-magenta"} ${className}`}>
      <KMark className="h-9 w-9 md:h-10 md:w-10" />
      <span className="flex flex-col leading-none">
        <span className="text-[1.375rem] font-semibold tracking-[0.06em] md:text-[1.5rem]">KRUSH</span>
        <span className={`mt-1 text-[0.5625rem] font-medium tracking-[0.42em] ${light ? "text-pink" : "text-[#5b3446]"}`}>BRUNCH</span>
      </span>
    </span>
  );
}
