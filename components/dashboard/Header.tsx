// spectralnext\components\dashboard\Header.tsx

import React, { useState, useEffect } from 'react';
import { FiBell } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { getAccessToken, fetchCurrentUser } from "@/lib/queries/AuthQueries";
import { RegisterUserModel, UserRole } from "@/lib/models/AuthModels";
import Badge from "@/components/Badge";

export default function Header() {
  const [user, setUser] = useState<RegisterUserModel | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      fetchCurrentUser()
        .then((userData) => {
          const profileImageUrl = `${process.env.NEXT_PUBLIC_API_URL_PROD}/uploads/users/${userData.id}/ProfileImage.png`;
          setUser({
            ...userData,
            profileImage: profileImageUrl,
            role: userData.role || UserRole.USER,
          });
        })
        .catch(() => {
          setUser(null);
        });
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Vérification stricte que profileImage est une chaîne valide
  const profileImageUrl =
    typeof user.profileImage === 'string' && user.profileImage
      ? user.profileImage
      : '/images/backgrounds/placeholder.jpg';

  return (
    <header className="z-10 py-4 bg-white shadow-md font-kanit">
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Section Profil et Notifications */}
        <ul className="flex items-center space-x-6">
          {/* Profil Utilisateur */}
          <li className="flex items-center space-x-3">
            <Link href={`/dashboard/users/viewUser/${user.pseudo}`} className="block shrink-0">
              <span className="sr-only">Profile</span>
              <Image
                alt={user.pseudo}
                src={profileImageUrl}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover border border-gray-200 hover:border-gray-400 transition-colors duration-300"
              />
            </Link>
            {/* Nom d'utilisateur et Badge */}
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-iceberg font-bold text-gray-900">{user.pseudo}</h1>
              <Badge role={user.role || UserRole.USER} />
            </div>
          </li>
          {/* Notifications */}
          <li className="relative">
            <button className="relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors duration-300">
              <FiBell className="w-5 h-5 text-black" />
              <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-600 border-2 border-white rounded-full"></span>
            </button>
          </li>
        </ul>

        {/* Séparateur Vertical */}
        <div className="hidden md:block h-8 w-px bg-gray-300"></div>

        {/* Barre de Recherche */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6M5 11a7 7 0 1114 0A7 7 0 015 11z" />
              </svg>
            </div>
            <input
              className="w-full h-12 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-500 bg-gray-100 border border-transparent rounded-md shadow-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-black"
              type="text"
              placeholder="Rechercher..."
              aria-label="Rechercher"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
