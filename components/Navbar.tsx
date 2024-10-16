// spectralnext/components/Navbar.tsx

"use client";

import { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAccessToken, logoutUser } from "@/lib/queries/AuthQueries";
import { fetchCurrentUser } from "@/lib/queries/AuthQueries";
import { RegisterUserModel } from "@/lib/models/AuthModels";
import Badge from "@/components/Badge";
import { Dropdown, Menu } from "antd";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa"; // Utilisation de FaChevronDown
import { useNotification } from "@/components/notifications/NotificationProvider";
import React from "react";
import { ColorContext } from "@/context/ColorContext"; // Importer le ColorContext

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
      className={`fixed top-0 w-full z-50 transition-colors duration-300 p-3 ${navbarBackground}`} // Réduction de p-5 à p-3
      style={{
        "--neon-color": color || "#008080", // Définir la variable CSS pour la couleur néon
      } as React.CSSProperties}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 flex items-center justify-between h-16"> {/* Réduction de px-4 sm:px-6 lg:px-8 à px-2 sm:px-4 lg:px-6 */}
        {/* Logo */}
        <div className="flex-shrink-0 p-2"> {/* Padding maintenu à p-2 */}
          <Link href="/">
            <div className="hidden md:block">
              <Image
                src="/logos/spectral-high-resolution-logo-white-transparent (1).png" // Utiliser le chemin correct vers votre logo
                alt="Logo Spectral"
                width={180} // Réduction de la largeur de 200 à 180
                height={70} // Réduction de la hauteur de 80 à 70
                className="object-contain max-h-16" // Réduction de max-h-20 à max-h-16 (4rem)
              />
            </div>
            <div className="block md:hidden">
              <Image
                src="/logos/spectral-favicon-color.png" // Assurez-vous que ce chemin est correct
                alt="Logo Spectral"
                width={60} // Réduction de la largeur de 70 à 60
                height={60} // Réduction de la hauteur de 70 à 60
                className="object-contain max-h-14" // Réduction de max-h-16 à max-h-14 (3.5rem)
              />
            </div>
          </Link>
        </div>

        {/* Menus de navigation (Univers, Extraits, Contact, Abonnement) */}
        <div className="hidden md:flex space-x-8 items-center">
          {/* Dropdown pour Univers */}
          <Dropdown
            overlay={universSubMenu}
            trigger={["hover"]}
            placement="bottom"
            overlayClassName="custom-submenu-dropdown"
          >
            <button className="relative group text-lg font-iceberg uppercase text-white hover:text-teal-500 transition-colors duration-200 flex items-center">
              <span className="shadow-text">Univers</span>
              <FaChevronDown className="ml-1" /> {/* Utilisation de FaChevronDown */}
            </button>
          </Dropdown>

          {/* Extraits */}
          <Link href="/posts" className="relative group text-lg font-iceberg uppercase text-white hover:text-teal-500 transition-colors duration-200">
            <span className="shadow-text">Extraits</span>
          </Link>

          {/* Contact */}
          <Link href="/contact" className="relative group text-lg font-iceberg uppercase text-white hover:text-teal-500 transition-colors duration-200">
            <span className="shadow-text">Contact</span>
          </Link>

          {/* Abonnement */}
          <Link href="/subscription" className="relative group text-lg font-iceberg uppercase text-white hover:text-teal-500 transition-colors duration-200">
            <span className="shadow-text">Abonnement</span>
          </Link>
        </div>

        {/* Menu utilisateur pour grand écran */}
        <div ref={userMenuRef} className="hidden md:flex items-center space-x-4">
          {isLoggedIn && user ? (
            <Dropdown overlay={menuItems} trigger={["click"]}>
              <div className="flex items-center cursor-pointer group">
                {profileImageUrl ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300">
                    <Image
                      src={profileImageUrl}
                      alt="User Avatar"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                ) : (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-500 flex items-center justify-center">
                    <span className="text-white text-xl font-iceberg">
                      {user.pseudo.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="ml-3 text-white font-iceberg shadow-text group-hover:text-teal-500 transition-colors duration-200">
                  {user.pseudo}
                </span>
                {user.role && (
                  <div className="ml-3">
                    <Badge role={user.role} />
                  </div>
                )}
              </div>
            </Dropdown>
          ) : (
            <>
              <Link href="/auth/login">
                <button className="relative group bg-teal-500 text-white font-semibold py-2 px-6 rounded transition-all transform hover:scale-105 hover:bg-teal-600 shadow-neon font-iceberg uppercase text-lg">
                  Connexion
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="relative group bg-teal-500 text-white font-semibold py-2 px-6 rounded transition-all transform hover:scale-105 hover:bg-teal-600 shadow-neon font-iceberg uppercase text-lg">
                  Inscription
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Menu hamburger pour mobile */}
        <div className="md:hidden z-50">
          <button
            className="text-white focus:outline-none hover:text-teal-500 transition-all"
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
              <button className="relative group text-lg font-iceberg uppercase text-white hover:text-teal-500 transition-colors duration-200 flex items-center">
                <span className="shadow-text">Univers</span>
                <FaChevronDown className="ml-1" /> {/* Utilisation de FaChevronDown */}
              </button>
            </Dropdown>

            {/* Extraits */}
            <Link href="/posts" className="relative group text-lg font-iceberg uppercase text-white hover:text-teal-500 transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
              <span className="shadow-text">Extraits</span>
            </Link>

            {/* Contact */}
            <Link href="/contact" className="relative group text-lg font-iceberg uppercase text-white hover:text-teal-500 transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
              <span className="shadow-text">Contact</span>
            </Link>

            {/* Abonnement */}
            <Link href="/subscription" className="relative group text-lg font-iceberg uppercase text-white hover:text-teal-500 transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
              <span className="shadow-text">Abonnement</span>
            </Link>

            {isLoggedIn && user ? (
              <>
                <Link href="/admin/me" className="relative group text-lg font-iceberg uppercase text-white hover:text-teal-500 transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                  <span className="shadow-text">Mon Profil</span>
                </Link>
                {user.role === "ADMIN" && (
                  <Link href="/admin" className="relative group text-lg font-iceberg uppercase text-white hover:text-teal-500 transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                    <span className="shadow-text">Administration</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="relative group text-lg font-iceberg uppercase text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="relative group text-lg font-iceberg uppercase text-white hover:text-teal-500 transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                  Connexion
                </Link>
                <Link href="/auth/register" className="relative group text-lg font-iceberg uppercase text-white hover:text-teal-500 transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                  Inscription
                </Link>
              </>
            )}
          </div>
        </>
      )}

      {/* Styles supplémentaires pour l'effet néon et les animations */}
      <style jsx>{`
        /* Effet néon pour la barre de progression */
        .neon-effect {
          box-shadow: 0 0 10px var(--neon-color, #008080),
                      0 0 20px var(--neon-color, #008080),
                      0 0 30px var(--neon-color, #008080);
          animation: neon-glow 1.5s ease-in-out infinite alternate;
          background-color: var(--neon-color, #008080);
        }

        @keyframes neon-glow {
          from {
            box-shadow: 0 0 10px var(--neon-color, #008080),
                        0 0 20px var(--neon-color, #008080),
                        0 0 30px var(--neon-color, #008080);
          }
          to {
            box-shadow: 0 0 20px var(--neon-color, #008080),
                        0 0 30px var(--neon-color, #008080),
                        0 0 40px var(--neon-color, #008080);
          }
        }

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
          color: teal;
          text-shadow: 0 0 10px teal, 0 0 20px teal, 0 0 30px teal;
        }

        /* Ombre néon pour les boutons */
        .shadow-neon {
          box-shadow: 0 0 10px var(--neon-color, #008080),
                      0 0 20px var(--neon-color, #008080),
                      0 0 30px var(--neon-color, #008080);
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

        .custom-submenu-dropdown .ant-dropdown-menu-item:hover {
          background-color: #008080; /* teal */
          color: white;
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

        .custom-submenu-dropdown .ant-dropdown-menu-item:hover {
          background-color: #008080; /* teal */
          color: white;
        }
      `}</style>
    </nav>
  );
}
