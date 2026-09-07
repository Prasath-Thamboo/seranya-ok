"use client";

import { LuArrowRight } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuthState } from "@/lib/hooks/useAuthState";

export default function FooterCTA() {
  const { isLoggedIn, isSubscribed } = useAuthState();
  const t = useTranslations("home.footerCta");

  return (
    <div className="relative z-10 mx-auto max-w-2xl text-center">
      <h2 className="mb-6 font-serif text-4xl font-medium text-ink md:text-5xl">
        {isLoggedIn ? t("titleLoggedIn") : t("titleGuest")}
      </h2>
      <p className="mb-10 text-lg text-ink-soft">
        {isSubscribed ? t("subSubscribed") : t("subDefault")}
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {!isLoggedIn && (
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-sans text-ink-invert shadow-md transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:bg-accent-hover"
          >
            {t("createAccount")} <LuArrowRight className="h-4 w-4" />
          </Link>
        )}
        {isLoggedIn && !isSubscribed && (
          <Link
            href="/subscription"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-sans text-ink-invert shadow-md transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:bg-accent-hover"
          >
            {t("subscribe")} <LuArrowRight className="h-4 w-4" />
          </Link>
        )}
        {isSubscribed && (
          <Link
            href="/univers"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-sans text-ink-invert shadow-md transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:bg-accent-hover"
          >
            {t("explore")} <LuArrowRight className="h-4 w-4" />
          </Link>
        )}
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full border border-line-strong px-8 py-3.5 text-sm font-sans text-ink transition-all duration-200 hover:border-accent hover:text-accent"
        >
          {t("contact")}
        </Link>
      </div>
    </div>
  );
}
