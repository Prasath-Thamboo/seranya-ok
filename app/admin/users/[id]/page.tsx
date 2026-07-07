"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Image } from 'antd';
import { FaEdit, FaEnvelope, FaMapMarkerAlt, FaPhone, FaAt } from 'react-icons/fa';
import { fetchUserById } from '@/lib/queries/UserQueries';
import { getAccessToken } from '@/lib/queries/AuthQueries';
import { UserModel } from '@/lib/models/UserModels';
import DividersWithHeading from '@/components/DividersWhithHeading';
import Badge from '@/components/Badge';

const UserViewPage = () => {
  const params = useParams();
  const paramId = params?.id as string | undefined;
  const id = paramId ? parseInt(paramId, 10) : null;
  const [user, setUser] = useState<UserModel | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        const token = getAccessToken();
        if (!token) return;
        try {
          const fetchedUser = await fetchUserById(id, token);
          setUser(fetchedUser);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };
    fetchUserData();
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-2xl font-kanit text-black relative">
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            className="bg-black text-white p-2 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-transform transform hover:scale-110 hover:border"
            onClick={() => router.push(`/admin/users/update?id=${id}`)}
          >
            <FaEdit className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col items-center mb-8">
          <Image
            src={user.profileImage || '/images/backgrounds/placeholder.jpg'}
            alt={`${user.pseudo} Profile`}
            width={120}
            height={120}
            className="rounded-full mb-4"
            style={{ objectFit: 'cover' }}
            preview={true}
          />
          <DividersWithHeading
            text={user.pseudo}
            customStyle="text-3xl text-black font-bold font-oxanium uppercase text-center"
          />
          <div className="mt-2">
            <Badge role={user.role} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-2">
            <FaAt className="text-gray-500 shrink-0" />
            <span>{user.name} {user.lastName}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-gray-500 shrink-0" />
            <span className="break-all">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-2">
              <FaPhone className="text-gray-500 shrink-0" />
              <span>{user.phone}</span>
            </div>
          )}
          {user.address && (
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-500 shrink-0" />
              <span>{user.address}</span>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 italic mt-8">
          <p className="mb-2">Créé le : {new Date(user.createdAt).toLocaleDateString()}</p>
          <p className="mb-2">Mis à jour le : {new Date(user.updatedAt).toLocaleDateString()}</p>
        </div>

        <div className="text-right mt-4">
          <p className="text-lg font-semibold">Statut : {user.status}</p>
        </div>
      </div>
    </div>
  );
};

export default UserViewPage;
