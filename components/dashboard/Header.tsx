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
    return <div className="h-[57px] border-b border-line bg-raised" />;
  }

  // Vérification stricte que profileImage est une chaîne valide
  const profileImageUrl =
    typeof user.profileImage === 'string' && user.profileImage
      ? user.profileImage
      : '/images/backgrounds/placeholder.jpg';

  return (
    <header className="z-10 flex-shrink-0 border-b border-line bg-raised py-3 font-sans">
      <div className="mx-auto flex h-full items-center justify-end gap-4 px-6 text-ink">
        <div className="flex items-center gap-4">
          <NotificationBell />

          <div className="h-6 w-px bg-line" />

          <Link href={`/admin/me`} className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <Image
              alt={user.pseudo}
              src={profileImageUrl}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover ring-1 ring-line"
            />
            <div className="hidden flex-col sm:flex">
              <span className="text-sm font-serif font-medium leading-tight text-ink">
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
