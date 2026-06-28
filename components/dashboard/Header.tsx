// seranyanext\components\dashboard\Header.tsx

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
          setUser({
            ...userData,
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
    <header className="z-10 py-3 bg-white border-b border-gray-200 shadow-sm font-kanit flex-shrink-0">
      <div className="flex items-center justify-between h-full px-6 mx-auto text-black gap-4">
        {/* Search bar */}
        <div className="flex flex-1 max-w-md">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
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
              className="w-full h-10 pl-9 pr-4 text-sm text-gray-700 placeholder-gray-400 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all"
              type="text"
              placeholder="Rechercher..."
              aria-label="Rechercher"
            />
          </div>
        </div>

        {/* Right side: notification + user */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none">
            <FiBell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          <div className="h-6 w-px bg-gray-200"></div>

          <Link href={`/admin/me`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              alt={user.pseudo}
              src={profileImageUrl}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-200"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-iceberg font-bold text-gray-900 leading-tight">
                {user.pseudo}
              </span>
              <Badge role={user.role || UserRole.USER} />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
