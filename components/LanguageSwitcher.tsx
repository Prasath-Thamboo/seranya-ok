"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { FiGlobe } from "react-icons/fi";

type Variant = "navbar" | "mobile";

interface LanguageSwitcherProps {
  /** Style clair/sombre pour la variante navbar (fond ivoire vs hero transparent). */
  solid?: boolean;
  variant?: Variant;
  className?: string;
  /** Callback optionnel (ex. fermer le menu mobile après le switch). */
  onSwitch?: () => void;
}

export default function LanguageSwitcher({
  solid = true,
  variant = "navbar",
  className = "",
  onSwitch,
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const t = useTranslations("languageSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const target = (locale === "fr" ? "en" : "fr") as (typeof routing.locales)[number];
  const ariaLabel = target === "en" ? t("switchToEnglish") : t("switchToFrench");

  const handleSwitch = () => {
    startTransition(() => {
      // `pathname` est déjà résolu et sans préfixe de locale
      // (ex. `/posts/123`) ; next-intl repose le bon préfixe.
      router.replace(pathname, { locale: target });
      onSwitch?.();
    });
  };

  if (variant === "mobile") {
    return (
      <button
        type="button"
        onClick={handleSwitch}
        disabled={isPending}
        aria-label={ariaLabel}
        className={`flex w-full items-center justify-between rounded-lg border border-line px-3 py-3 font-sans text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent disabled:opacity-60 ${className}`}
      >
        <span className="flex items-center gap-2">
          <FiGlobe className="h-4 w-4" />
          {t("label")}
        </span>
        <span className="flex items-center gap-1 font-medium">
          <span className={locale === "fr" ? "text-accent" : "opacity-50"}>FR</span>
          <span className="opacity-30">/</span>
          <span className={locale === "en" ? "text-accent" : "opacity-50"}>EN</span>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSwitch}
      disabled={isPending}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-sans font-medium tracking-wide transition-colors duration-200 disabled:opacity-60 ${
        solid
          ? "border-line text-ink hover:border-accent hover:text-accent"
          : "border-white/50 text-white hover:bg-white/10"
      } ${className}`}
    >
      <FiGlobe className="h-3.5 w-3.5" />
      {target.toUpperCase()}
    </button>
  );
}
