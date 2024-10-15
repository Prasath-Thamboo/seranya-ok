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

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 p-5 ${navbarBackground}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <div className="hidden md:block">
              <Image
                src="/logos/spectral-high-resolution-logo-white-transparent (1).png"
                alt="Logo Spectral"
                width={150}
                height={50}
                className="object-contain"
              />
            </div>
            <div className="block md:hidden">
              <Image
                src="/logos/spectral-favicon-color (1).png"
                alt="Logo Spectral"
                width={50}
                height={50}
                className="object-contain"
              />
            </div>
          </Link>
        </div>

        {/* Menus de navigation (Univers, Contact, Abonnement) */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link href="/univers" className="text-white text-lg font-iceberg hover:text-gray-300 transition-colors duration-200 uppercase">
            <span className="stroke-text">Univers</span>
          </Link>
          <Link href="/contact" className="text-white text-lg font-iceberg hover:text-gray-300 transition-colors duration-200 uppercase">
            <span className="stroke-text">Contact</span>
          </Link>
          {/* Ajout du lien vers Abonnement */}
          <Link href="/subscription" className="text-white text-lg font-iceberg hover:text-gray-300 transition-colors duration-200 uppercase">
            <span className="stroke-text">Abonnement</span>
          </Link>
        </div>

        {/* Menu utilisateur pour grand écran */}
        <div ref={userMenuRef} className="hidden md:flex items-center space-x-4">
          {isLoggedIn && user ? (
            <Dropdown overlay={menuItems} trigger={["click"]}>
              <div className="flex items-center cursor-pointer">
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
                <span className="ml-2 text-white font-iceberg">{user.pseudo}</span>
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
                <button className="bg-transparent border border-white text-white font-semibold py-2 px-4 rounded transition-all transform hover:scale-105 hover:bg-white hover:text-black hover:border-black hover:shadow-lg font-iceberg uppercase text-lg">
                  Connexion
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="bg-white text-black font-semibold py-2 px-4 rounded transition-all transform hover:scale-105 hover:bg-gray-800 hover:text-white hover:border-white hover:shadow-lg font-iceberg uppercase text-lg">
                  Inscription
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Menu hamburger pour mobile */}
        <div className="md:hidden z-50">
          <button
            className="text-white focus:outline-none hover:text-gray-300 transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Progress bar fixed at the bottom */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gray-700 z-50">
        <div
          className="h-full neon-effect transition-all duration-500"
          style={{
            width: `${scrollProgress}%`,
            backgroundColor: color || "#008080", // Utiliser la couleur du contexte ou teal par défaut
            boxShadow: color
              ? `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`
              : "0 0 10px #008080, 0 0 20px #008080, 0 0 30px #008080",
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
            <Link href="/univers" className="text-white font-iceberg text-lg hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
              Univers
            </Link>
            <Link href="/contact" className="text-white font-iceberg text-lg hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            {/* Ajout du lien vers Abonnement dans le menu mobile */}
            <Link href="/subscription" className="text-white font-iceberg text-lg hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
              Abonnement
            </Link>
            {isLoggedIn && user ? (
              <>
                <Link href="/admin/me" className="text-white font-iceberg text-lg hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                  Mon Profil
                </Link>
                {user.role === "ADMIN" && (
                  <Link href="/admin" className="text-white font-iceberg text-lg hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                    Administration
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-red-500 font-iceberg text-lg hover:text-red-700"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-white font-iceberg text-lg hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                  Connexion
                </Link>
                <Link href="/auth/register" className="text-white font-iceberg text-lg hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                  Inscription
                </Link>
              </>
            )}
          </div>
        </>
      )}

      {/* Styles supplémentaires pour l'effet néon et les animations */}
      <style jsx>{`
        /* Effet néon pour la progress bar */
        .neon-effect {
          box-shadow: 0 0 10px rgba(0, 128, 128, 0.7),
                      0 0 20px rgba(0, 128, 128, 0.6),
                      0 0 30px rgba(0, 128, 128, 0.5);
          animation: neon-glow 1.5s ease-in-out infinite alternate;
        }

        @keyframes neon-glow {
          from {
            box-shadow: 0 0 10px rgba(0, 128, 128, 0.7),
                        0 0 20px rgba(0, 128, 128, 0.6),
                        0 0 30px rgba(0, 128, 128, 0.5);
          }
          to {
            box-shadow: 0 0 20px rgba(0, 128, 128, 1),
                        0 0 30px rgba(0, 128, 128, 0.8),
                        0 0 40px rgba(0, 128, 128, 0.6);
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
      `}</style>
    </nav>
  );
}
