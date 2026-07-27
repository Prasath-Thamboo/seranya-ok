// seranyanext\components\dashboard\Header.tsx

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAccessToken, fetchCurrentUser } from "@/lib/queries/AuthQueries";
import { RegisterUserModel, UserRole } from "@/lib/models/AuthModels";
import Badge from "@/components/Badge";
import NotificationBell from "@/components/dashboard/NotificationBell";

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
      <div className="flex items-center justify-end h-full px-6 mx-auto text-black gap-4">
        {/* Right side: notification + user */}
        <div className="flex items-center gap-4">
          <NotificationBell />

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
