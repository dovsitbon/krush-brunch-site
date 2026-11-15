// Petits dessins au trait de la maison : le cœur (signature du site), l'œuf au plat, le croissant, la tasse.
// Toujours en currentColor, trait arrondi, jamais remplis (sauf le jaune de l'œuf).

type P = { className?: string };
const line = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const Heart = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...line} strokeWidth={1.8}>
    <path d="M12 20.5C6.5 16.6 3 13.3 3 9.2 3 6.4 5.2 4.3 7.8 4.3c1.8 0 3.3 1 4.2 2.6.9-1.6 2.4-2.6 4.2-2.6 2.6 0 4.8 2.1 4.8 4.9 0 4.1-3.5 7.4-9 11.3Z" />
  </svg>
);

export const EGG_WHITE = "M50 8c14 0 20 9 30 12s14 13 12 24-3 14 2 24-8 22-22 22-18 4-30 2S14 84 10 72s-6-16-2-28 6-20 18-26 14-10 24-10Z";

export const Egg = ({ className = "h-10 w-10", yolk = "var(--color-egg)" }: P & { yolk?: string }) => (
  <svg viewBox="0 0 100 100" className={className} {...line} strokeWidth={2.4}>
    <path d={EGG_WHITE} />
    <circle cx="50" cy="50" r="16" fill={yolk} />
  </svg>
);

export const Croissant = ({ className = "h-10 w-10" }: P) => (
  <svg viewBox="0 0 64 64" className={className} {...line} strokeWidth={1.8}>
    <path d="M8 40c-2-8 4-16 12-18 2 6 4 10 12 12 8-2 10-6 12-12 8 2 14 10 12 18-6 2-12 0-14-4-4 4-12 6-20 6s-16-2-20-6c-2 4-8 6-14 4" />
    <path d="M20 22c2-8 8-12 12-12s10 4 12 12M26 30l2-14M38 30l-2-14M32 34V12" />
  </svg>
);

export const Cup = ({ className = "h-10 w-10" }: P) => (
  <svg viewBox="0 0 64 64" className={className} {...line} strokeWidth={1.8}>
    <path d="M12 26h34v8a16 16 0 0 1-16 16h-2a16 16 0 0 1-16-16v-8Z" />
    <path d="M46 30h3a6 6 0 0 1 0 12h-4M8 56h44" />
    <path d="M24 20c-2-3 2-5 0-9M32 20c-2-3 2-5 0-9" />
  </svg>
);

export const Clock = ({ className = "h-7 w-7" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...line} strokeWidth={1.6}>
    <circle cx="16" cy="16" r="11.5" />
    <path d="M16 9v7l4.5 3" />
  </svg>
);

export const Leaf = ({ className = "h-7 w-7" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...line} strokeWidth={1.6}>
    <path d="M6 26C6 14 13 6 26 6c0 13-8 20-20 20Z" />
    <path d="M6 26 18 14" />
  </svg>
);

export const Walk = ({ className = "h-7 w-7" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...line} strokeWidth={1.6}>
    <path d="M9 13h14l-1.5 13h-11L9 13Z" />
    <path d="M13 13V9.5a3 3 0 0 1 6 0V13M16 4v1" />
  </svg>
);

export const Sun = ({ className = "h-7 w-7" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...line} strokeWidth={1.6}>
    <circle cx="16" cy="16" r="5.5" />
    <path d="M16 3.5v3M16 25.5v3M3.5 16h3M25.5 16h3M7.2 7.2l2.1 2.1M22.7 22.7l2.1 2.1M7.2 24.8l2.1-2.1M22.7 9.3l2.1-2.1" />
  </svg>
);

export const Seal = ({ className = "h-7 w-7" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...line} strokeWidth={1.6}>
    <path d="M16 3.5l3 2.2 3.7-.3 1.2 3.5 3.1 2-1 3.6 1 3.6-3.1 2-1.2 3.5-3.7-.3-3 2.2-3-2.2-3.7.3-1.2-3.5-3.1-2 1-3.6-1-3.6 3.1-2 1.2-3.5 3.7.3Z" />
    <path d="m11.5 16.2 3 3 6-6.4" />
  </svg>
);

export const NoCalendar = ({ className = "h-7 w-7" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...line} strokeWidth={1.6}>
    <rect x="5" y="7" width="22" height="20" rx="4" />
    <path d="M5 13h22M11 4v5M21 4v5M12.5 17.5l7 7M19.5 17.5l-7 7" />
  </svg>
);

export const Parasol = ({ className = "h-7 w-7" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...line} strokeWidth={1.6}>
    <path d="M4 15C5 8.5 10 5 16 5s11 3.5 12 10c-2.5-1.5-5-1.5-6 0-1.5-1.5-4.5-1.5-6 0-1.5-1.5-4.5-1.5-6 0-1-1.5-3.5-1.5-6 0Z" />
    <path d="M16 15v13M10 28h12" />
  </svg>
);
