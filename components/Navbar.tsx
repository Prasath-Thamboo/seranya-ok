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
      : "/images/backgrounds/placeholder.jpg"; // Fallback image

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

        {/* Menus de navigation (Univers, Contact) */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link href="/univers" className="text-white text-lg font-iceberg hover:text-gray-300 transition-colors duration-200">
          
              Univers

          </Link>
          <Link href="/contact" className="text-white text-lg font-iceberg hover:text-gray-300 transition-colors duration-200">
          
              Contact

          </Link>
        </div>

        {/* Menu utilisateur pour grand écran */}
        <div ref={userMenuRef} className="hidden md:flex items-center space-x-4">
          {isLoggedIn && user ? (
            <Dropdown overlay={menuItems} trigger={["click"]}>
              <div className="flex items-center cursor-pointer">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
                  <Image
                    src={profileImageUrl}
                    alt="User Avatar"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
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

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-4 text-center">
          <Link href="/univers">
            <a className="text-white font-iceberg text-lg hover:text-gray-300">
              Univers
            </a>
          </Link>
          <Link href="/contact">
            <a className="text-white font-iceberg text-lg hover:text-gray-300">
              Contact
            </a>
          </Link>
          {isLoggedIn && user ? (
            <>
              <Link href="/admin/me">
                <a className="text-white font-iceberg text-lg hover:text-gray-300">
                  Mon Profil
                </a>
              </Link>
              {user.role === "ADMIN" && (
                <Link href="/admin">
                  <a className="text-white font-iceberg text-lg hover:text-gray-300">
                    Administration
                  </a>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-red-500 font-iceberg text-lg hover:text-red-700"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <a className="text-white font-iceberg text-lg hover:text-gray-300">
                  Connexion
                </a>
              </Link>
              <Link href="/auth/register">
                <a className="text-white font-iceberg text-lg hover:text-gray-300">
                  Inscription
                </a>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
