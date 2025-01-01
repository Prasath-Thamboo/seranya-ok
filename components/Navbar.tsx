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
          const profileImageUrl = `${process.env.NEXT_PUBLIC_API_URL_PROD}/uploads/users/${userData.id}/ProfileImage.png`;
          setUser({
            ...userData,
            profileImage: profileImageUrl,
          });
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
        setNavbarBackground("bg-gray-800 bg-opacity-75 backdrop-blur-md");
      } else {
        setNavbarBackground("bg-transparent"); // Remplace bg-gray-700 par bg-transparent
      }
    };

    window.addEventListener("scroll", handleNavbarScroll);
    window.addEventListener("scroll", handleScroll); // Listener pour mettre à jour la barre de progression

    // Initial call to set the correct background on page load
    handleNavbarScroll();

    return () => {
      window.removeEventListener("scroll", handleNavbarScroll);
      window.removeEventListener("scroll", handleScroll); // Nettoyage des listeners
    };
  }, []);

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
        <Link href="/univers">Encyclopédie</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link href="/univers/regions">Régions</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-colors duration-300 py-6 px-3 ${navbarBackground}`}
      style={{
        "--neon-color": color || "#2ecc40", // Définir la variable CSS pour la couleur néon
        "--button-bg-color": color || "#2ecc40", // Définir la variable CSS pour la couleur des boutons
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
                src="/logos//seranyaicon.png" // Assurez-vous que ce chemin est correct
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
          {/* Dropdown pour Univers */}
          <Dropdown
            overlay={universSubMenu}
            trigger={["hover"]}
            placement="bottom"
            overlayClassName="custom-submenu-dropdown"
          >
            <button className="relative group text-base font-iceberg uppercase text-white hover:text-green-500 transition-colors duration-200 flex items-center">
              <span className="shadow-text">Univers</span>
              <FaChevronDown className="ml-1" />
            </button>
          </Dropdown>

          {/* Extraits */}
          <Link href="/posts" className="relative group text-base font-iceberg uppercase text-white hover:text-green-500 transition-colors duration-200">
            <span className="shadow-text">Extraits</span>
          </Link>

          {/* Contact */}
          <Link href="/contact" className="relative group text-base font-iceberg uppercase text-white hover:text-green-500 transition-colors duration-200">
            <span className="shadow-text">Contact</span>
          </Link>

          {/* Abonnement */}
          <Link href="/subscription" className="relative group text-base font-iceberg uppercase text-white hover:text-green-500 transition-colors duration-200">
            <span className="shadow-text">Abonnement</span>
          </Link>
        </div>

        {/* Menu utilisateur pour grand écran */}
        <div ref={userMenuRef} className="hidden md:flex items-center space-x-3">
          {isLoggedIn && user ? (
            <Dropdown overlay={menuItems} trigger={["click"]}>
              <div className="flex items-center cursor-pointer group">
                {profileImageUrl ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
                    <Image
                      src={profileImageUrl}
                      alt="User Avatar"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                ) : (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-500 flex items-center justify-center">
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
                  className="flex items-center relative group bg-[var(--button-bg-color)] text-white font-semibold py-1.5 px-5 rounded transition-all transform hover:scale-105 hover:bg-[var(--button-hover-bg-color)] shadow-neon font-iceberg uppercase text-lg"
                >
                  <FiLogIn className="mr-2 w-5 h-5" />
                  Connexion
                </button>
              </Link>
              <Link href="/auth/register">
                <button
                  className="flex items-center relative group bg-[var(--button-bg-color)] text-white font-semibold py-1.5 px-5 rounded transition-all transform hover:scale-105 hover:bg-[var(--button-hover-bg-color)] shadow-neon font-iceberg uppercase text-lg"
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
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gray-700 z-50">
        <div
          className="h-full neon-effect transition-all duration-500"
          style={{
            width: `${scrollProgress}%`,
            // La couleur de fond est gérée par la variable CSS
          }}
        ></div>
      </div>

      {/* Overlay et Menu mobile */}
      {isMenuOpen && (
        <>
          {/* Gray background overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMenuOpen(false)} // Permet de fermer le menu en cliquant en dehors
          ></div>

          {/* Menu mobile */}
          <div className="fixed inset-x-0 top-16 md:hidden flex flex-col items-center space-y-4 text-center bg-gray-700 bg-opacity-90 z-50 p-5 animate-slide-in">
            {/* Dropdown mobile pour Univers */}
            <Dropdown
              overlay={universSubMenu}
              trigger={["click"]}
              placement="bottomLeft"
              overlayClassName="custom-submenu-dropdown"
            >
              <button className="relative group text-base font-iceberg uppercase text-white hover:text-green-500 transition-colors duration-200 flex items-center">
                <span className="shadow-text">Univers</span>
                <FaChevronDown className="ml-1" />
              </button>
            </Dropdown>

            {/* Extraits */}
            <Link href="/posts" className="relative group text-base font-iceberg uppercase text-white hover:text-green-500 transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
              <span className="shadow-text">Extraits</span>
            </Link>

            {/* Contact */}
            <Link href="/contact" className="relative group text-base font-iceberg uppercase text-white hover:text-green-500 transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
              <span className="shadow-text">Contact</span>
            </Link>

            {/* Abonnement */}
            <Link href="/subscription" className="relative group text-base font-iceberg uppercase text-white hover:text-green-500 transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
              <span className="shadow-text">Abonnement</span>
            </Link>

            {isLoggedIn && user ? (
              <>
                <Link href="/admin/me" className="relative group text-base font-iceberg uppercase text-white hover:text-green-500 transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                  <span className="shadow-text">Mon Profil</span>
                </Link>
                {user.role === "ADMIN" && (
                  <Link href="/admin" className="relative group text-base font-iceberg uppercase text-white hover:text-green-500 transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                    <span className="shadow-text">Administration</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="relative group text-base font-iceberg uppercase text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="relative group text-base font-iceberg text-white hover:text-green-500 transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                  <span className="shadow-text">Connexion</span>
                </Link>
                <Link href="/auth/register" className="relative group text-base font-iceberg uppercase text-white hover:text-green-500 transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                  <span className="shadow-text">Inscription</span>
                </Link>
              </>
            )}
          </div>
        </>
      )}

      {/* Styles supplémentaires pour l'effet néon et les animations */}
      <style jsx>{`
        /* Effet néon pour la barre de progression */
  
        /* Animation pour le menu mobile */
        @keyframes slide-in {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }

        /* Effet néon pour les textes */
        .shadow-text {
          text-shadow: 2px 2px 0px #000000;
        }

        /* Effet néon sur hover et actif */
        .group:hover .shadow-text,
        .active .shadow-text {
          color: #2ecc40;
          text-shadow: 0 0 10px green, 0 0 20px green, 0 0 30px green;
        }

        /* Styles personnalisés pour les sous-menus */
        .custom-submenu-dropdown .ant-dropdown-menu {
          background-color: rgba(31, 41, 55, 0.75); /* bg-gray-800 bg-opacity-75 */
          border: none;
        }

        .custom-submenu-dropdown .ant-dropdown-menu-item {
          color: white;
          transition: background-color 0.3s ease;
        }

        /* Styles personnalisés pour le sous-menu mobile */
        .custom-submenu-dropdown .ant-dropdown-menu {
          background-color: rgba(31, 41, 55, 0.75); /* bg-gray-800 bg-opacity-75 */
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
