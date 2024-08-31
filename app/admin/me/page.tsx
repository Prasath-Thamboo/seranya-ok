"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCurrentUser } from '@/lib/queries/AuthQueries';
import { RegisterUserModel } from '@/lib/models/AuthModels';
import { Image } from 'antd';
import Badge from '@/components/Badge';

const ProfilePage = () => {
  const [user, setUser] = useState<RegisterUserModel | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/auth/login'); // Rediriger si l'utilisateur n'est pas connecté
      }
    };

    fetchUser();
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6 sm:p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl font-kanit text-black">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src={typeof user.profileImage === 'string' ? user.profileImage : '/images/backgrounds/placeholder.jpg'}
            alt="User Avatar"
            className="rounded-full object-cover mb-4 shadow-lg"
            width={120}
            height={120}
          />
          <div className="flex items-center mt-2">
            <h1 className="text-3xl font-semibold mr-2">{user.pseudo}</h1>
            <Badge role={user.role} />
          </div>
          <p className="text-gray-500 mt-2">{user.email}</p>
        </div>

        {/* Personal Information Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Informations Personnelles</h2>
            <p className="text-gray-700"><strong>Nom :</strong> {user.name || 'N/A'}</p>
            <p className="text-gray-700"><strong>Nom de famille :</strong> {user.lastName || 'N/A'}</p>
            <p className="text-gray-700"><strong>Téléphone :</strong> {user.phone || 'N/A'}</p>
            <p className="text-gray-700"><strong>Adresse :</strong> {user.address || 'N/A'}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Détails du Compte</h2>
            <p className="text-gray-700"><strong>Rôle :</strong> {user.role}</p>
            <p className="text-gray-700"><strong>Statut :</strong> {user.status}</p>
            <p className="text-gray-700"><strong>Date de création :</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-700"><strong>Dernière mise à jour :</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Return Button */}
        <div className="flex justify-end mt-6">
          <button
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300"
            onClick={() => router.push('/admin')}
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
