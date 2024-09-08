import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAccessToken, logoutUser } from "@/lib/queries/AuthQueries";
import { fetchCurrentUser } from "@/lib/queries/AuthQueries";
import { RegisterUserModel } from "@/lib/models/AuthModels";
import Badge from "@/components/Badge";
import { Dropdown, Menu } from "antd";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useNotification } from "@/components/notifications/NotificationProvider";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<RegisterUserModel | null>(null);
  const [navbarBackground, setNavbarBackground] = useState("bg-transparent");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { addNotification } = useNotification();

  useEffect(() => {
    const token = getAccessToken();

    if (token) {
      fetchCurrentUser()
        .then((userData) => {
          setUser(userData);
          setIsLoggedIn(true);
        })
        .catch(() => {
          setIsLoggedIn(false);
        });
    } else {
      setIsLoggedIn(false);
    }

    const handleScroll = () => {
      if (window.scrollY > 0) {
        setNavbarBackground("bg-black bg-opacity-75 backdrop-blur-md");
      } else {
        setNavbarBackground("bg-transparent");
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
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
        <Link href="/profile">Profile</Link>
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

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 p-5 ${navbarBackground}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex-shrink-0">
          {/* Utilisation des logos selon la taille de l'écran */}
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

        {/* Menu pour grand écran */}
        <div className="hidden md:flex space-x-8 text-white">
          <Link
            href="/univers"
            className="hover:text-gray-300 transition-colors duration-300 font-iceberg uppercase text-lg"
            style={{ textShadow: "1px 1px 2px black" }}
          >
            Univers
          </Link>
          <Link
            href="/contact"
            className="hover:text-gray-300 transition-colors duration-300 font-iceberg uppercase text-lg"
            style={{ textShadow: "1px 1px 2px black" }}
          >
            Contact
          </Link>
        </div>

        {/* Menu utilisateur pour grand écran */}
        <div ref={userMenuRef} className="hidden md:flex items-center space-x-4">
          {isLoggedIn && user ? (
            <Dropdown overlay={menuItems} trigger={["click"]}>
              <div className="flex items-center cursor-pointer">
                <Image
                  src={typeof user.profileImage === "string" ? user.profileImage : "/images/backgrounds/placeholder.jpg"}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-gray-300 object-cover"
                />
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
        <div className="md:hidden">
          <button
            className="text-white focus:outline-none hover:text-gray-300 transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu déroulant pour mobile */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 transition-all duration-300 ease-in-out">
          <div className="bg-black bg-opacity-75 p-4 rounded-lg shadow-lg">
            <Link
              href="/univers"
              className="block text-white py-2 px-4 hover:text-gray-300 transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Univers
            </Link>
            <Link
              href="/contact"
              className="block text-white py-2 px-4 hover:text-gray-300 transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Affichage du menu utilisateur sur mobile */}
            {isLoggedIn && user ? (
              <div className="mt-4">
                <Dropdown overlay={menuItems} trigger={["click"]}>
                  <div className="flex items-center cursor-pointer">
                    <Image
                      src={typeof user.profileImage === "string" ? user.profileImage : "/images/backgrounds/placeholder.jpg"}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-gray-300 object-cover"
                    />
                    <span className="ml-2 text-white font-iceberg">{user.pseudo}</span>
                    {user.role && (
                      <div className="ml-2">
                        <Badge role={user.role} />
                      </div>
                    )}
                  </div>
                </Dropdown>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <Link href="/auth/login">
                  <button className="w-full bg-transparent border border-white text-white font-semibold py-2 px-4 rounded transition-all hover:bg-white hover:text-black hover:border-black hover:shadow-lg">
                    Connexion
                  </button>
                </Link>
                <Link href="/auth/register">
                  <button className="w-full bg-white text-black font-semibold py-2 px-4 rounded transition-all hover:bg-gray-800 hover:text-white hover:border-white hover:shadow-lg">
                    Inscription
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
