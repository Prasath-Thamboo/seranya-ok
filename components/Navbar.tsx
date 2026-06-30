// seranyanext/components/Navbar.tsx

"use client";

import { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAccessToken, logoutUser } from "@/lib/queries/AuthQueries";
import { fetchCurrentUser } from "@/lib/queries/AuthQueries";
import { RegisterUserModel } from "@/lib/models/AuthModels";
import Badge from "@/components/Badge";
import { Dropdown, Menu } from "antd";
import { FiLogOut, FiMenu, FiX, FiLogIn, FiUserPlus } from "react-icons/fi"; // Import des icônes FiLogIn et FiUserPlus
import { FaChevronDown } from "react-icons/fa"; // Utilisation de FaChevronDown
import { useNotification } from "@/components/notifications/NotificationProvider";
import React from "react";
import { ColorContext } from "@/context/ColorContext"; // Importer le ColorContext

// Fonction pour assombrir une couleur hexadécimale
const shadeColor = (color: string, percent: number): string => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = Math.round((R * (100 + percent)) / 100);
  G = Math.round((G * (100 + percent)) / 100);
  B = Math.round((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR = R.toString(16).padStart(2, '0');
  const GG = G.toString(16).padStart(2, '0');
  const BB = B.toString(16).padStart(2, '0');

  return `#${RR}${GG}${BB}`;
};

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<RegisterUserModel | null>(null);
  const [navbarBackground, setNavbarBackground] = useState("bg-transparent");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUniversOpen, setIsUniversOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // État pour la progression du scroll
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { addNotification } = useNotification();
  const { color } = useContext(ColorContext); // Consommer le contexte

  // Mettre à jour la progression de la barre de scroll
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollPosition / totalHeight) * 100;
    setScrollProgress(scrollPercent);
  };

  useEffect(() => {
    const token = getAccessToken();

    if (token) {
      fetchCurrentUser()
        .then((userData) => {
          setUser({ ...userData });
          setIsLoggedIn(true);
        })
        .catch(() => {
          setIsLoggedIn(false);
        });
    } else {
      setIsLoggedIn(false);
    }

    // Gestion du scroll pour l'arrière-plan de la navbar
    const handleNavbarScroll = () => {
      if (window.scrollY > 0) {
        setNavbarBackground("bg-transparent bg-opacity-75 backdrop-blur-md");
      } else {
        setNavbarBackground("bg-transparent"); // Remplace bg-gray-700 par bg-transparent
      }
    };

    window.addEventListener("scroll", handleNavbarScroll);
    window.addEventListener("scroll", handleScroll);

    handleNavbarScroll();

    return () => {
      window.removeEventListener("scroll", handleNavbarScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsLoggedIn(false);
      setUser(null);
      addNotification("success", "Vous êtes déconnecté.");
    } catch (error) {
      addNotification("critical", "Une erreur s'est produite lors de la déconnexion.");
    }
  };

  const menuItems = (
    <Menu className="font-kanit">
      <Menu.Item key="1">
        <Link href="/admin/me">Profile</Link>
      </Menu.Item>
      {user?.role === "ADMIN" && (
        <Menu.Item key="2">
          <Link href="/admin">Administration</Link>
        </Menu.Item>
      )}
      <Menu.Item key="3" onClick={handleLogout} danger>
        <div className="flex items-center space-x-2">
          <FiLogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  const profileImageUrl =
    typeof user?.profileImage === "string" && user.profileImage
      ? user.profileImage
      : null;

  // Définition du sous-menu pour "Univers"
  const universSubMenu = (
    <Menu className="font-kanit custom-submenu">
      <Menu.Item key="1">
        <Link href="/tutoriels">Tutoriels</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link href="/univers">Univers</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link href="/encyclopedie">Encyclopédie</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-colors duration-300 py-6 px-3 ${isMenuOpen ? "bg-black" : navbarBackground}`}
      style={{
        "--neon-color": "#2ecc40", // Définir la variable CSS pour la couleur néon
        "--button-bg-color": "#2ecc40", // Définir la variable CSS pour la couleur des boutons
        "--button-hover-bg-color": shadeColor(color || "#2ecc40", -10), // Assombrir la couleur des boutons de 10%
      } as React.CSSProperties}
    >
      <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0 p-1">
          <Link href="/">
            <div className="hidden md:block">
              <Image
                src="/logos/seranyaicon.png" // Utiliser le chemin correct vers votre logo
                alt="Logo Seranya"
                width={180} // Réduction de la largeur de 200 à 180
                height={70} // Réduction de la hauteur de 80 à 70
                className="object-contain max-h-16" // Réduction de max-h-20 à max-h-16 (4rem)
              />
            </div>
            <div className="block md:hidden">
              <Image
                src="/logos/seranyaicon.png" // Assurez-vous que ce chemin est correct
                alt="Logo Seranya"
                width={50} // Réduction de la largeur de 60 à 50
                height={50} // Réduction de la hauteur de 60 à 50
                className="object-contain max-h-12" // Réduction de max-h-14 à max-h-12 (3rem)
              />
            </div>
          </Link>
        </div>

        {/* Menus de navigation (Univers, Extraits, Contact, Abonnement) */}
        <div className="hidden md:flex space-x-6 items-center">
          {/* Accueil */}
          <Link href="/" className="relative font-bold group text-base font-iceberg uppercase text-white hover:text-green-500 transition-colors duration-200">
            <span className="shadow-text">Accueil</span>
          </Link>

          {/* Dropdown pour Univers */}
          <Dropdown
            overlay={universSubMenu}
            trigger={["hover"]}
            placement="bottom"
            overlayClassName="custom-submenu-dropdown"
          >
            <button className="relative font-bold group text-base font-iceberg uppercase text-white hover:text-green-500 transition-colors duration-200 flex items-center">
              <span className="shadow-text">Univers</span>
              <FaChevronDown className="ml-1" />
            </button>
          </Dropdown>

          {/* Extraits */}
          <Link href="/posts" className="relative font-bold group text-base font-iceberg uppercase text-white hover:text-green-500 transition-colors duration-200">
            <span className="shadow-text">Blogs</span>
          </Link>

          {/* Contact */}
          <Link href="/contact" className="relative font-bold group text-base font-iceberg uppercase text-white hover:text-green-500 transition-colors duration-200">
            <span className="shadow-text">Contact</span>
          </Link>

          {/* Abonnement */}
          <Link href="/subscription" className="relative font-bold group text-base font-iceberg uppercase text-white hover:text-green-500 transition-colors duration-200">
            <span className="shadow-text">Abonnement</span>
          </Link>
        </div>

        {/* Menu utilisateur pour grand écran */}
        <div ref={userMenuRef} className="hidden md:flex items-center space-x-3">
          {isLoggedIn && user ? (
            <Dropdown overlay={menuItems} trigger={["click"]}>
              <div className="flex items-center cursor-pointer group">
                {profileImageUrl ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-green-400">
                    <Image
                      src={profileImageUrl}
                      alt="User Avatar"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                ) : (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 bg-green-400 flex items-center justify-center">
                    <span className="text-white text-lg font-iceberg">
                      {user.pseudo.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="ml-2 text-white font-iceberg shadow-text group-hover:text-green-500 transition-colors duration-200">
                  {user.pseudo}
                </span>
                {user.role && (
                  <div className="ml-2">
                    <Badge role={user.role} />
                  </div>
                )}
              </div>
            </Dropdown>
          ) : (
            <>
              <Link href="/auth/login">
                <button
                  className="flex items-center relative group bg-green-400 hover:bg-green-600 text-white font-semibold py-1.5 px-5 rounded transition-all transform hover:scale-105 font-iceberg uppercase text-lg"
                >
                  <FiLogIn className="mr-2 w-5 h-5" />
                  Connexion
                </button>
              </Link>
              <Link href="/auth/register">
                <button
                  className="flex items-center relative group bg-green-400 hover:bg-green-600 text-white font-semibold py-1.5 px-5 rounded transition-all transform hover:scale-105 font-iceberg uppercase text-lg"
                >
                  <FiUserPlus className="mr-2 w-5 h-5" />
                  Inscription
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Menu hamburger pour mobile */}
        <div className="md:hidden z-50">
          <button
            className="text-white focus:outline-none hover:text-green-500 transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Barre de progression fixe en bas */}
      <div className={`fixed bottom-0 left-0 w-full h-1 bg-green-400 z-50 ${isMenuOpen ? "hidden" : ""}`}>
        <div
          className="h-full neon-effect transition-all duration-500"
          style={{
            width: `${scrollProgress}%`,
            // La couleur de fond est gérée par la variable CSS
          }}
        ></div>
      </div>

      {/* Menu mobile — panneau latéral */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Panneau slide depuis la droite */}
          <div className="fixed top-0 right-0 h-full w-4/5 max-w-xs bg-black border-l border-gray-800 z-[60] flex flex-col animate-slide-in-right">

            {/* Header panneau */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                <Image src="/logos/seranyaicon.png" alt="Seranya" width={110} height={40} className="object-contain" />
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-5 py-6">
              <ul className="space-y-1">

                <li>
                  <Link
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between py-3.5 px-3 rounded-lg font-iceberg uppercase text-gray-200 hover:text-green-400 hover:bg-green-500/5 transition-all duration-200 border-b border-gray-800/60"
                  >
                    Accueil
                  </Link>
                </li>

                {/* Univers — section dépliable */}
                <li>
                  <button
                    onClick={() => setIsUniversOpen(!isUniversOpen)}
                    className="w-full flex items-center justify-between py-3.5 px-3 rounded-lg font-iceberg uppercase text-gray-200 hover:text-green-400 hover:bg-green-500/5 transition-all duration-200 border-b border-gray-800/60"
                  >
                    Univers
                    <FaChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${isUniversOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isUniversOpen && (
                    <ul className="mt-1 ml-3 pl-3 border-l border-green-500/30 space-y-0.5 mb-2">
                      {[
                        { href: "/tutoriels", label: "Tutoriels" },
                        { href: "/univers", label: "Univers" },
                        { href: "/encyclopedie", label: "Encyclopédie" },
                      ].map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2 py-2.5 px-2 font-kanit text-sm text-gray-400 hover:text-green-400 transition-colors"
                          >
                            <span className="w-1 h-1 rounded-full bg-green-500/60 flex-shrink-0" />
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                <li>
                  <Link
                    href="/posts"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between py-3.5 px-3 rounded-lg font-iceberg uppercase text-gray-200 hover:text-green-400 hover:bg-green-500/5 transition-all duration-200 border-b border-gray-800/60"
                  >
                    Blogs
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between py-3.5 px-3 rounded-lg font-iceberg uppercase text-gray-200 hover:text-green-400 hover:bg-green-500/5 transition-all duration-200 border-b border-gray-800/60"
                  >
                    Contact
                  </Link>
                </li>

                <li>
                  <Link
                    href="/subscription"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between py-3.5 px-3 rounded-lg font-iceberg uppercase text-gray-200 hover:text-green-400 hover:bg-green-500/5 transition-all duration-200"
                  >
                    Abonnement
                  </Link>
                </li>

              </ul>
            </nav>

            {/* Zone utilisateur */}
            <div className="px-5 py-5 border-t border-gray-800">
              {isLoggedIn && user ? (
                <div className="space-y-3">
                  {/* Infos utilisateur */}
                  <div className="flex items-center gap-3 px-1 mb-4">
                    {profileImageUrl ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-green-400/60 flex-shrink-0">
                        <Image src={profileImageUrl} alt="Avatar" layout="fill" objectFit="cover" className="rounded-full" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-400/40 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-400 font-iceberg text-lg">{user.pseudo.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-white font-iceberg text-sm truncate">{user.pseudo}</p>
                      {user.role && <Badge role={user.role} />}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href="/admin/me"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1 text-center py-2.5 text-xs font-iceberg uppercase text-gray-300 border border-gray-700 rounded-lg hover:border-green-500/50 hover:text-green-400 transition-all"
                    >
                      Profil
                    </Link>
                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex-1 text-center py-2.5 text-xs font-iceberg uppercase text-gray-300 border border-gray-700 rounded-lg hover:border-green-500/50 hover:text-green-400 transition-all"
                      >
                        Admin
                      </Link>
                    )}
                  </div>

                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="w-full py-2.5 text-xs font-iceberg uppercase text-red-400 border border-red-900/40 rounded-lg hover:bg-red-900/20 transition-all flex items-center justify-center gap-2"
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
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-iceberg uppercase text-white bg-green-500 hover:bg-green-400 rounded-lg transition-all"
                  >
                    <FiLogIn className="w-4 h-4" />
                    Connexion
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-iceberg uppercase text-green-400 border border-green-500/40 hover:bg-green-500/10 rounded-lg transition-all"
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

      {/* Styles supplémentaires pour l'effet néon et les animations */}
      <style jsx>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.28s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .shadow-text {
          text-shadow: 1px 1px 0px #000000;
        }
        .group:hover .shadow-text,
        .active .shadow-text {
          color: #2ecc40;
          text-shadow: 0 0 10px green, 0 0 20px green, 0 0 30px green;
        }

        .custom-submenu-dropdown .ant-dropdown-menu {
          background-color: rgba(31, 41, 55, 0.75);
          border: none;
        }
        .custom-submenu-dropdown .ant-dropdown-menu-item {
          color: white;
          transition: background-color 0.3s ease;
        }
      `}</style>
    </nav>
  );
}
