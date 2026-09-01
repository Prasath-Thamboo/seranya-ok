// seranyanext/components/Navbar.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getAccessToken, logoutUser } from "@/lib/queries/AuthQueries";
import { fetchCurrentUser } from "@/lib/queries/AuthQueries";
import { RegisterUserModel } from "@/lib/models/AuthModels";
import Badge from "@/components/Badge";
import { Dropdown, Menu } from "antd";
import { FiLogOut, FiMenu, FiX, FiLogIn, FiUserPlus, FiHome } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import { useNotification } from "@/components/notifications/NotificationProvider";
import React from "react";

const UNIVERS_LINKS = [
  { href: "/tutoriels", label: "Tutoriels" },
  { href: "/univers", label: "Univers" },
  { href: "/encyclopedie", label: "Encyclopédie" },
  { href: "/eveil", label: "Éveil" },
];

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<RegisterUserModel | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUniversOpen, setIsUniversOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { addNotification } = useNotification();
  const pathname = usePathname();

  // Pages dont le haut est déjà clair (pas de hero sombre) : la navbar doit y
  // afficher un texte encre même sans scroll, sinon les libellés blancs
  // disparaissent sur le fond ivoire.
  const LIGHT_TOP_ROUTES = ["/contact"];
  const forceInk = LIGHT_TOP_ROUTES.some(
    (r) => pathname === r || pathname?.startsWith(`${r}/`)
  );

  useEffect(() => {
    const token = getAccessToken();

    if (token) {
      fetchCurrentUser()
        .then((userData) => {
          setUser({ ...userData });
          setIsLoggedIn(true);
        })
        .catch(() => setIsLoggedIn(false));
    } else {
      setIsLoggedIn(false);
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(totalHeight > 0 ? (scrollPosition / totalHeight) * 100 : 0);
      setScrolled(scrollPosition > 8);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.href = "/";
    } catch (error) {
      addNotification("critical", "Une erreur s'est produite lors de la déconnexion.");
    }
  };

  const menuItems = (
    <Menu>
      <Menu.Item key="1">
        <Link href="/compte">Profil</Link>
      </Menu.Item>
      {(user?.role === "ADMIN" || user?.role === "EDITOR") && (
        <Menu.Item key="2">
          <Link href="/admin">Administration</Link>
        </Menu.Item>
      )}
      <Menu.Item key="3" onClick={handleLogout} danger>
        <div className="flex items-center space-x-2">
          <FiLogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  const profileImageUrl =
    typeof user?.profileImage === "string" && user.profileImage
      ? user.profileImage
      : null;

  const universSubMenu = (
    <Menu>
      {UNIVERS_LINKS.map((l) => (
        <Menu.Item key={l.href}>
          <Link href={l.href}>{l.label}</Link>
        </Menu.Item>
      ))}
    </Menu>
  );

  // Au repos (haut de page) : nav transparente, texte clair sur l'imagerie du hero.
  // Au scroll : voile ivoire feutré, texte encre.
  const solid = scrolled || isMenuOpen || forceInk;

  const shellClass = isMenuOpen
    ? "bg-page"
    : solid
    ? "bg-page/85 backdrop-blur-md border-b border-line shadow-sm"
    : "bg-transparent border-b border-transparent";

  const linkClass = `group relative text-sm font-sans tracking-wide transition-colors duration-200 ${
    solid ? "text-ink hover:text-accent" : "text-white/90 hover:text-white text-shadow-sm"
  }`;

  // Logo : blanc sur le hero transparent, vert sur le voile ivoire (scroll /
  // menu ouvert), noir sur les pages à fond clair (ex. contact).
  const logoSrc = forceInk
    ? "/logos/iconblack.png"
    : solid
    ? "/logos/icongreen.png"
    : "/logos/iconwhite.png";

  const underline =
    "pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-calm group-hover:scale-x-100";

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 py-5 px-3 ${shellClass}`}>
      <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <div className="flex-shrink-0 p-1">
          <Link href="/">
            <div className={isLoggedIn ? "hidden md:block" : "hidden min-[1074px]:block"}>
              <Image
                src={logoSrc}
                alt="Logo Seranya"
                width={168}
                height={64}
                className={`object-contain max-h-14 transition-opacity ${
                  solid ? "opacity-100" : "opacity-95"
                }`}
              />
            </div>
            <div className={isLoggedIn ? "block md:hidden" : "block min-[1074px]:hidden"}>
              <Image
                src={logoSrc}
                alt="Logo Seranya"
                width={46}
                height={46}
                className="object-contain max-h-11"
              />
            </div>
          </Link>
        </div>

        {/* Navigation desktop */}
        <div className={isLoggedIn ? "hidden md:flex space-x-8 items-center" : "hidden min-[1074px]:flex space-x-8 items-center"}>
          <Link href="/" className={`${linkClass} flex items-center gap-2`}>
            <FiHome className="w-4 h-4" />
            <span>Accueil</span>
            <span className={underline} />
          </Link>

          <Link href="/posts" className={linkClass}>
            <span>Blog</span>
            <span className={underline} />
          </Link>

          <Dropdown overlay={universSubMenu} trigger={["hover"]} placement="bottom">
            <button className={`${linkClass} flex items-center gap-1`}>
              <span>Univers</span>
              <FaChevronDown className="w-3 h-3 opacity-70" />
              <span className={underline} />
            </button>
          </Dropdown>

          <Link href="/contact" className={linkClass}>
            <span>Contact</span>
            <span className={underline} />
          </Link>

          <Link href="/subscription" className={linkClass}>
            <span>Abonnement</span>
            <span className={underline} />
          </Link>
        </div>

        {/* Zone utilisateur desktop */}
        <div ref={userMenuRef} className={isLoggedIn ? "hidden md:flex items-center space-x-3" : "hidden min-[1074px]:flex items-center space-x-3"}>
          {isLoggedIn && user ? (
            <Dropdown overlay={menuItems} trigger={["click"]}>
              <div className="flex items-center cursor-pointer group gap-2">
                {profileImageUrl ? (
                  <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-line">
                    <Image src={profileImageUrl} alt="Avatar" layout="fill" objectFit="cover" className="rounded-full" />
                  </div>
                ) : (
                  <div className="relative w-9 h-9 rounded-full overflow-hidden bg-accent-soft flex items-center justify-center">
                    <span className="text-accent text-sm font-serif">
                      {user.pseudo.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className={`font-sans text-sm transition-colors ${
                  solid ? "text-ink group-hover:text-accent" : "text-white/90 group-hover:text-white text-shadow-sm"
                }`}>
                  {user.pseudo}
                </span>
                {user.role && <Badge role={user.role} />}
              </div>
            </Dropdown>
          ) : (
            <>
              <Link href="/auth/login">
                <button
                  className={`flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-sans transition-colors duration-200 ${
                    solid
                      ? "border-line text-ink hover:border-accent hover:text-accent"
                      : "border-white/50 text-white hover:bg-white/10"
                  }`}
                >
                  <FiLogIn className="w-4 h-4" />
                  Connexion
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-sans text-ink-invert transition-colors duration-200 hover:bg-accent-hover">
                  <FiUserPlus className="w-4 h-4" />
                  Inscription
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Hamburger mobile */}
        <div className={isLoggedIn ? "md:hidden z-50" : "min-[1074px]:hidden z-50"}>
          <button
            className={`transition-colors ${solid ? "text-ink hover:text-accent" : "text-white hover:text-white/80"}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Barre de progression de lecture */}
      <div className={`fixed bottom-0 left-0 w-full h-px bg-line ${isMenuOpen ? "hidden" : ""}`}>
        <div
          className="h-full bg-accent/70 transition-all duration-500 ease-calm"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-[55]"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 h-full w-full bg-page z-[60] flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                <Image src={logoSrc} alt="Seranya" width={104} height={40} className="object-contain" />
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-line text-ink-soft hover:text-accent hover:border-accent transition-colors"
                aria-label="Fermer le menu"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <nav className="menu-scroll flex-1 overflow-y-auto px-5 py-6">
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 py-3.5 px-3 rounded-lg font-sans text-ink hover:text-accent hover:bg-accent-soft transition-all duration-200 border-b border-line/70"
                  >
                    <FiHome className="w-4 h-4" />
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link
                    href="/posts"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-3.5 px-3 rounded-lg font-sans text-ink hover:text-accent hover:bg-accent-soft transition-all duration-200 border-b border-line/70"
                  >
                    Blog
                  </Link>
                </li>

                <li>
                  <button
                    onClick={() => setIsUniversOpen(!isUniversOpen)}
                    className="w-full flex items-center justify-between py-3.5 px-3 rounded-lg font-sans text-ink hover:text-accent hover:bg-accent-soft transition-all duration-200 border-b border-line/70"
                  >
                    Univers
                    <FaChevronDown className={`w-3 h-3 text-ink-muted transition-transform duration-200 ${isUniversOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isUniversOpen && (
                    <ul className="mt-1 ml-3 pl-3 border-l border-accent/30 space-y-0.5 mb-2">
                      {UNIVERS_LINKS.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2 py-2.5 px-2 font-sans text-sm text-ink-soft hover:text-accent transition-colors"
                          >
                            <span className="w-1 h-1 rounded-full bg-accent/60 flex-shrink-0" />
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                <li>
                  <Link
                    href="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-3.5 px-3 rounded-lg font-sans text-ink hover:text-accent hover:bg-accent-soft transition-all duration-200 border-b border-line/70"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/subscription"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-3.5 px-3 rounded-lg font-sans text-ink hover:text-accent hover:bg-accent-soft transition-all duration-200"
                  >
                    Abonnement
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="px-5 py-5 border-t border-line">
              {isLoggedIn && user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-1 mb-4">
                    {profileImageUrl ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-line flex-shrink-0">
                        <Image src={profileImageUrl} alt="Avatar" layout="fill" objectFit="cover" className="rounded-full" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center flex-shrink-0">
                        <span className="text-accent font-serif text-lg">{user.pseudo.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-ink font-sans text-sm truncate">{user.pseudo}</p>
                      {user.role && <Badge role={user.role} />}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href="/compte"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1 text-center py-2.5 text-xs font-sans text-ink-soft border border-line rounded-full hover:border-accent hover:text-accent transition-all"
                    >
                      Profil
                    </Link>
                    {(user.role === "ADMIN" || user.role === "EDITOR") && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex-1 text-center py-2.5 text-xs font-sans text-ink-soft border border-line rounded-full hover:border-accent hover:text-accent transition-all"
                      >
                        Admin
                      </Link>
                    )}
                  </div>

                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="w-full py-2.5 text-xs font-sans text-danger border border-danger/30 rounded-full hover:bg-danger/10 transition-all flex items-center justify-center gap-2"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-sans text-ink-invert bg-accent hover:bg-accent-hover rounded-full transition-all"
                  >
                    <FiLogIn className="w-4 h-4" />
                    Connexion
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-sans text-accent border border-accent/40 hover:bg-accent-soft rounded-full transition-all"
                  >
                    <FiUserPlus className="w-4 h-4" />
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.28s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        /* Zone de liens du menu mobile : défilement conservé mais barre
           masquée — sinon la barre grise épaisse de Windows apparaît comme
           un "trait" le long du bord droit du menu. */
        .menu-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .menu-scroll::-webkit-scrollbar {
          width: 0;
          height: 0;
          display: none;
        }
      `}</style>
    </nav>
  );
}
