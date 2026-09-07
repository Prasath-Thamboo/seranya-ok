import { defineRouting } from "next-intl/routing";

// Locales disponibles sur le site public.
// `fr` reste sur `/` (aucun préfixe) pour préserver le SEO existant ;
// `en` est servi sous `/en/...`.
export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" &&
    (routing.locales as readonly string[]).includes(value)
  );
}
