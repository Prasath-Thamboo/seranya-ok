import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAccessToken, logoutUser } from "@/lib/queries/AuthQueries";
import { fetchCurrentUser } from "@/lib/queries/AuthQueries";
import { RegisterUserModel } from "@/lib/models/AuthModels";
import Badge from "@/components/Badge";
import { Dropdown, Menu } from "antd";
import { FiLogOut } from "react-icons/fi";
import { useNotification } from "@/components/notifications/NotificationProvider";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<RegisterUserModel | null>(null);
  const [navbarBackground, setNavbarBackground] = useState("transparent");
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
        setNavbarBackground("bg-black");
      } else {
        setNavbarBackground("transparent");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    const token = getAccessToken();
    if (token) {
      try {
        await logoutUser(token);
        setIsLoggedIn(false);
        setUser(null);
        addNotification("success", "Vous êtes déconnecté.");
      } catch (error) {
        addNotification("critical", "Une erreur s'est produite lors de la déconnexion.");
      }
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
    <nav className={`fixed top-0 w-full z-10 transition-colors duration-300 p-5 ${navbarBackground}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex-shrink-0">
          <Link href="/">
            <span className="text-2xl font-oxanium font-bold text-white">Spectral</span>
          </Link>
        </div>

        <div className="hidden md:flex space-x-4 font-kanit">
          <Link href="/about" className="text-white hover:text-gray-300">
            À propos
          </Link>
          <Link href="/services" className="text-white hover:text-gray-300">
            Services
          </Link>
          <Link href="/contact" className="text-white hover:text-gray-300">
            Contact
          </Link>
        </div>

        <div ref={userMenuRef} className="hidden md:flex items-center space-x-4 font-kanit">
          {isLoggedIn && user ? (
            <Dropdown overlay={menuItems} trigger={["click"]}>
              <div className="flex items-center cursor-pointer">
                <Image
                  src={typeof user.profileImage === "string" ? user.profileImage : "/images/backgrounds/placeholder.jpg"}
                  alt="User Avatar"
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-gray-300 object-cover"
                />
                <span className="ml-2 text-white">{user.pseudo}</span>
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
                <button className="bg-transparent border border-white text-white font-semibold py-2 px-4 rounded transition-all transform hover:scale-105 hover:bg-white hover:text-black hover:border-black hover:shadow-white-glow">
                  Connexion
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="bg-white text-black font-semibold py-2 px-4 rounded transition-all transform hover:scale-105 hover:bg-gray-800 hover:text-white hover:border-white hover:shadow-white-glow">
                  Inscription
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
