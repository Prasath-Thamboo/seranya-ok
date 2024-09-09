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
          const profileImageUrl = `${process.env.NEXT_PUBLIC_API_URL_LOCAL || process.env.NEXT_PUBLIC_API_URL_PROD}/uploads/users/${userData.id}/ProfileImage.png`;
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
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-black">
        <ul className="flex items-center space-x-6">
          <li className="flex items-center space-x-3">
            {/* Lien vers le profil utilisateur */}
            <Link href={`/dashboard/users/viewUser/${user.pseudo}`} className="block shrink-0">
              <span className="sr-only">Profile</span>
              {/* Image de profil avec vérification du type et fallback */}
              <Image
                alt={user.pseudo}
                src={profileImageUrl}  // L'URL de l'image est validée pour éviter l'erreur TypeScript
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover border border-gray-200"
              />
            </Link>
            {/* Affichage du nom d'utilisateur et du badge de rôle */}
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-iceberg font-bold text-gray-900">
                {user.pseudo}
              </h1>
              <Badge role={user.role || UserRole.USER} />
            </div>
          </li>
          <li className="relative">
            {/* Icone de notifications */}
            <button className="relative align-middle rounded-md focus:outline-none">
              <FiBell className="w-5 h-5 text-black" />
              <span className="absolute top-0 right-0 inline-block w-3 h-3 transform bg-red-600 border-2 border-white rounded-full"></span>
            </button>
          </li>
        </ul>
        {/* Séparateur vertical */}
        <div className="h-8 w-px bg-gray-300 mx-6"></div>
        <div className="flex flex-1">
          <div className="relative w-full max-w-xl mr-6">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <svg
                className="w-4 h-4 text-black"
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
            {/* Champ de recherche */}
            <input
              className="w-full h-12 pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md shadow focus:placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-black form-input"
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
