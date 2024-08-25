import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAccessToken, logoutUser } from '@/lib/queries/AuthQueries';
import { fetchCurrentUser } from '@/lib/queries/AuthQueries';
import { RegisterUserModel } from '@/lib/models/AuthModels';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<RegisterUserModel | null>(null);

  useEffect(() => {
    const token = getAccessToken(); // Retrieve the token using getAccessToken

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
  }, []);

  const handleLogout = () => {
    logoutUser(); // Clear the token using logoutUser
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
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

          <div className="hidden md:flex items-center space-x-4 font-kanit">
            {isLoggedIn && user ? (
              <div className="flex items-center">
                <Image
                  src={user.profileImage || '/images/backgrounds/placeholder.jpg'}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-gray-300 object-cover"
                />
                <span className="ml-2 text-gray-800">{user.pseudo}</span>
                <button
                  onClick={handleLogout}
                  className="ml-4 bg-transparent border border-white text-white font-semibold py-2 px-4 rounded transition-all transform hover:scale-105 hover:bg-white hover:text-black hover:border-black hover:shadow-white-glow"
                >
                  Déconnexion
                </button>
              </div>
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
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
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
            Contact</Link>
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
  );
}
