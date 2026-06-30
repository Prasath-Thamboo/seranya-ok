"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const LINKS = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/about" },
  { label: "Mentions légales", href: "/mentions" },
];

const SOCIALS = [
  { icon: <FaFacebook className="w-4 h-4" />, href: "https://facebook.com", label: "Facebook" },
  { icon: <FaTwitter className="w-4 h-4" />, href: "https://twitter.com", label: "Twitter" },
  { icon: <FaInstagram className="w-4 h-4" />, href: "https://instagram.com", label: "Instagram" },
];

const Footer: React.FC<{ onLoad?: () => void }> = () => {
  return (
    <footer className="relative z-10 bg-black border-t border-gray-900 font-kanit">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Ligne principale */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 opacity-90 hover:opacity-100 transition-opacity">
            <Image
              src="/logos/seranyaicon.png"
              alt="Logo Seranya"
              width={120}
              height={44}
              className="object-contain"
            />
          </Link>

          {/* Liens */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs font-iceberg uppercase tracking-widest text-gray-400 hover:text-green-400 transition-colors duration-200"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Réseaux */}
          <div className="flex items-center gap-4">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-800 text-gray-400 hover:text-green-400 hover:border-green-400 transition-all duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Séparateur + copyright */}
        <div className="mt-6 pt-5 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-600 font-iceberg uppercase tracking-widest">
            © {new Date().getFullYear()} Seranya. Tous droits réservés.
          </p>
          <p className="text-xs text-gray-700 font-iceberg uppercase tracking-widest">
            Conçu avec passion
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
