"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

const SOCIALS = [
  { icon: <FaFacebookF className="w-3.5 h-3.5" />, href: "https://facebook.com", label: "Facebook" },
  { icon: <FaXTwitter className="w-3.5 h-3.5" />, href: "https://twitter.com", label: "X" },
  { icon: <FaInstagram className="w-3.5 h-3.5" />, href: "https://instagram.com", label: "Instagram" },
];

const Footer: React.FC<{ onLoad?: () => void }> = () => {
  const t = useTranslations("footer");

  const LINKS = [
    { label: t("home"), href: "/" },
    { label: t("about"), href: "/about" },
    { label: t("legal"), href: "/mentions" },
    { label: t("privacy"), href: "/confidentialite" },
    { label: t("cookies"), href: "/cookies" },
    { label: t("myData"), href: "/rgpd" },
  ];

  return (
    <footer className="relative z-10 bg-sunken border-t border-line font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <Link href="/" className="flex-shrink-0 opacity-90 hover:opacity-100 transition-opacity">
            <Image
              src="/logos/seranyaicon.png"
              alt="Logo Seranya"
              width={116}
              height={44}
              className="object-contain"
            />
          </Link>

          <nav className="flex flex-wrap justify-center gap-x-7 gap-y-2">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-ink-soft hover:text-accent transition-colors duration-200"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-line text-ink-soft hover:text-accent hover:border-accent transition-all duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-ink-muted">
            {t("rights", { year: new Date().getFullYear() })}
          </p>
          <p className="text-xs text-ink-muted">{t("tagline")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
