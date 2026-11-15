"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Dict, Locale } from "@/lib/i18n";

type LocaleCtx = { lang: Locale; d: Dict };
const LocaleContext = createContext<LocaleCtx | null>(null);

export function useLocale() {
  const v = useContext(LocaleContext);
  if (!v) throw new Error("useLocale hors de Providers");
  return v;
}

export function Providers({ lang, d, children }: { lang: Locale; d: Dict; children: ReactNode }) {
  const value = useMemo(() => ({ lang, d }), [lang, d]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
