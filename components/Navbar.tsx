import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAccessToken, logoutUser } from "@/lib/queries/AuthQueries";
import { fetchCurrentUser } from "@/lib/queries/AuthQueries";
import { RegisterUserModel } from "@/lib/models/AuthModels";
import Badge from "@/components/Badge";
import { Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { FiLogOut } from "react-icons/fi";  // Importing logout icon
import { NotificationFlash } from "@/components/Notification";  // Importing NotificationFlash component

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<RegisterUserModel | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getAccessToken();

    if (token) {
      fetchCurrentUser()
        .then((userData) => {
          setUser(userData);
          setIsLoggedIn(true);
          if (userMenuRef.current) {
            setMenuWidth(userMenuRef.current.offsetWidth); // Set the menu width based on the user div width
          }
          // Trigger login success notification
          setNotificationMessage("Login successful");
          setShowNotification(true);
        })
        .catch(() => {
          setIsLoggedIn(false);
        });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    const token = getAccessToken();
    if (token) {
      logoutUser(token);
      setIsLoggedIn(false);
      setUser(null);
      // Trigger logout success notification
      setNotificationMessage("Logout successful");
      setShowNotification(true);
    }
  };

  return (
    <>
      {showNotification && (
        <NotificationFlash
          type="success"
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
        />
      )}
      <nav className="bg-white/80 backdrop-blur-md fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/">
                <span className="text-2xl font-oxanium font-bold text-black">Spectral</span>
              </Link>
            </div>

            <div className="hidden md:flex space-x-4 font-kanit">
              <Link href="/about" className="text-gray-800 hover:text-gray-600">À propos</Link>
              <Link href="/services" className="text-gray-800 hover:text-gray-600">Services</Link>
              <Link href="/contact" className="text-gray-800 hover:text-gray-600">Contact</Link>
            </div>

            <div ref={userMenuRef} className="hidden md:flex items-center space-x-4 font-kanit">
              {isLoggedIn && user ? (
                <Menu placement="bottom-end">
                  <MenuHandler>
                    <div className="flex items-center cursor-pointer">
                      <Image
                        src={
                          typeof user.profileImage === "string"
                            ? user.profileImage
                            : "/images/backgrounds/placeholder.jpg"
                        }
                        alt="User Avatar"
                        width={48}
                        height={48}
                        className="rounded-full border-2 border-gray-300 object-cover"
                      />
                      <span className="ml-2 text-gray-800">{user.pseudo}</span>
                      {user.role && (
                        <div className="ml-2">
                          <Badge role={user.role} />
                        </div>
                      )}
                    </div>
                  </MenuHandler>
                  <MenuList className="text-left font-kanit text-black" style={{ width: menuWidth }}>
                    <MenuItem className="p-2 hover:bg-gray-200 text-left">
                      <Link href="/profile">Profile</Link>
                    </MenuItem>
                    {user.role === "ADMIN" && (
                      <MenuItem className="p-2 hover:bg-gray-200 text-left">
                        <Link href="/admin">Administration</Link>
                      </MenuItem>
                    )}
                    <MenuItem 
                      className="p-2 flex items-center space-x-2 hover:bg-red-500 hover:text-white transition-colors duration-300 text-left"
                      onClick={handleLogout}
                    >
                      <FiLogOut className="w-5 h-5" /> {/* Logout icon */}
                      <span>Déconnexion</span>
                    </MenuItem>
                  </MenuList>
                </Menu>
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

            <div className="md:hidden flex items-center">
              <button className="text-gray-800 focus:outline-none">
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/about" className="text-gray-800 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200">
              À propos
            </Link>
            <Link href="/services" className="text-gray-800 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200">
              Services
            </Link>
            <Link href="/contact" className="text-gray-800 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200">
              Contact
            </Link>
            {!isLoggedIn && (
              <>
                <Link href="/auth/login" className="text-gray-800 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200">
                  Connexion
                </Link>
                <Link href="/auth/register" className="text-gray-800 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200">
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
