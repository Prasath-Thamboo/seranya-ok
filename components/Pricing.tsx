"use client";

import { useNotification } from '@/components/notifications/NotificationProvider';
import { fetchCurrentUser, getAccessToken } from "@/lib/queries/AuthQueries";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { LuCheck, LuX, LuLeaf, LuStar, LuShieldCheck, LuInfinity, LuSparkles } from "react-icons/lu";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || "http://localhost:5000";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

const FREE_FEATURE_KEYS = [
  { key: "publicArticles", included: true },
  { key: "yogaIntro", included: true },
  { key: "profile", included: true },
  { key: "editPosts", included: false },
  { key: "editorStatus", included: false },
  { key: "exclusiveResources", included: false },
] as const;

const PREMIUM_FEATURE_KEYS = [
  "allArticles",
  "yogaIntro",
  "profile",
  "editPosts",
  "editorStatus",
  "exclusiveResources",
] as const;

const BENEFIT_KEYS = [
  { key: "curated", icon: <LuLeaf className="h-6 w-6 text-accent" /> },
  { key: "editor", icon: <LuSparkles className="h-6 w-6 text-accent" /> },
  { key: "noCommitment", icon: <LuShieldCheck className="h-6 w-6 text-accent" /> },
  { key: "unlimited", icon: <LuInfinity className="h-6 w-6 text-accent" /> },
] as const;

export const Pricing = () => {
  const t = useTranslations("pricing");
  const tc = useTranslations("common");
  const router = useRouter();
  const { addNotification } = useNotification();
  const [userId, setUserId] = useState<number | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCurrentUser()
      .then((user) => {
        if (user?.id) {
          setUserId(user.id);
          setIsSubscribed(user.isSubscribed ?? false);
        }
      })
      .catch(() => setUserId(null));
  }, []);

  const handleSubscription = async () => {
    if (!userId) {
      addNotification("critical", t("notifications.accountRequired"), {
        primaryButtonLabel: t("notifications.createAccount"),
        secondaryButtonLabel: tc("cancel"),
        onPrimaryButtonClick: () => { router.push("/auth/register"); },
        onSecondaryButtonClick: () => {},
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/payment/create-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });
      const data = await response.json();
      if (data.sessionUrl) {
        window.open(data.sessionUrl, "_blank");
      } else {
        addNotification("critical", tc("retryError"));
      }
    } catch {
      addNotification("critical", t("notifications.subscriptionError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-page font-sans">
      {/* ── Plans ── */}
      <div className="mx-auto max-w-5xl px-6 py-20">
        <motion.div className="mb-16 text-center" initial="hidden" animate="visible" custom={0} variants={fadeUp}>
          <span className="mb-4 inline-block rounded-full bg-accent-soft px-4 py-1.5 text-xs font-sans uppercase tracking-[0.2em] text-accent">
            {t("eyebrow")}
          </span>
          <h2 className="mb-4 font-serif text-4xl font-medium text-ink md:text-5xl">{t("heading")}</h2>
          <p className="mx-auto max-w-xl text-lg text-ink-soft">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Plan Gratuit */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="flex flex-col rounded-3xl border border-line bg-raised p-8 shadow-sm"
          >
            <div className="mb-8">
              <p className="mb-3 text-xs font-sans uppercase tracking-[0.2em] text-ink-muted">{t("free.name")}</p>
              <div className="mb-6 flex items-baseline gap-2">
                <span className="font-serif text-5xl font-medium text-ink">{t("free.price")}</span>
                <span className="text-sm text-ink-muted">{t("perMonth")}</span>
              </div>
              <p className="text-sm text-ink-soft">{t("free.description")}</p>
            </div>

            <ul className="mb-10 flex-1 space-y-3">
              {FREE_FEATURE_KEYS.map((f) => (
                <li key={f.key} className="flex items-center gap-3 text-sm">
                  {f.included
                    ? <LuCheck className="h-4 w-4 flex-shrink-0 text-accent" />
                    : <LuX className="h-4 w-4 flex-shrink-0 text-ink-muted/50" />}
                  <span className={f.included ? "text-ink-soft" : "text-ink-muted/70"}>
                    {t(`free.features.${f.key}`)}
                  </span>
                </li>
              ))}
            </ul>

            <button
              disabled
              className="h-12 w-full cursor-not-allowed rounded-full border border-line text-sm font-sans text-ink-muted"
            >
              {t("free.currentPlan")}
            </button>
          </motion.div>

          {/* Plan Premium */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="relative flex flex-col overflow-hidden rounded-3xl border border-gilt/40 bg-raised p-8 shadow-md"
          >
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-gilt/20" />

            <div className="relative mb-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-sans uppercase tracking-[0.2em] text-accent">{t("premium.name")}</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-gilt px-3 py-1 text-xs font-sans uppercase tracking-[0.12em] text-ink-invert">
                  <LuStar className="h-3 w-3" /> {t("premium.badge")}
                </span>
              </div>
              <div className="mb-6 flex items-baseline gap-2">
                <span className="font-serif text-5xl font-medium text-ink">{t("premium.price")}</span>
                <span className="text-sm text-ink-muted">{t("perMonth")}</span>
              </div>
              <p className="text-sm text-ink-soft">{t("premium.description")}</p>
            </div>

            <ul className="relative mb-10 flex-1 space-y-3">
              {PREMIUM_FEATURE_KEYS.map((key) => (
                <li key={key} className="flex items-center gap-3 text-sm">
                  <LuCheck className="h-4 w-4 flex-shrink-0 text-accent" />
                  <span className="text-ink-soft">{t(`premium.features.${key}`)}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleSubscription}
              disabled={isSubscribed || loading}
              className={`relative h-12 w-full rounded-full text-sm font-sans transition-all duration-200 ${
                isSubscribed
                  ? "cursor-not-allowed bg-sunken text-ink-muted"
                  : "bg-accent text-ink-invert hover:bg-accent-hover"
              }`}
            >
              {isSubscribed ? t("premium.alreadySubscribed") : loading ? tc("loading") : t("premium.cta")}
            </button>

            {!isSubscribed && (
              <p className="mt-3 text-center text-xs text-ink-muted">{t("premium.noCommitment")}</p>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Bénéfices ── */}
      <div className="border-t border-line bg-sunken px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <motion.h3
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-12 text-center font-serif text-2xl font-medium text-ink"
          >
            {t("benefits.heading")}
          </motion.h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFIT_KEYS.map((b, i) => (
              <motion.div
                key={b.key}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="rounded-2xl border border-line bg-raised p-6 shadow-sm transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4">{b.icon}</div>
                <h4 className="mb-2 font-serif text-base font-medium text-ink">{t(`benefits.${b.key}.title`)}</h4>
                <p className="text-xs leading-relaxed text-ink-soft">{t(`benefits.${b.key}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA Final ── */}
      <div className="border-t border-line bg-page px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-3 text-base text-ink-soft">{t("finalCta.question")}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-sans text-sm text-accent transition-colors hover:text-accent-hover"
          >
            {t("finalCta.link")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
